type ClassTokenRange = {
	from: number
	to: number
}

export type ClassToken = {
	type:
		| 'keyword'
		| 'identifier'
		| 'number'
		| 'string'
		| 'eof'
		| 'line-comment'
		| 'multi-line-comment'
	contents: string
	position: ClassTokenRange
}

const KEYWORDS = [
	'class',
	'import',
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
	'/',
	':',
]

const NUMBER_START = /[0-9]/
const NUMBER_REST = /[0-9\.]/
const IDENTIFIER_START = /[a-z]/i
const IDENTIFIER_REST = /[a-z0-9_]/i

export const tokenizeClass = (input: string) => {
	let offset = 0
	const tokens = [] as ClassToken[]

	const parseError = (error: string) => {
		throw new Error(error)
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

		// TODO: What about number with >1 dot? Those should also be invalid

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

		offset += 1
		return input.slice(start, offset)
	}

	const next = (): ClassToken | undefined => {
		skipWhitespace()

		if (offset >= input.length) {
			return
		}

		const char = input[offset]

		if (char.match(NUMBER_START)) {
			const start = offset
			const contents = readNumber()

			return {
				type: 'number',
				contents,
				position: {
					from: start,
					to: offset + 1,
				},
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
				position: {
					from: start,
					to: offset,
				},
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
				position: {
					from: start,
					to: offset,
				},
			}
		}

		const matchingKeyword = KEYWORDS.find(
			(w) => input.slice(offset, offset + w.length) === w
		)

		if (matchingKeyword !== undefined) {
			offset += matchingKeyword.length

			return {
				type: 'keyword',
				contents: matchingKeyword,
				position: {
					from: offset - matchingKeyword.length,
					to: offset,
				},
			}
		}

		if (char === '"' || char === "'") {
			const start = offset
			const contents = readString(char)
			offset++

			return {
				type: 'string',
				contents,
				position: {
					from: start,
					to: offset,
				},
			}
		}

		if (char.match(IDENTIFIER_START)) {
			const start = offset
			const contents = readIdentifier()

			return {
				type: 'identifier',
				contents,
				position: {
					from: start,
					to: offset,
				},
			}
		}
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
		position: { from: offset, to: offset },
	})

	return tokens
}
