import { SqfToken } from '@/sqf-parser/tokenizeSqf'
import { ClassToken } from './tokenizeClass'

type ClassBaseNode = { start: number; end: number }

type ClassNode =
	| ClassFileNode
	| ClassClassDeclarationNode
	| ClassAssignmentNode
	| ClassArrayNode
	| ClassLiteralNode

type ClassFileNode = ClassBaseNode & {
	type: 'file'
	body: (ClassClassDeclarationNode | ClassAssignmentNode)[]
}

type ClassClassDeclarationNode = ClassBaseNode & {
	type: 'class-declaration'
	name: ClassToken
	extends: ClassToken | null
	body: (ClassClassDeclarationNode | ClassAssignmentNode)[]
}

type ClassAssignmentNode = ClassLiteralAssignmentNode | ClassArrayAssignmentNode

type ClassLiteralAssignmentNode = ClassBaseNode & {
	type: 'literal-assignment'
	name: ClassToken
	init: ClassLiteralNode
}

type ClassArrayAssignmentNode = ClassBaseNode & {
	type: 'array-assignment'
	name: ClassToken
	init: ClassArrayNode
}

type ClassArrayNode = ClassBaseNode & {
	type: 'array'
	elements: (ClassArrayNode | ClassLiteralNode)[]
}

type ClassLiteralNode = ClassBaseNode & {
	type: 'literal'
	value: string | number
	raw: string
}

export class ClassParserError extends Error {}

export const parseClass = (
	tokens: SqfToken[],
	source: string,
	{ debug = false }
): ClassNode => {
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

		throw new ClassParserError(
			`Parse error at ${line}:${offset - lastLineIndex}: ${message}`
		)
	}

	const peekToken = (offset: number) => {
		if (index + offset >= tokens.length) {
			raise(tokens[index], 'Unexpected end of file')
		}

		return tokens[index + offset]
	}

	const popToken = () => {
		if (index >= tokens.length) {
			raise(tokens[index], 'Unexpected end of file')
		}

		const token = tokens[index]
		index++
		return token
	}

	/**
	 * Expression: ClassDeclaration | Assignment
	 * Code: '' | ';'+ | Expression (';' Expression)*
	 * ClassDeclaration:  'class' NAME (':' EXTENDS)? '{' Code '}'
	 * Assignment: ArrayAssignment | LiteralAssignment
	 * ArrayAssignment: NAME '[]=' Array
	 * LiteralAssignment: NAME '=' Literal
	 */

	const parseCode = (): (ClassClassDeclarationNode | ClassAssignmentNode)[] => {
		const body = [] as (ClassClassDeclarationNode | ClassAssignmentNode)[]

		while (index < tokens.length) {
			if (peekToken(0).type === 'eof') {
				break
			}

			// Skip any number of ';'
			while (peekToken(0).type === 'keyword' && peekToken(0).contents === ';') {
				popToken()
			}

			const token = peekToken(0)

			if (peekToken(0).type === 'eof') {
				break
			} else if (token.type === 'keyword' && token.contents === 'class') {
				body.push(parseClassDeclaration())
			} else if (token.type === 'identifier') {
				body.push(parseAssignment())
			} else if (token.type === 'eof') {
				break
			} else {
				raise(token, 'Unexpected token')
			}
		}

		return body
	}

	const parseClassDeclaration = (): ClassClassDeclarationNode => {
		const classToken = popToken()
		const nameToken = popToken()

		if (nameToken.type !== 'identifier') {
			raise(nameToken, 'Expected identifier')
		}

		let extendsToken: ClassToken | null = null
		const extendsPrefix = peekToken(0)
		if (extendsPrefix.type === 'keyword' && extendsPrefix.contents === ':') {
			popToken()
			extendsToken = popToken()

			if (extendsToken.type !== 'identifier') {
				raise(extendsToken, 'Expected identifier')
			}
		}

		const bodyStart = popToken()

		if (bodyStart.type !== 'keyword' || bodyStart.contents !== '{') {
			raise(bodyStart, 'Expected "{"')
		}

		const body = parseCode()

		const bodyEnd = popToken()

		if (bodyEnd.type !== 'keyword' || bodyEnd.contents !== '}') {
			raise(bodyEnd, 'Expected "}"')
		}

		return {
			type: 'class-declaration',
			name: nameToken,
			start: classToken.position.from,
			extends: extendsToken,
			body,
			end: bodyEnd.position.to,
		}
	}

	const parseAssignment = (): ClassAssignmentNode => {
		const nameToken = popToken()

		if (nameToken.type !== 'identifier') {
			raise(nameToken, 'Expected identifier')
		}

		const nextToken = peekToken(0)
		if (nextToken.type === 'keyword' && nextToken.contents === '=') {
			popToken()
			const init = parseLiteral()

			return {
				type: 'literal-assignment',
				name: nameToken,
				init,
				start: nameToken.position.from,
				end: init.end,
			}
		}

		if (
			nextToken.type === 'keyword' &&
			nextToken.contents === '[' &&
			peekToken(1).type === 'keyword' &&
			peekToken(1).contents === ']' &&
			peekToken(2).type === 'keyword' &&
			peekToken(2).contents === '='
		) {
			popToken()
			popToken()
			popToken()

			const init = parseArray()

			return {
				type: 'array-assignment',
				name: nameToken,
				init,
				start: nameToken.position.from,
				end: init.end,
			}
		}

		return raise(nextToken, 'Expected "=" or "[]="')
	}

	const parseArray = (): ClassArrayNode => {
		const elements = [] as (ClassArrayNode | ClassLiteralNode)[]

		const start = popToken()

		if (start.type !== 'keyword' || start.contents !== '{') {
			raise(start, 'Expected "{"')
		}

		while (true) {
			let token = peekToken(0)

			if (token.type === 'keyword' && token.contents === '}') {
				break
			}

			// TODO: Better handling of ,
			if (token.type === 'keyword' && token.contents === ',') {
				popToken()
				token = peekToken(0)
			}

			if (token.type === 'keyword' && token.contents === '{') {
				elements.push(parseArray())
				continue
			}

			elements.push(parseLiteral())
		}

		const end = popToken()

		if (end.type !== 'keyword' || end.contents !== '}') {
			raise(end, 'Expected "}"')
		}

		return {
			type: 'array',
			elements,
			start: start.position.from,
			end: end.position.to,
		}
	}

	const parseLiteral = (): ClassLiteralNode => {
		const token = popToken()

		if (token.type === 'string' || token.type === 'number') {
			return {
				type: 'literal',
				value: token.contents,
				raw: token.contents,
				start: token.position.from,
				end: token.position.to,
			}
		}

		return raise(token, 'Expected string or number')
	}

	return {
		type: 'file',
		body: parseCode(),
		start: 0,
		end: source.length,
	}
}
