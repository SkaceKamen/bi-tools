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
	name: string
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

const replaceSpecials = (token?: string) =>
	token
		? token.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
		: 'EOF'

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
			(code[index] === ' ' || code[index] === '\t')
		) {
			index++
		}
	}

	const expectWhitespace = () => {
		const next = peek(0)
		if (next !== ' ' && next !== '\t') {
			raise('Expected whitespace, got >>' + next + '<<')
		}

		while (
			index < code.length &&
			(code[index] === ' ' || code[index] === '\t')
		) {
			index++
		}
	}

	const peek = (n: number, length = 1) => {
		if (index + n >= code.length) {
			raise('Unexpected end of file')
		}

		return code.slice(index + n, index + n + length)
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
		if (!firstToken.match(/[A-Z_]/i)) {
			raise(
				`Expected macro name to start with a letter or _, got ${replaceSpecials(
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

			// Stop on comments, those shouldn't be part of the value
			if (
				(peek(0) === '/' && peek(1) === '/') ||
				// TODO: /* could be an issue tbh
				(peek(0) === '/' && peek(1) === '*')
			) {
				break
			}

			value += pop()
		}

		return value
	}

	const getMappedOffsetAt = (offset: number) =>
		getMappedOffsetAtOriginal(sourceMap, offset, filename)

	const applyMacros = (
		ctx: { code: string; index: number },
		sourceMapOptions?: { offset: number },
		overrideDefines?: Map<string, MacroItem>
	) => {
		let internalIndex = ctx.index
		let input = ctx.code

		while (internalIndex < input.length) {
			// Remove any comments
			// TODO: THIS IS SHIT
			while (true) {
				if (
					internalIndex < input.length &&
					input[internalIndex] === '/' &&
					input[internalIndex + 1] === '/'
				) {
					while (
						internalIndex < input.length &&
						input[internalIndex] !== '\n'
					) {
						internalIndex++
					}

					continue
				}

				if (
					internalIndex < input.length &&
					input[internalIndex] === '/' &&
					input[internalIndex + 1] === '*'
				) {
					internalIndex += 2
					while (internalIndex < input.length) {
						if (input.slice(internalIndex, internalIndex + 2) === '*/') {
							internalIndex += 2
							break
						}

						internalIndex++
					}
					continue
				}

				break
			}

			// Skip strings
			// TODO: THIS IS SHIT
			while (true) {
				if (internalIndex < input.length && input[internalIndex] === '"') {
					internalIndex++
					while (internalIndex < input.length) {
						if (input.slice(internalIndex, internalIndex + 2) === '""') {
							internalIndex += 2
							continue
						}

						if (input[internalIndex] === '"') {
							internalIndex++
							break
						}

						internalIndex++
					}

					continue
				}

				if (internalIndex < input.length && input[internalIndex] === "'") {
					internalIndex++
					while (internalIndex < input.length) {
						if (input.slice(internalIndex, internalIndex + 2) === "''") {
							internalIndex += 2
							continue
						}

						if (input[internalIndex] === "'") {
							internalIndex++
							break
						}

						internalIndex++
					}

					continue
				}

				break
			}

			// When applying macro inside source code, we'll stop for NL
			if (
				!overrideDefines &&
				(input[internalIndex] === '\n' ||
					input.slice(internalIndex, internalIndex + 2) === '\r\n')
			) {
				return { code: input, index: internalIndex }
			}

			const macroStart = internalIndex

			let identifierPrefix = ''
			if (overrideDefines) {
				if (input.slice(internalIndex, internalIndex + 2) === '##') {
					identifierPrefix += '##'
					internalIndex += 2
				} else if (input[internalIndex] === '#') {
					identifierPrefix += '#'
					internalIndex++
				}
			}

			let identifier = ''
			while (internalIndex < input.length && /\w/.test(input[internalIndex])) {
				identifier += input[internalIndex]
				internalIndex++
			}

			if (input[internalIndex] === '(') {
				identifier += '('
				internalIndex++
			}

			const matchingMacro = (overrideDefines ?? defines).get(identifier)

			if (matchingMacro) {
				let identifierPostfix = ''

				// Ending glue
				if (
					overrideDefines &&
					input.slice(internalIndex, internalIndex + 2) === '##'
				) {
					identifierPostfix = '##'
					internalIndex += 2
				}

				const mappedOffset = sourceMapOptions
					? getMappedOffsetAt(sourceMapOptions.offset + internalIndex)
					: null

				const macro = matchingMacro
				const { value } = macro

				let fullyResolvedValue =
					identifierPrefix === '#' ? '"' + value + '"' : value

				// Glueing together stuff can be tricky, let's resolve what we're resolving first
				if (identifierPrefix === '##' || identifierPostfix === '##') {
					fullyResolvedValue = applyMacros({
						code: fullyResolvedValue,
						index: 0,
					}).code
				}

				// Parse arguments if needed
				if (macro.args.length > 0) {
					const inputArgs = [] as string[]
					let argAcc = ''
					let bracesDepth = 1
					let arrayDepth = 0

					// Collect arguments
					while (internalIndex < input.length) {
						if (input[internalIndex] === '(') {
							bracesDepth++
						}

						if (input[internalIndex] === ')') {
							bracesDepth--

							if (bracesDepth === 0) {
								break
							}
						}

						if (input[internalIndex] === '[') {
							arrayDepth++
						}

						if (input[internalIndex] === ']') {
							arrayDepth--
						}

						// TODO: Escaping
						if (input[internalIndex] === '"') {
							argAcc += input[internalIndex]
							internalIndex++
							while (input[internalIndex] !== '"') {
								argAcc += input[internalIndex]
								internalIndex++
							}
							argAcc += input[internalIndex]
							internalIndex++
							continue
						}

						// TODO: Escaping
						if (input[internalIndex] === "'") {
							argAcc += input[internalIndex]
							internalIndex++
							while (input[internalIndex] !== "'") {
								argAcc += input[internalIndex]
								internalIndex++
							}
							argAcc += input[internalIndex]
							internalIndex++
							continue
						}

						if (
							input[internalIndex] === ',' &&
							bracesDepth === 1 &&
							arrayDepth === 0
						) {
							inputArgs.push(argAcc)
							argAcc = ''
							internalIndex++
							continue
						}

						argAcc += input[internalIndex]
						internalIndex++
					}

					inputArgs.push(argAcc)

					internalIndex++

					if (inputArgs.length !== macro.args.length) {
						console.log(inputArgs)

						raise(
							'Invalid number of arguments for ' +
								macro.name +
								'. Expected ' +
								macro.args.length +
								' got ' +
								inputArgs.length +
								' (' +
								inputArgs.join(', ') +
								')'
						)
					}

					const expandedInputArgs = macro.args.map(
						(a, i) =>
							[
								a,
								{
									name: a,
									args: [],
									file: macro.file,
									location: [0, 0],
									valueLocation: [0, 0],
									identifierPostfix,
									value: inputArgs[i], // applyMacros({ code: inputArgs[i], index: 0 }).code,
								} as MacroItem,
							] as const
					)

					// Apply arguments
					fullyResolvedValue = applyMacros(
						{ code: fullyResolvedValue, index: 0 },
						undefined,
						new Map(expandedInputArgs)
					).code
				}

				// For source mapping, we need the full macro call length
				/*const fullMacroCall =
					name + (thisArgs.length > 0 ? '(' + thisArgs + ')' : '')*/

				input =
					input.slice(0, macroStart) +
					fullyResolvedValue +
					input.slice(internalIndex)

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

				internalIndex = macroStart
			} else {
				if (identifier.length === 0) {
					internalIndex++
				}
			}
		}

		return { code: input, index: internalIndex }
	}

	const parseConditionBodies = () => {
		let positive = ''
		let negative = ''

		let isInPositive = true

		let depth = 1

		while (index < code.length) {
			// TODO: THIS IS SHIT! But kind of works, so whatever
			if (code.slice(index, index + '#ifdef'.length) === '#ifdef') {
				depth++
				index += '#ifdef'.length

				if (isInPositive) {
					positive += '#ifdef'
				} else {
					negative += '#ifdef'
				}

				continue
			}

			if (code.slice(index, index + '#ifndef'.length) === '#ifndef') {
				depth++
				index += '#ifndef'.length

				if (isInPositive) {
					positive += '#ifndef'
				} else {
					negative += '#ifndef'
				}

				continue
			}

			if (code.slice(index, index + '#if'.length) === '#if') {
				depth++
				index += '#if'.length

				if (isInPositive) {
					positive += '#if'
				} else {
					negative += '#if'
				}

				continue
			}

			if (code.slice(index, index + '#endif'.length) === '#endif') {
				depth--
				index += '#endif'.length

				if (depth === 0) {
					break
				} else {
					if (isInPositive) {
						positive += '#endif'
					} else {
						negative += '#endif'
					}
				}
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

	const skipComments = () => {
		if (index < code.length && peek(0) === '/' && peek(1) === '/') {
			while (index < code.length && code[index] !== '\n') {
				index++
			}
		}

		if (index < code.length && peek(0) === '/' && peek(1) === '*') {
			index += 2
			while (index < code.length) {
				if (code.slice(index, index + 2) === '*/') {
					index += 2
					break
				}

				index++
			}
		}
	}

	while (index < code.length) {
		skipNewLines()
		skipComments()
		skipWhitespace()

		if (index >= code.length) {
			break
		}

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
					const mappedOffsetStart = getMappedOffsetAt(macroStart)

					expectWhitespace()

					const { name, args } = parseMacroName()

					skipWhitespace()

					let value = ''

					if (
						code[index] === '\n' ||
						(code[index] === '\r' && code[index + 1] === '\n')
					) {
						value = ''
					} else {
						value = parseMacroValue()
					}

					const mappedValueOffsetStart = getMappedOffsetAt(index)

					const mappedOffsetEnd = getMappedOffsetAt(index)

					debug && console.log('define', { name, args, value })

					defines.set(name + (args.length > 0 ? '(' : ''), {
						name,
						args,
						value,
						file: mappedOffsetStart.file,
						location: [mappedOffsetStart.offset, mappedOffsetEnd.offset],
						valueLocation: [
							mappedValueOffsetStart.offset,
							mappedOffsetEnd.offset,
						],
					})

					code =
						code.slice(0, macroStart) +
						' '.repeat(index - macroStart) +
						code.slice(index)

					/*
					// TODO: We could replace the above ' ' repeating with proper source map?
					sourceMap.push({
						offset: index,
						fileOffset: mappedOffsetEnd.offset,
						file: mappedOffsetEnd.file,
					})
					*/

					index = macroStart

					break
				}

				case 'ifndef':
				case 'ifdef': {
					const mappedOffsetStart = getMappedOffsetAt(macroStart)

					expectWhitespace()

					const condition = parseMacroName(false).name
					const { positive, negative } = parseConditionBodies()
					const isDefined = defines.has(condition)
					const isPositive =
						(command === 'ifdef' && isDefined) ||
						(command === 'ifndef' && !isDefined)

					// console.log({ command, condition, isDefined, isPositive })

					const skippedOffset = index - macroStart
					const result = isPositive ? positive : negative
					// Spacing added to keep the source map correct
					const spacing = ' '.repeat(skippedOffset - result.length)

					code =
						code.slice(0, macroStart) + result + spacing + code.slice(index)

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

			const result = applyMacros(
				{ code, index: lineStart },
				{ offset: lineStart }
			)

			code = result.code
			index = result.index
		}
	}

	return {
		code,
		sourceMap,
		defines,
	}
}
