import fs from 'fs'
import path from 'path'

type Options = {
	includeBaseDir: string
	debug?: boolean
}

const COMMANDS = ['include', 'define', 'ifdef', 'ifndef'] as const

type Commands = (typeof COMMANDS)[number]

export class PreprocessorError extends Error {}

export type Preprocessed = {
	code: string
	defines: Map<
		string,
		{
			args: string[]
			value: string
			location: [from: number, to: number]
		}
	>
	sourceMap: {
		from: number
		to: number
		file: string
	}[]
}

export const preprocess = (
	code: string,
	{ includeBaseDir, debug = false }: Options
): Preprocessed => {
	const defines = new Map<
		string,
		{
			args: string[]
			value: string
			location: [from: number, to: number]
		}
	>()

	const sourceMap = []

	let index = 0

	const raise = (message: string) => {
		const offset = index
		const line = code.slice(0, offset).split('\n').length
		const lastLineIndex = code.slice(0, offset).lastIndexOf('\n')

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
			raise('Expected whitespace, got ' + next)
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
			raise('Expected macro name to start with a letter')
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

	const applyMacros = (input: string) => {
		for (const [name, macro] of defines) {
			const { value } = macro
			const regex = new RegExp(`${name}`, 'g')

			// TODO: Apply args
			input = input.replace(regex, value)
		}

		return input
	}

	while (index < code.length) {
		skipNewLines()

		const macroStart = index
		const current = code[index]
		if (current === '#') {
			const command = parseCommand()

			console.log(index, 'command', command)

			switch (command) {
				case 'include': {
					skipWhitespace()

					const file = parseIncludeArg()

					skipWhitespace()

					const included = preprocess(
						fs.readFileSync(path.join(includeBaseDir, file), 'utf-8'),
						{ includeBaseDir: path.dirname(file) }
					)

					code = code.slice(0, macroStart) + included.code + code.slice(index)

					for (const [name, value] of included.defines) {
						defines.set(name, value)
					}

					for (const item of included.sourceMap) {
						// TODO: This needs to be adjusted according to our own source map!
						sourceMap.push({
							from: item.from,
							to: item.to,
							file: file,
						})
					}

					sourceMap.push({
						from: macroStart,
						to: macroStart + included.code.length,
						file,
					})

					break
				}

				case 'define': {
					expectWhitespace()

					const { name, args } = parseMacroName()

					expectWhitespace()

					const value = applyMacros(parseMacroValue())

					debug && console.log('define', { name, args, value })

					defines.set(name, {
						args,
						value,
						location: [macroStart, index],
					})

					code =
						code.slice(0, macroStart) +
						' '.repeat(index - macroStart) +
						code.slice(index)

					break
				}

				case 'ifdef': {
					// TODO: Implement

					while (index < code.length && code[index] !== '\n') {
						index++
					}

					code = code.slice(0, macroStart) + code.slice(index)

					break
				}

				case 'ifndef': {
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
				applyMacros(code.slice(lineStart, index)) +
				code.slice(index)
		}
	}

	return {
		code,
		sourceMap,
		defines,
	}
}
