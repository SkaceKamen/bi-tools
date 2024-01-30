type TokenRange = {
	from: number
	to: number
}

export type Token = {
	type:
		| 'keyword'
		| 'identifier'
		| 'number'
		| 'string'
		| 'eof'
		| 'line-comment'
		| 'multi-line-comment'
	contents: string
	position: TokenRange
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
]

const NUMBER_START = /[0-9]/
const NUMBER_REST = /[0-9\.]/
const IDENTIFIER_START = /[a-z_]/i
const IDENTIFIER_REST = /[a-z0-9_]/i

export const tokenize = (input: string): Token[] => {
	let offset = 0
	const tokens = [] as Token[]

	const parseError = (error: string) => {
		console.log(JSON.stringify(tokens, null, 2))

		const line = input.slice(0, offset).split('\n').length
		const lastLineIndex = input.slice(0, offset).lastIndexOf('\n')
		throw new Error(
			`Parse error at ${line}:${offset - lastLineIndex}: ${error}`
		)
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

		while (offset < input.length && input[offset].match(NUMBER_REST)) {
			offset++
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

		if (
			offset < input.length - 1 &&
			char[0] === '/' &&
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

			offset++
			continue
		}

		if (
			offset < input.length - 1 &&
			char[0] === '/' &&
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

			offset++
			continue
		}

		parseError(`Unexpected character: ${char}`)
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
