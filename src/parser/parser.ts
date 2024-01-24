import { operators } from './operators'
import { Token } from './tokenizer'

type NodeBase = { start: number; end: number }

const DEBUG = false

export type ScriptNode = NodeBase & {
	type: 'script'
	body: Node[]
}

export type AssignmentNode = NodeBase & {
	type: 'assignment'
	private: boolean
	id: Token
	init: Node
}

export type BlockNode = NodeBase & {
	type: 'block'
	body: Node[]
}

export type ArrayNode = NodeBase & {
	type: 'array'
	elements: Node[]
}

export type LiteralNode = NodeBase & {
	type: 'literal'
	value: string | number
	raw: string
}

export type TernaryExpressionNode = NodeBase & {
	type: 'ternary-expression'
	operator: Token
	left: Node
	right: Node
}

export type BinaryExpressionNode = NodeBase & {
	type: 'binary-expression'
	operator: Token
	right: Node
}

export type UnaryExpressionNode = NodeBase & {
	type: 'unary-expression'
	operator: Token
}

export type VariableNode = NodeBase & {
	type: 'variable'
	id: Token
}

export type Node =
	| ScriptNode
	| AssignmentNode
	| BlockNode
	| ArrayNode
	| LiteralNode
	| TernaryExpressionNode
	| BinaryExpressionNode
	| UnaryExpressionNode
	| VariableNode

export class ParserError extends Error {}

const isNotOperator = (token: Token) =>
	(token.type !== 'identifier' &&
		token.type !== 'keyword' &&
		token.type !== 'string' &&
		token.type !== 'number') ||
	token.contents === '=' ||
	token.contents === ';' ||
	token.contents === ',' ||
	token.contents === '[' ||
	token.contents === ']' ||
	token.contents === '{' ||
	token.contents === '}' ||
	token.contents === '(' ||
	token.contents === ')'

const getOperators = () => {
	const ternaryOperators = new Set<string>()
	const binaryOperators = new Set<string>()
	const unaryOperators = new Set<string>()

	operators.split('\n').forEach((op) => {
		if (op.startsWith('b:')) {
			ternaryOperators.add(op.split(' ')[1].toLowerCase())
		} else if (op.startsWith('u:')) {
			binaryOperators.add(op.split(' ')[0].replace('u:', '').toLowerCase())
		} else if (op.startsWith('n:')) {
			unaryOperators.add(op.replace('n:', '').toLowerCase())
		}
	})

	return {
		ternaryOperators,
		binaryOperators,
		unaryOperators,
	}
}

