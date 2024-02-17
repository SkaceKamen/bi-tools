import { sqfOperators } from './sqfOperators'
import { SqfToken } from './tokenizeSqf'
import { partition } from './utils'

type SqfNodeBase = { position: [from: number, to: number] }

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

export class SqfParserError extends Error {
	constructor(message: string, public token: SqfToken) {
		super(message)
	}
}

export const parseSqfTokens = (
	sourceTokens: SqfToken[],
	{ debug = false } = {}
) => {
	const { ternaryOperators, binaryOperators, unaryOperators } = sqfOperators

	// We'll attempt to recover from errors
	const errors: SqfParserError[] = []

	let index = 0

	const [, tokens] = partition(
		sourceTokens,
		(t) => t.type === 'line-comment' || t.type === 'multi-line-comment'
	)

	const raise = (token: SqfToken, message: string) => {
		debug &&
			console.trace(
				`(at ${index}) Raising: ${message} (at ${token.type} "${token.contents}")`
			)

		throw new SqfParserError(message, token)
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
			if (error instanceof SqfParserError) {
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

				// Attempt to recover from error
				if (err instanceof SqfParserError) {
					const errorEncounteredAt = index

					errors.push(err)

					// Try to skip to next command
					while (
						index < tokens.length &&
						!isExpressionSeparator(tokens[index]) &&
						!isEnd(tokens[index])
					) {
						index++
					}

					// This shouldn't happen, but just in case to prevent infinite loops
					if (errorEncounteredAt === index) {
						throw err
					}

					continue
				}

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
		// Ternary expression can't be easily detected so we just need to attempt to parse it
		// Binary expression can also be unary, let's try to parse it as binary here
		const expression =
			tryParse(parseTernaryExpression) ?? tryParse(parseBinaryExpression)

		if (expression) {
			return expression
		}

		// Detect prefixed expressions
		const token = peekToken(0)

		// If it's ONLY binary operator, we can safely require to parse it as binary
		if (isBinaryOperator(token) && !isUnaryOperator(token)) {
			return parseBinaryExpression()
		}

		if (token.type === 'keyword' && token.contents === '(') {
			return parseBrackets()
		}

		if (token.type === 'keyword' && token.contents === '{') {
			return parseCodeBlock()
		}

		if (token.type === 'keyword' && token.contents === '[') {
			return parseArray()
		}

		const expressionNow =
			tryParse(parseLiteral) ?? tryParse(parseUnaryExpression)

		if (!expressionNow) {
			return raise(
				tokens[index],
				`Unexpected token: ${tokens[index].type} ${tokens[index].contents}`
			)
		}

		return expressionNow
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
			tryParse(parseLiteral) ??
			tryParse(parseBinaryExpression) ??
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

		const left = parseExpressionWithoutTernary()

		// Accumulate all continuation ternary operators
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

		// Build the proper AST from the right
		let result: SqfTernaryExpressionNode | undefined
		for (const item of rightChildren) {
			const thisLeft = result ?? left

			result = {
				type: 'ternary-expression',
				left: thisLeft,
				operator: item.operator,
				right: item.right,
				position: [thisLeft.position[0], item.right.position[1]],
			}
		}

		// No result, no operator, throw
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
			position: [operator.position[0], right.position[1]],
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
				position: token.position,
			}
		}

		return {
			type: 'unary-expression',
			operator: token,
			position: token.position,
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
			position: [token.position[0], last.position[1]],
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

			try {
				const element = parseExpression()
				elements.push(element)
			} catch (err) {
				// Attempt to recover from error
				if (err instanceof SqfParserError) {
					const errorEncounteredAt = index

					errors.push(err)

					// Try to skip to next command
					while (index < tokens.length) {
						// We've potentially reached end of array, just stop, the token will be eaten next iteration
						if (peekToken(0).contents === ']') {
							break
						}

						// We skipped to , so we just skip it and continue parsing
						if (peekToken(0).contents === ',') {
							index++
							break
						}

						index++
					}

					// This shouldn't happen, but just in case to prevent infinite loops
					if (errorEncounteredAt === index) {
						throw err
					}

					continue
				}

				throw err
			}

			const next = peekToken(0)

			if (next.type === 'keyword' && next.contents === ']') {
				index++
				break
			}

			if (!(next.type === 'keyword' && next.contents === ',')) {
				raise(next, 'Expected , or ]')
			}

			index++
		}

		return {
			type: 'array',
			elements,
			position: [token.position[0], tokens[index - 1].position[1]],
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
			position: token.position,
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
			position: [token.position[0], next.position[1]],
		}
	}

	const body = parseCode(isEof)

	return {
		errors,
		script: {
			type: 'script',
			body,
			position: [0, body[body.length - 1]?.position[1] ?? 0],
		} as SqfNode,
	}
}
