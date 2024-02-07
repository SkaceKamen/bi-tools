import { sqfOperators } from './sqfOperators'
import { SqfToken } from './tokenizeSqf'

type SqfNodeBase = { start: number; end: number }

export type SqfScriptNode = SqfNodeBase & {
	type: 'script'
	body: SqfNode[]
}

export type SqfAssignmentNode = SqfNodeBase & {
	type: 'assignment'
	private: boolean
	id: SqfToken
	init: SqfNode
}

export type SqfBlockNode = SqfNodeBase & {
	type: 'block'
	body: SqfNode[]
}

export type SqfArrayNode = SqfNodeBase & {
	type: 'array'
	elements: SqfNode[]
}

export type SqfLiteralNode = SqfNodeBase & {
	type: 'literal'
	value: string | number
	raw: string
}

export type SqfTernaryExpressionNode = SqfNodeBase & {
	type: 'ternary-expression'
	operator: SqfToken
	left: SqfNode
	right: SqfNode
}

export type SqfBinaryExpressionNode = SqfNodeBase & {
	type: 'binary-expression'
	operator: SqfToken
	right: SqfNode
}

export type SqfUnaryExpressionNode = SqfNodeBase & {
	type: 'unary-expression'
	operator: SqfToken
}

export type SqfVariableNode = SqfNodeBase & {
	type: 'variable'
	id: SqfToken
}

export type SqfNode =
	| SqfScriptNode
	| SqfAssignmentNode
	| SqfBlockNode
	| SqfArrayNode
	| SqfLiteralNode
	| SqfTernaryExpressionNode
	| SqfBinaryExpressionNode
	| SqfUnaryExpressionNode
	| SqfVariableNode

export class ParserError extends Error {}

