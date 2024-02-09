import fs from 'fs'
import path from 'path'
import { getMappedOffsetAt as getMappedOffsetAtOriginal } from './getMappedOffsetAt'

type Options = {
	filename: string
	debug?: boolean
	defines?: Map<string, MacroItem>
	resolveFn?: (
		includeParam: string,
		sourceFilename: string,
		position: [start: number, end: number]
	) => Promise<{ contents: string; filename: string }>
}

export type SourceMapItem = {
	offset: number
	fileOffset: number
	file: string
}

type MacroItem = {
	args: string[]
	value: string
	file: string
	location: [from: number, to: number]
	valueLocation: [from: number, to: number]
}

const COMMANDS = [
	'include',
	'define',
	'ifdef',
	'ifndef',
	'if',
	'undef',
] as const

type Commands = (typeof COMMANDS)[number]

export class PreprocessorError extends Error {}

export type Preprocessed = {
	code: string
	defines: Map<string, MacroItem>
	sourceMap: SourceMapItem[]
}

const localFsResolve = async (includeParam: string, sourceFilename: string) => {
	const filePath = path.join(path.dirname(sourceFilename), includeParam)
	const contents = await fs.promises.readFile(filePath, 'utf-8')

	return {
		contents,
		filename: filePath,
	}
}

