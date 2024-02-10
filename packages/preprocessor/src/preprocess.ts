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

const replaceSpecials = (token: string) =>
	token.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')

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

	const parseMacroName = (allowArgs = true) => {
		let name = ''
		const firstToken = peek(0)
		if (!firstToken.match(/[A-Z]/i)) {
			raise(
				`Expected macro name to start with a letter, got ${replaceSpecials(
					firstToken
				)}`
			)
		}

		name += pop()

		while (/[A-Z_0-9]/i.test(peek(0))) {
			name += pop()
		}

		if (allowArgs && peek(0) === '(') {
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
		while (index < code.length) {
			if (peek(0) === '\r' && peek(1) === '\n') {
				break
			}

			if (peek(0) === '\n') {
				break
			}

			if (peek(0) === '\\') {
				if (peek(1) === '\r' && peek(2) === '\n') {
					index += 3
					continue
				}

				if (peek(1) === '\n') {
					index += 2
					continue
				}
			}

			value += pop()
		}

		return value
	}

	const getMappedOffsetAt = (offset: number) =>
		getMappedOffsetAtOriginal(sourceMap, offset, filename)

	const applyMacros = (
		input: string,
		sourceMapOptions?: { offset: number },
		overrideDefines?: Map<string, MacroItem>
	) => {
		const macros = [...(overrideDefines ?? defines).entries()].sort(
			(a, b) => b[0].length - a[0].length
		)

		let internalIndex = 0
		while (internalIndex < input.length) {
			const macroStart = internalIndex

			let identifierPrefix = ''
			if (input.slice(internalIndex, internalIndex + 2) === '##') {
				identifierPrefix += '##'
				internalIndex += 2
			} else if (input[internalIndex] === '#') {
				identifierPrefix += '#'
				internalIndex++
			}

			let identifier = ''
			while (internalIndex < input.length && /\w/.test(input[internalIndex])) {
				identifier += input[internalIndex]
				internalIndex++
			}

			const matchingMacro = macros.find(([name]) => {
				return identifier === name
			})

			if (matchingMacro) {
				// Ending glue
				if (input.slice(internalIndex, internalIndex + 2) === '##') {
					internalIndex += 2
				}

				const mappedOffset = sourceMapOptions
					? getMappedOffsetAt(sourceMapOptions.offset + internalIndex)
					: null

				const [, macro] = matchingMacro
				const { value } = macro
				let thisArgs = ''

				let fullyResolvedValue =
					identifierPrefix === '#' ? '"' + value + '"' : value

				// Parse arguments if needed
				if (macro.args.length > 0) {
					// TODO: Should this cause an error?
					if (input[internalIndex] !== '(') {
						raise(`Expected (, got ${replaceSpecials(input[index])}`)
					}

					internalIndex++

					// Collect arguments
					while (internalIndex < input.length) {
						if (input[internalIndex] === ')') {
							break
						}

						thisArgs += input[internalIndex]
						internalIndex++
					}

					internalIndex++

					const inputArgs = thisArgs.split(',').map((a) => a.trim())

					// Apply arguments
					fullyResolvedValue = applyMacros(
						fullyResolvedValue,
						undefined,
						new Map(
							macro.args.map((a, i) => [
								a,
								{
									name: a,
									args: [],
									file: macro.file,
									location: [0, 0],
									valueLocation: [0, 0],
									value: inputArgs[i],
								} as MacroItem,
							])
						)
					)
				}

				// Continue applying macros until no more changes
				// TODO: Is this the best way? We could maybe go back to the previous index?
				let iterations = 0

				while (true) {
					const newFullyResolvedValue = applyMacros(fullyResolvedValue)
					if (newFullyResolvedValue === fullyResolvedValue) {
						break
					}

					if (iterations++ >= 1000) {
						console.log(input)
						throw new Error(`Too many macro iterations`)
					}

					fullyResolvedValue = newFullyResolvedValue
				}

				// For source mapping, we need the full macro call length
				/*const fullMacroCall =
					name + (thisArgs.length > 0 ? '(' + thisArgs + ')' : '')*/

				input =
					input.slice(0, macroStart) +
					fullyResolvedValue +
					input.slice(internalIndex)

				internalIndex += fullyResolvedValue.length

				if (sourceMapOptions && mappedOffset) {
					sourceMap.push({
						offset: sourceMapOptions.offset + macroStart,
						fileOffset: macro.valueLocation[0],
						file: macro.file,
					})

					sourceMap.push({
						offset:
							sourceMapOptions.offset +
							internalIndex +
							fullyResolvedValue.length,
						fileOffset: mappedOffset.offset + (internalIndex - macroStart),
						file: mappedOffset.file,
					})
				}
			} else {
				if (identifier.length === 0) {
					internalIndex++
				}
			}
		}

		return input
	}

	const parseConditionBodies = () => {
		let positive = ''
		let negative = ''

		let isInPositive = true

		while (index < code.length) {
			if (code.slice(index, index + '#endif'.length) === '#endif') {
				index += '#endif'.length
				break
			}

			if (code.slice(index, index + '#else'.length) === '#else') {
				index += '#else'.length
				isInPositive = false
				continue
			}

			if (isInPositive) {
				positive += code[index]
			} else {
				negative += code[index]
			}

			index++
		}

		return { positive, negative }
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

					const name = parseMacroName(false).name
					defines.delete(name)

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
				case 'ifdef': {
					const mappedOffsetStart = getMappedOffsetAt(macroStart)

					expectWhitespace()

					const condition = parseMacroName(false).name
					const { positive, negative } = parseConditionBodies()

					if (defines.has(condition)) {
						code = code.slice(0, macroStart) + positive + code.slice(index)
					} else {
						code = code.slice(0, macroStart) + negative + code.slice(index)
					}

					index = macroStart

					sourceMap.push({
						offset: index,
						fileOffset: mappedOffsetStart.offset,
						file: mappedOffsetStart.file,
					})

					break
				}

				case 'if': {
					const mappedOffsetStart = getMappedOffsetAt(macroStart)

					expectWhitespace()

					let condition = ''
					while (index < code.length) {
						if (code[index] === '\n') {
							break
						}

						condition += code[index]
						index++
					}

					// TODO: Actually evaluate condition
					condition

					const { positive } = parseConditionBodies()

					code = code.slice(0, macroStart) + positive + code.slice(index)

					index = macroStart

					sourceMap.push({
						offset: index,
						fileOffset: mappedOffsetStart.offset,
						file: mappedOffsetStart.file,
					})

					break
				}

				default:
					raise(`Unknown preprocessor command: ${command}`)
			}
		} else {
			const lineStart = index

			while (index < code.length) {
				if (code.slice(index, index + 2) === '\r\n') {
					break
				}

				if (code[index] === '\n') {
					break
				}

				index++
			}

			const newLine = applyMacros(code.slice(lineStart, index), {
				offset: lineStart,
			})

			code = code.slice(0, lineStart) + newLine + code.slice(index)
			index = lineStart + newLine.length
		}
	}

	return {
		code,
		sourceMap,
		defines,
	}
}
