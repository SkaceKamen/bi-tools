type SqfTokenRange = {
	from: number
	to: number
}

export type SqfToken = {
	type:
		| 'keyword'
		| 'identifier'
		| 'number'
		| 'string'
		| 'eof'
		| 'line-comment'
		| 'multi-line-comment'
	contents: string
	position: SqfTokenRange
}

const KEYWORDS = [
	'private',
	'>=',
	'<=',
	'==',
	'>>',
	'!=',
	'&&',
	'||',
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
	'#',
	'/',
	':',
	'^',
]

const NUMBER_START = /[0-9]/
const NUMBER_REST = /[0-9\.]/
const IDENTIFIER_START = /[a-z_]/i
const IDENTIFIER_REST = /[a-z0-9_]/i

export class TokenizerError extends Error {
	constructor(message: string, public offset: number) {
		super(message)
	}
}

export const tokenizeSqf = (
	input: string,
	{ debug } = { debug: false }
): SqfToken[] => {
	let offset = 0
	const tokens = [] as SqfToken[]

	const raise = (error: string) => {
		debug && console.log('Last tokens:', tokens.slice(-20))
		debug && console.log('At:', input.slice(offset - 20, offset + 20))

		throw new TokenizerError(error, offset)
	}

	const peek = (n: number, length = 1) => {
		return input.slice(offset + n, offset + n + length)
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
			raise('Unterminated string')
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
			} else if (input[offset].toLowerCase() === 'e') {
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
		let tokenEnd = offset

		while (offset < input.length) {
			if (peek(0) === '\n') {
				tokenEnd = offset
				offset += 1
				break
			}

			if (peek(0, 2) === '\r\n') {
				tokenEnd = offset
				offset += 2
				break
			}

			offset++

			if (offset >= input.length) {
				tokenEnd = offset
			}
		}

		return input.slice(start, tokenEnd)
	}

	const readMultiLineComment = () => {
		const start = offset
		offset += 2

		while (true) {
			if (peek(0, 2) === '*/') {
				offset += 2
				break
			}

			offset++

			if (offset >= input.length) {
				raise('Unterminated multiline comment')
			}
		}

		return input.slice(start, offset)
	}

	while (true) {
		skipWhitespace()

		if (offset >= input.length) {
			break
		}

		const char = input[offset]

		if (char.match(NUMBER_START)) {
			const start = offset
			const contents = readNumber()

			tokens.push({
				type: 'number',
				contents,
				position: {
					from: start,
					to: offset + 1,
				},
			})

			continue
		}

		if (
			offset < input.length - 1 &&
			char === '/' &&
			input[offset + 1] === '/'
		) {
			const start = offset
			const contents = readLineComment()

			tokens.push({
				type: 'line-comment',
				contents,
				position: {
					from: start,
					to: offset + 1,
				},
			})

			continue
		}

		if (
			offset < input.length - 1 &&
			char === '/' &&
			input[offset + 1] === '*'
		) {
			const start = offset
			const contents = readMultiLineComment()

			tokens.push({
				type: 'multi-line-comment',
				contents,
				position: {
					from: start,
					to: offset + 1,
				},
			})

			continue
		}

		const matchingKeyword = KEYWORDS.find(
			(w) => input.slice(offset, offset + w.length) === w
		)

		if (matchingKeyword !== undefined) {
			tokens.push({
				type: 'keyword',
				contents: matchingKeyword,
				position: {
					from: offset,
					to: offset + matchingKeyword.length,
				},
			})

			offset += matchingKeyword.length
			continue
		}

		if (char === '"' || char === "'") {
			const start = offset
			const contents = readString(char)

			tokens.push({
				type: 'string',
				contents,
				position: {
					from: start,
					to: offset,
				},
			})

			offset++
			continue
		}

		if (char.match(IDENTIFIER_START)) {
			const start = offset
			const contents = readIdentifier()

			tokens.push({
				type: 'identifier',
				contents,
				position: {
					from: start,
					to: offset,
				},
			})

			continue
		}

		raise(`Unexpected character: ${char}`)
	}

	tokens.push({
		type: 'eof',
		contents: '',
		position: {
			from: offset,
			to: offset,
		},
	})

	return tokens
}