export const parseSqf = (
	tokens: SqfToken[],
	source: string,
	{ debug = false } = {}
): SqfNode => {
	const { ternaryOperators, binaryOperators, unaryOperators } = sqfOperators

	let index = 0

	// Remove comments as they're useless now
	tokens = tokens.filter(
		(t) => t.type !== 'line-comment' && t.type !== 'multi-line-comment'
	)

	const raise = (token: SqfToken, message: string) => {
		const offset = token.position.from
		const line = source.slice(0, offset).split('\n').length
		const lastLineIndex = source.slice(0, offset).lastIndexOf('\n')

		debug &&
			console.trace(
				`(at ${index}) Raising: ${message} (at ${token.type} "${token.contents}")`
			)

		throw new ParserError(
			`Parse error at ${line}:${offset - lastLineIndex}: ${message}`
		)
	}

	const peekToken = (offset = 1) => {
		if (index + offset >= tokens.length) {
			raise(tokens[index], 'Unexpected end of file')
		}

		return tokens[index + offset]
	}

	const tryParse = (fn: () => SqfNode) => {
		const beginIndex = index

		try {
			return fn()
		} catch (error) {
			if (error instanceof ParserError) {
				debug &&
					console.log('Caught at index', index, 'resetting to', beginIndex)
				index = beginIndex
				return null
			}

			throw error
		}
	}

	const isUnaryOperator = (token: SqfToken) =>
		token.contents && unaryOperators.has(token.contents.toLowerCase())

	const isTernaryOperator = (token: SqfToken) =>
		token.contents && ternaryOperators.has(token.contents.toLowerCase())

	const isBinaryOperator = (token: SqfToken) =>
		token.contents && binaryOperators.has(token.contents.toLowerCase())

	const isExpressionSeparator = (token: SqfToken) =>
		token.type === 'keyword' && token.contents === ';'

	const isEof = (token: SqfToken) => token.type === 'eof'

	const isEndOfBlock = (token: SqfToken) =>
		token.type === 'keyword' && token.contents === '}'

	/**
	 * Code: (assignment | expression)*
	 * Expression: '(' expression ')' | ternary | binary | unary | codeblock | array | literal
	 * ExpressionWithoutTernary: '(' expression ')' | binary | unary | codeblock | array | literal
	 * Ternary: ExpressionWithoutTernary (ternaryOperator ExpressionWithoutTernary)*
	 * Binary: binaryOperator ExpressionWithoutTernary
	 * Unary: unaryOperator
	 */

	/**
	 * Parses a block of code
	 */
	const parseCode = (isEnd: (token: SqfToken) => boolean): SqfNode[] => {
		const body: SqfNode[] = []

		while (true) {
			// This shouldn't happen, but just in case
			if (index >= tokens.length) {
				throw new Error('Token offset out of bounds')
			}

			// Skip any number of ';'
			while (isExpressionSeparator(peekToken(0))) {
				index++
			}

			const token = peekToken(0)

			if (isEnd(token)) {
				break
			}

			const assignment = tryParse(parseAssignment)
			if (assignment) {
				debug && console.log('Assignment', JSON.stringify(assignment, null, 2))
				body.push(assignment)
				continue
			}

			try {
				const expression = parseExpression()
				if (expression) {
					body.push(expression)
					continue
				}
			} catch (err) {
				debug && console.log(JSON.stringify(body[body.length - 1], null, 2))
				throw err
			}

			/*
			DEBUG && console.log(JSON.stringify(body[body.length - 1], null, 2))

			raise(
				peekToken(0),
				`Unexpected token: ${tokens[index].type} ${tokens[index].contents}`
			)
			*/
		}

		return body
	}

	const parseExpression = (): SqfNode => {
		const expression =
			tryParse(parseTernaryExpression) ??
			tryParse(parseBinaryExpression) ??
			tryParse(parseBrackets) ??
			tryParse(parseCodeBlock) ??
			tryParse(parseArray) ??
			tryParse(parseLiteral) ??
			tryParse(parseUnaryExpression)

		if (!expression) {
			return raise(
				tokens[index],
				`Unexpected token: ${tokens[index].type} ${tokens[index].contents}`
			)
		}

		return expression
	}

	const parseExpressionWithoutTernary = (): SqfNode => {
		// Detect prefixed expressions
		const token = peekToken(0)
		if (token.type === 'keyword' && token.contents === '(') {
			return parseBrackets()
		}

		if (token.type === 'keyword' && token.contents === '{') {
			return parseCodeBlock()
		}

		if (token.type === 'keyword' && token.contents === '[') {
			return parseArray()
		}

		const expression =
			tryParse(parseBinaryExpression) ??
			tryParse(parseLiteral) ??
			tryParse(parseUnaryExpression)

		if (!expression) {
			return raise(
				tokens[index],
				`Unexpected token: ${tokens[index].type} ${tokens[index].contents}`
			)
		}

		return expression
	}

	const parseBrackets = (): SqfNode => {
		debug &&
			console.log(tokens[index].type, tokens[index].contents, 'parseBrackets')

		const token = peekToken(0)
		if (token.type !== 'keyword' || token.contents !== '(') {
			raise(token, 'Expected (')
		}

		index++

		const expression = parseExpression()

		const last = peekToken(0)
		if (last.type !== 'keyword' || last.contents !== ')') {
			raise(last, 'Expected )')
		}

		index++

		return expression
	}

	const parseTernaryExpression = (): SqfNode => {
		debug &&
			console.log(
				tokens[index].type,
				tokens[index].contents,
				'parseTernaryExpression'
			)

		if (index + 3 >= tokens.length) {
			raise(tokens[index], 'Unexpected end of file')
		}

		const left = parseExpressionWithoutTernary()

		const rightChildren = [] as { operator: SqfToken; right: SqfNode }[]
		while (true) {
			const operator = tokens[index]
			if (!isTernaryOperator(operator)) {
				break
			}

			index++

			// No right token for ternary expression is a mistake, throw an error, don't just try
			const token = parseExpressionWithoutTernary()
			rightChildren.push({ operator, right: token })
		}

		let result: SqfTernaryExpressionNode | undefined
		for (const item of rightChildren) {
			const thisLeft = result ?? left

			result = {
				type: 'ternary-expression',
				left: thisLeft,
				operator: item.operator,
				right: item.right,
				start: thisLeft.start,
				end: item.right.end,
			}
		}

		if (!result) {
			return raise(tokens[index], 'Expected ternary expression')
		}

		debug &&
			console.trace(
				'parsed ternary expression',
				JSON.stringify({ result }, null, 2)
			)

		return result
	}

	const parseBinaryExpression = (): SqfNode => {
		debug &&
			console.log(
				tokens[index].type,
				tokens[index].contents,
				'parseBinaryExpression'
			)

		if (index + 2 >= tokens.length) {
			raise(tokens[index], 'Unexpected end of file')
		}

		const operator = tokens[index]
		if (!isBinaryOperator(operator)) {
			raise(operator, 'Expected binary operator')
		}

		index++

		const right = parseExpressionWithoutTernary()

		debug &&
			console.trace(
				'parsed binary expression',
				JSON.stringify({ right }, null, 2)
			)

		return {
			type: 'binary-expression',
			operator: operator,
			right,
			start: operator.position.from,
			end: right.end,
		}
	}

	const parseUnaryExpression = (): SqfNode => {
		debug &&
			console.log(
				tokens[index].type,
				tokens[index].contents,
				'parseUnaryExpression'
			)

		const token = tokens[index]

		if (isTernaryOperator(token) || isBinaryOperator(token)) {
			raise(token, 'Expected unary operator')
		}

		index++

		debug &&
			console.trace('parsed unary expression', JSON.stringify(token, null, 2))

		if (!isUnaryOperator(token)) {
			if (token.type !== 'identifier') {
				raise(token, 'Expected unary operator')
			}

			return {
				type: 'variable',
				id: token,
				start: token.position.from,
				end: token.position.to,
			}
		}

		return {
			type: 'unary-expression',
			operator: token,
			start: token.position.from,
			end: token.position.to,
		}
	}

	const parseCodeBlock = (): SqfNode => {
		const token = tokens[index]
		if (token.type !== 'keyword' || token.contents !== '{') {
			raise(token, 'Expected {')
		}

		index++

		const body = parseCode(isEndOfBlock)

		const last = peekToken(0)
		if (!isEndOfBlock(last)) {
			raise(last, 'Expected }')
		}

		index++

		return {
			type: 'block',
			body,
			start: token.position.from,
			end: last.position.to,
		}
	}

	const parseArray = (): SqfNode => {
		const token = peekToken(0)
		if (token.type !== 'keyword' || token.contents !== '[') {
			raise(token, 'Expected [')
		}

		index++

		const elements: SqfNode[] = []

		while (true) {
			const current = peekToken(0)

			if (current.type === 'keyword' && current.contents === ']') {
				index++
				break
			}

			const element = parseExpression()
			elements.push(element)

			const next = peekToken(0)

			if (next.type === 'keyword' && next.contents === ']') {
				index++
				break
			}

			if (!(next.type === 'keyword' && next.contents === ',')) {
				debug && console.log(JSON.stringify(element, null, 2))

				raise(next, 'Expected , or ]')
			}

			index++
		}

		return {
			type: 'array',
			elements,
			start: token.position.from,
			end: tokens[index - 1].position.to,
		}
	}

	const parseLiteral = (): SqfNode => {
		const token = tokens[index]

		if (token.type !== 'number' && token.type !== 'string') {
			raise(token, 'Expected number or string')
		}

		index++

		return {
			type: 'literal',
			value:
				token.type === 'number'
					? parseFloat(token.contents ?? '')
					: String(token.contents?.substring(1, token.contents.length - 1)),
			raw: String(token.contents),
			start: token.position.from,
			end: token.position.to,
		}
	}

	const parseAssignment = (): SqfNode => {
		const token = tokens[index]
		const isPrivate = token.contents?.toLowerCase() === 'private'
		const id = isPrivate ? peekToken(1) : token
		const next = isPrivate ? peekToken(2) : peekToken(1)

		if (id.type !== 'identifier') {
			raise(id, 'Expected identifier')
		}

		if (next.type !== 'keyword' || next.contents !== '=') {
			raise(next, 'Expected declaration')
		}

		index += isPrivate ? 3 : 2

		return {
			type: 'assignment',
			private: isPrivate,
			id,
			init: parseExpression(),
			start: token.position.from,
			end: next.position.to,
		}
	}

	const body = parseCode(isEof)

	return {
		type: 'script',
		body,
		start: 0,
		end: body[body.length - 1]?.end ?? 0,
	}
}