export const preprocess = async (
	code: string,
	{
		filename,
		debug = false,
		defines = new Map<string, MacroItem>(),
		resolveFn = localFsResolve,
	}: Options
): Promise<Preprocessed> => {
	const sourceMap = [] as SourceMapItem[]

	let index = 0

	const raise = (message: string) => {
		const offset = index
		const line = code.slice(0, offset).split('\n').length
		const lastLineIndex = code.slice(0, offset).lastIndexOf('\n')

		console.log(code)

		throw new PreprocessorError(
			`Parse error at ${line}:${offset - lastLineIndex}: ${message}`
		)
	}

	const skipWhitespace = () => {
		while (
			index < code.length &&
			(code[index] === ' ' || code[index] === '\t' || code[index] === '\r')
		) {
			index++
		}
	}

	const expectWhitespace = () => {
		const next = peek(0)
		if (next !== ' ' && next !== '\t' && next !== '\r') {
			raise('Expected whitespace, got >>' + next + '<<')
		}

		while (
			index < code.length &&
			(code[index] === ' ' || code[index] === '\t')
		) {
			index++
		}
	}

	const peek = (n: number) => {
		if (index + n >= code.length) {
			raise('Unexpected end of file')
		}

		return code[index + n]
	}

	const pop = () => {
		if (index >= code.length) {
			raise('Unexpected end of file')
		}

		return code[index++]
	}

	const skipNewLines = () => {
		while (
			index < code.length &&
			(code[index] === '\n' || code[index] === '\r')
		) {
			index++
		}
	}

	const parseCommand = (): Commands => {
		if (peek(0) !== '#') {
			raise('Expected #')
		}

		pop()

		for (const command of COMMANDS) {
			if (code.slice(index, index + command.length) === command) {
				index += command.length
				return command
			}
		}

		return raise(
			`Unknown preprocessor command: ${code.slice(index, index + 10)}`
		)
	}

	const parseIncludeArg = () => {
		const item = peek(0)
		if (item === '"') {
			pop()
			let result = ''
			while (peek(0) !== '"') {
				result += pop()
			}
			pop()
			return result
		}

		if (item === '<') {
			pop()
			let result = ''
			while (peek(0) !== '>') {
				result += pop()
			}
			pop()
			return result
		}

		return raise('Expected " or <')
	}

	const parseMacroName = () => {
		let name = ''
		const firstToken = peek(0)
		if (!firstToken.match(/[A-Z]/i)) {
			raise(
				'Expected macro name to start with a letter, got >>' + firstToken + '<<'
			)
		}

		name += pop()

		while (/[A-Z_0-9]/i.test(peek(0))) {
			name += pop()
		}

		if (peek(0) === '(') {
			pop()
			let args = ''
			while (peek(0) !== ')') {
				args += code[index]
				pop()
			}
			pop()

			return {
				name,
				args: args.split(',').map((a) => a.trim()),
			}
		}

		return { name, args: [] }
	}

	const parseMacroValue = () => {
		let value = ''
		while (index < code.length && peek(0) !== '\n') {
			if (peek(0) === '\\' && peek(1) === '\n') {
				index += 2
				continue
			}

			value += pop()
		}

		return value
	}

	const getMappedOffsetAt = (offset: number) =>
		getMappedOffsetAtOriginal(sourceMap, offset, filename)

	const applyMacros = (
		input: string,
		sourceMapOptions?: { offset: number }
	) => {
		const macros = Array.from(defines.entries()).sort(
			(a, b) => b[0].length - a[0].length
		)

		let internalIndex = 0
		while (internalIndex < input.length) {
			const matchingMacro = macros.find(([name]) => {
				return input.slice(internalIndex, internalIndex + name.length) === name
			})

			if (matchingMacro) {
				const mappedOffset = sourceMapOptions
					? getMappedOffsetAt(sourceMapOptions.offset + internalIndex)
					: null

				const [name, macro] = matchingMacro
				const { value } = macro

				// TODO: Is this good idea?
				let fullyResolvedValue = value
				while (true) {
					const newFullyResolvedValue = applyMacros(fullyResolvedValue)
					if (newFullyResolvedValue === fullyResolvedValue) {
						break
					}

					fullyResolvedValue = newFullyResolvedValue
				}

				// TODO: Apply args!
				input =
					input.slice(0, internalIndex) +
					fullyResolvedValue +
					input.slice(internalIndex + name.length)

				if (sourceMapOptions && mappedOffset) {
					sourceMap.push({
						offset: sourceMapOptions.offset + internalIndex,
						fileOffset: macro.valueLocation[0],
						file: macro.file,
					})

					sourceMap.push({
						offset:
							sourceMapOptions.offset +
							internalIndex +
							fullyResolvedValue.length,
						// TODO: This will have to also include the args
						fileOffset: mappedOffset.offset + name.length,
						file: mappedOffset.file,
					})
				}
			} else {
				internalIndex++
			}
		}

		return input
	}

	while (index < code.length) {
		skipNewLines()

		const macroStart = index
		const current = code[index]
		if (current === '#') {
			const command = parseCommand()

			switch (command) {
				case 'include': {
					const mappedOffsetStart = getMappedOffsetAt(macroStart)

					skipWhitespace()

					const file = parseIncludeArg()

					skipWhitespace()

					const resolved = await resolveFn(file, filename, [macroStart, index])
					const filePath = resolved.filename

					const included = await preprocess(resolved.contents, {
						filename: filePath,
						defines,
						debug,
						resolveFn,
					})

					code = code.slice(0, macroStart) + included.code + code.slice(index)

					for (const [name, value] of included.defines) {
						defines.set(name, value)
					}

					for (const item of included.sourceMap) {
						sourceMap.push(item)
					}

					sourceMap.push({
						offset: macroStart,
						fileOffset: 0,
						file: filePath,
					})

					sourceMap.push({
						offset: macroStart + included.code.length,
						fileOffset: mappedOffsetStart.offset + (index - macroStart),
						file: mappedOffsetStart.file,
					})

					index = macroStart

					break
				}

				case 'undef': {
					const mappedOffsetStart = getMappedOffsetAt(macroStart)

					// TODO: This will only remove the contents, we should try to evaluate
					expectWhitespace()

					parseMacroName().name

					code = code.slice(0, macroStart) + code.slice(index)

					index = macroStart

					sourceMap.push({
						offset: index,
						fileOffset: mappedOffsetStart.offset,
						file: mappedOffsetStart.file,
					})

					break
				}

				case 'define': {
					const mappedOffsetStart = getMappedOffsetAt(index)

					expectWhitespace()

					const { name, args } = parseMacroName()

					skipWhitespace()

					if (code[index] === '\n') {
						continue
					}

					const mappedValueOffsetStart = getMappedOffsetAt(index)

					// TODO: Should we apply the macros here?
					const value = parseMacroValue()

					const mappedOffsetEnd = getMappedOffsetAt(index)

					debug && console.log('define', { name, args, value })

					defines.set(name, {
						args,
						value,
						file: mappedOffsetStart.file,
						location: [mappedOffsetStart.offset, mappedOffsetEnd.offset],
						valueLocation: [
							mappedValueOffsetStart.offset,
							mappedOffsetEnd.offset,
						],
					})

					// TODO: This doesn't require mapping, but will break when there a escaped newline in the macro
					code =
						code.slice(0, macroStart) +
						' '.repeat(index - macroStart) +
						code.slice(index)

					break
				}

				case 'ifndef':
				case 'ifdef':
				case 'if': {
					const mappedOffsetStart = getMappedOffsetAt(macroStart)

					// TODO: This will only remove the contents, we should try to evaluate
					expectWhitespace()

					parseMacroName().name

					while (index < code.length) {
						if (code.slice(index, index + '#endif'.length) === '#endif') {
							index += '#endif'.length
							break
						}

						if (code.slice(index, index + '#else'.length) === '#else') {
							index += '#else'.length
							continue
						}

						index++
					}

					code = code.slice(0, macroStart) + code.slice(index)

					index = macroStart

					sourceMap.push({
						offset: index,
						fileOffset: mappedOffsetStart.offset,
						file: mappedOffsetStart.file,
					})

					break
				}

				case 'if': {
					// TODO: Implement

					while (index < code.length && code[index] !== '\n') {
						index++
					}

					code = code.slice(0, macroStart) + code.slice(index)
					break
				}

				default:
					raise(`Unknown preprocessor command: ${command}`)
			}
		} else {
			const lineStart = index

			while (index < code.length && code[index] !== '\n') {
				index++
			}

			code =
				code.slice(0, lineStart) +
				applyMacros(code.slice(lineStart, index), { offset: lineStart }) +
				code.slice(index)
		}
	}

	return {
		code,
		sourceMap,
		defines,
	}
}
