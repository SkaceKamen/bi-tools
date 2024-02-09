import { getLocationFromOffset } from '@bi-tools/preprocessor'
import { writeFile } from 'fs'

export type EnforceScriptToken = {
	type:
		| 'keyword'
		| 'identifier'
		| 'number'
		| 'string'
		| 'bool'
		| 'eof'
		| 'line-comment'
		| 'multi-line-comment'
	contents: string
	position: [from: number, to: number]
}

const KEYWORDS = [
	// Definitions
	'class',
	'enum',

	// Control structures
	'if',
	'else',
	'for',
	'foreach',
	'switch',
	'case',
	'default',
	'return',

	// Modifiers
	'proto',
	'native',
	'external',
	'private',
	'protected',
	'static',
	'autoptr',
	'ref',
	'const',
	'out',
	'inout',
	'new',
	'delete',
	'extends',
	'typedef',
	'modded',
	'sealed',
	'notnull',

	// Misc
	'null',
	'this',
	'super',

	// Types
	'void',
	'array',
	'bool',
	'int',
	'float',
	'string',
	'vector',
	'typename',

	// Operators
	'*=',
	'/=',
	'+=',
	'-=',
	'&&',
	'++',
	'--',
	'||',
	'==',
	'!=',
	'>=',
	'<=',
	'&',
	'|',
	';',
	'[',
	']',
	'{',
	'}',
	',',
	'(',
	')',
	'=',
	'>',
	'<',
	'*',
	'%',
	'-',
	'+',
	'!',
	':',
	'.',
	'~',
]

const NUMBER_START = /[0-9-\.]/
const NUMBER_REST = /[0-9\.]/
const IDENTIFIER_START = /[a-z]/i
const IDENTIFIER_REST = /[a-z0-9_]/i

export const tokenizeEnforceScript = (input: string) => {
	let offset = 0
	const tokens = [] as EnforceScriptToken[]

	const parseError = (error: string) => {
		const position = getLocationFromOffset(offset, input)

		throw new Error(`${position.line}:${position.column}: ${error}`)
	}

	const skipWhitespace = () => {
		while (
			offset < input.length &&
			(input[offset] === ' ' ||
				input[offset] === '\t' ||
				input[offset] === '\n' ||
				input[offset] === '\r')
		) {
			offset++
		}
	}

	const readString = (delimiter: string) => {
		const start = offset
		offset++

		while (offset < input.length) {
			if (input[offset] === delimiter) {
				// Escape sequence is 2*delimiter
				if (input[offset + 1] === delimiter) {
					offset++
				} else {
					break
				}
			}

			offset++
		}

		if (offset >= input.length) {
			parseError('Unterminated string')
		}

		return input.slice(start, offset + 1)
	}

	const readNumber = () => {
		const start = offset
		offset++

		if (input[offset] === 'x') {
			offset++
			while (offset < input.length && input[offset].match(/[0-9a-fA-F]/)) {
				offset++
			}

			return input.slice(start, offset)
		}

		if (input[offset] === 'b') {
			offset++
			while (offset < input.length && input[offset].match(/[01]/)) {
				offset++
			}

			return input.slice(start, offset)
		}

		if (input[offset] === 'o') {
			offset++
			while (offset < input.length && input[offset].match(/[0-7]/)) {
				offset++
			}

			return input.slice(start, offset)
		}

		while (offset < input.length) {
			if (input[offset].match(NUMBER_REST)) {
				offset++
			} else if (input[offset] === 'e') {
				offset++

				if (input[offset] === '-' || input[offset] === '+') {
					offset++
				}

				while (offset < input.length && input[offset].match(NUMBER_REST)) {
					offset++
				}

				return input.slice(start, offset)
			} else {
				break
			}
		}

		return input.slice(start, offset)
	}

	const readIdentifier = () => {
		const start = offset
		offset++

		while (offset < input.length && input[offset].match(IDENTIFIER_REST)) {
			offset++
		}

		return input.slice(start, offset)
	}

	const readLineComment = () => {
		const start = offset
		while (offset < input.length && input[offset] !== '\n') {
			offset++
		}

		return input.slice(start, offset)
	}

	const readMultiLineComment = () => {
		const start = offset
		while (
			offset < input.length - 1 &&
			!(input[offset] === '*' && input[offset + 1] === '/')
		) {
			offset++
		}

		if (offset >= input.length) {
			parseError('Unterminated multiline comment')
		}

		offset += 2
		return input.slice(start, offset)
	}

	const next = (): EnforceScriptToken | undefined => {
		skipWhitespace()

		if (offset >= input.length) {
			return
		}

		const char = input[offset]

		if (
			char.match(NUMBER_START) &&
			(['x', 'b', 'o'].includes(input[offset + 1]) ||
				!/[0-9]/.test(input[offset + 1]))
		) {
			const start = offset
			const contents = readNumber()

			return {
				type: 'number',
				contents,
				position: [start, offset + 1],
			}
		}

		if (
			offset < input.length - 1 &&
			char === '/' &&
			input[offset + 1] === '/'
		) {
			const start = offset
			const contents = readLineComment()

			offset++

			return {
				type: 'line-comment',
				contents,
				position: [start, offset],
			}
		}

		if (
			offset < input.length - 1 &&
			char === '/' &&
			input[offset + 1] === '*'
		) {
			const start = offset
			const contents = readMultiLineComment()

			offset++

			return {
				type: 'multi-line-comment',
				contents,
				position: [start, offset],
			}
		}

		const matchingKeyword = KEYWORDS.find((w) => {
			if (input.slice(offset, offset + w.length) === w) {
				// TODO: This could be cached TBH
				const isWordKeyword = w.match(/^[a-z]+$/i)

				// TODO: This is terrible, but prevents keywords from being matched in the middle of identifiers
				return !isWordKeyword || input[offset + w.length]?.match(/[^a-z0-9_]/i)
			}
		})

		if (matchingKeyword !== undefined) {
			offset += matchingKeyword.length

			return {
				type: 'keyword',
				contents: matchingKeyword,
				position: [offset - matchingKeyword.length, offset],
			}
		}

		if (char === '"' || char === "'") {
			const start = offset
			const contents = readString(char)
			offset++

			return {
				type: 'string',
				contents,
				position: [start, offset],
			}
		}

		if (char.match(IDENTIFIER_START)) {
			const start = offset
			const contents = readIdentifier()

			return {
				type: 'identifier',
				contents,
				position: [start, offset],
			}
		}

		writeFile('tokens-enforce.json', JSON.stringify(tokens, null, 2), () => {
			console.log('token dump done')
		})

		parseError(`Unexpected character: ${char}`)
	}

	while (offset < input.length) {
		const token = next()

		if (token) {
			tokens.push(token)
		}
	}

	tokens.push({
		type: 'eof',
		contents: '',
		position: [offset, offset],
	})

	return tokens
}