export const parse = (tokens: Token[], source: string): Node => {
	const { ternaryOperators, binaryOperators, unaryOperators } = getOperators()

	let index = 0

	// Remove comments as they're useless now
	tokens = tokens.filter(
		(t) => t.type !== 'line-comment' && t.type !== 'multi-line-comment'
	)

	const raise = (token: Token, message: string) => {
		const offset = token.position.from
		const line = source.slice(0, offset).split('\n').length
		const lastLineIndex = source.slice(0, offset).lastIndexOf('\n')

		DEBUG &&
			console.trace(
				`(at ${index}) Raising: ${message} (at ${token.type} "${token.contents}")`
			)

		throw new ParserError(
			`Parse error at ${line}:${offset - lastLineIndex}: ${message}`
		)
	}

	const nextToken = (offset = 1) => {
		if (index + offset >= tokens.length) {
			raise(tokens[index], 'Unexpected end of file')
		}

		return tokens[index + offset]
	}

	const tryParse = (fn: () => Node) => {
		const beginIndex = index

		try {
			return fn()
		} catch (error) {
			if (error instanceof ParserError) {
				DEBUG &&
					console.log('Caught at index', index, 'resetting to', beginIndex)
				index = beginIndex
				return null
			}

			throw error
		}
	}

	const parseCode = (insideBlock = false): Node[] => {
		const body: Node[] = []

		let first = true

		while (true) {
			if (index >= tokens.length) {
				throw new Error('Token offset out of bounds')
			}

			const token = tokens[index]

			if (insideBlock) {
				if (token.type === 'keyword' && token.contents === '}') {
					break
				}
			}

			if (!insideBlock && token.type === 'eof') {
				break
			}

			if (!first) {
				if (token.type !== 'keyword' || token.contents !== ';') {
					DEBUG && console.log(JSON.stringify(body[body.length - 1], null, 2))

					raise(token, 'Expected ;')
				}

				index++
			} else {
				first = false
			}

			const nextToken = tokens[index]

			if (nextToken.type === 'eof') {
				break
			}

			if (insideBlock) {
				if (nextToken.type === 'keyword' && nextToken.contents === '}') {
					break
				}
			}

			const assignment = tryParse(parseAssignment)
			if (assignment) {
				DEBUG && console.log('Assignment', JSON.stringify(assignment, null, 2))
				body.push(assignment)
				continue
			}

			const expression = tryParse(parseExpression)
			if (expression) {
				body.push(expression)
				continue
			}

			DEBUG && console.log(JSON.stringify(body[body.length - 1], null, 2))

			raise(
				tokens[index],
				`Unexpected token: ${tokens[index].type} ${tokens[index].contents} (insideBlock: ${insideBlock})`
			)
		}

		return body
	}

	const parseExpression = (): Node => {
		const expression =
			//tryParse(parseBrackets) ??
			tryParse(parseTernaryExpression) ??
			tryParse(parseBinaryExpression) ??
			tryParse(parseUnaryExpression) ??
			tryParse(parseCodeBlock) ??
			tryParse(parseArray) ??
			tryParse(parseLiteral)

		if (!expression) {
			return raise(
				tokens[index],
				`Unexpected token: ${tokens[index].type} ${tokens[index].contents}`
			)
		}

		return expression
	}

	const parseBrackets = (): Node => {
		DEBUG &&
			console.log(tokens[index].type, tokens[index].contents, 'parseBrackets')

		const token = tokens[index]
		if (token.type !== 'keyword' || token.contents !== '(') {
			raise(token, 'Expected (')
		}

		index++

		const expression = parseExpression()

		const last = tokens[index]
		if (last.type !== 'keyword' || last.contents !== ')') {
			raise(last, 'Expected )')
		}

		index++

		return expression
	}

	const isTernaryOperator = (token: Token) =>
		token.contents && ternaryOperators.has(token.contents.toLowerCase())

	const parseTernaryExpression = (): Node => {
		DEBUG &&
			console.log(
				tokens[index].type,
				tokens[index].contents,
				'parseTernaryExpression'
			)

		if (index + 3 >= tokens.length) {
			raise(tokens[index], 'Unexpected end of file')
		}

		const left =
			tryParse(parseCodeBlock) ??
			tryParse(parseArray) ??
			tryParse(parseLiteral) ??
			tryParse(parseBrackets) ??
			tryParse(parseUnaryExpression) ??
			tryParse(parseBinaryExpression) ??
			parseTernaryExpression()

		const rightChildren = [] as { operator: Token; right: Node }[]
		while (true) {
			const operator = tokens[index]
			if (!isTernaryOperator(operator)) {
				break
			}

			index++

			const token =
				tryParse(parseBrackets) ??
				tryParse(parseBinaryExpression) ??
				tryParse(parseUnaryExpression) ??
				tryParse(parseCodeBlock) ??
				tryParse(parseArray) ??
				tryParse(parseLiteral)

			if (!token) {
				break
			}

			rightChildren.push({ operator, right: token })
		}

		DEBUG &&
			console.trace(
				'parsed ternary expression',
				JSON.stringify({ left, rightChildren }, null, 2)
			)

		let result: TernaryExpressionNode | undefined
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
			return left
		}

		return result
	}

	const isBinaryOperator = (token: Token) =>
		token.contents && binaryOperators.has(token.contents.toLowerCase())

	const parseBinaryExpression = (): Node => {
		DEBUG &&
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

		/*
		const rightChildren = [] as { operator: Token; right: Node }[]
		while (true) {
			const operator = tokens[index]
			if (!isBinaryOperator(operator)) {
				break
			}

			index++

			const token =
				tryParse(parseBrackets) ??
				tryParse(parseUnaryExpression) ??
				tryParse(parseCodeBlock) ??
				tryParse(parseArray) ??
				tryParse(parseLiteral)

			if (!token) {
				break
			}

			rightChildren.push({ operator, right: token })
		}

		let result: BinaryExpressionNode | undefined
		for (const item of rightChildren) {
			result = {
				type: 'binary-expression',
				operator: item.operator,
				right: item.right,
				start: item.operator.position.from,
				end: item.right.end,
			}
		}

		if (!result) {
			return raise(tokens[index], 'Expected binary operator')
		}

		DEBUG && console.trace(
			'parsed binary expression',
			JSON.stringify({ rightChildren }, null, 2)
		)

		return result
		*/

		const right =
			tryParse(parseBrackets) ??
			tryParse(parseBinaryExpression) ??
			tryParse(parseUnaryExpression) ??
			tryParse(parseCodeBlock) ??
			tryParse(parseArray) ??
			parseLiteral()

		DEBUG &&
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

	const isUnaryOperator = (token: Token) =>
		token.contents && unaryOperators.has(token.contents.toLowerCase())

	const parseUnaryExpression = (): Node => {
		DEBUG &&
			console.log(
				tokens[index].type,
				tokens[index].contents,
				'parseUnaryExpression'
			)

		const token = tokens[index]

		if (isNotOperator(token)) {
			raise(token, 'Expected identifier or keyword')
		}

		if (isTernaryOperator(token) || isBinaryOperator(token)) {
			raise(token, 'Expected unary operator or variable')
		}

		index++

		DEBUG && console.trace('parsed unary expression', { token })

		if (isUnaryOperator(token)) {
			return {
				type: 'unary-expression',
				operator: token,
				start: token.position.from,
				end: token.position.to,
			}
		}

		if (token.type === 'string' || token.type === 'number') {
			index--
			return parseLiteral()
		}

		return {
			type: 'variable',
			id: token,
			start: token.position.from,
			end: token.position.to,
		}
	}

	const parseCodeBlock = (): Node => {
		const token = tokens[index]
		if (token.type !== 'keyword' || token.contents !== '{') {
			raise(token, 'Expected {')
		}

		index++

		const body = parseCode(true)

		const last = tokens[index]
		if (last.type !== 'keyword' || last.contents !== '}') {
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

	const parseArray = (): Node => {
		const token = tokens[index]
		if (token.type !== 'keyword' || token.contents !== '[') {
			raise(token, 'Expected [')
		}

		index++

		const elements: Node[] = []

		while (true) {
			const current = tokens[index]

			if (current.contents === ']') {
				index++
				break
			}

			const element = parseExpression()
			elements.push(element)

			const next = tokens[index]

			if (next.contents === ']') {
				index++
				break
			}

			if (next.type !== 'keyword' || next.contents !== ',') {
				DEBUG && console.log(JSON.stringify(element, null, 2))

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

	const parseLiteral = (): Node => {
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

	const parseAssignment = (): Node => {
		const token = tokens[index]
		const isPrivate = token.contents?.toLowerCase() === 'private'
		const id = isPrivate ? nextToken() : token
		const next = isPrivate ? nextToken(2) : nextToken()

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

	const body = parseCode()

	return {
		type: 'script',
		body,
		start: 0,
		end: body[body.length - 1]?.end ?? 0,
	}
}
