import { SqfToken } from '@/sqf-parser/tokenizeSqf'
import { ConfigToken } from './tokenizeConfig'

type ConfigBaseNode = { start: number; end: number }

type ConfigNode =
	| ConfigFileNode
	| ConfigClassDeclarationNode
	| ConfigAssignmentNode
	| ConfigArrayNode
	| ConfigLiteralNode

type ConfigFileNode = ConfigBaseNode & {
	type: 'file'
	body: (ConfigClassDeclarationNode | ConfigAssignmentNode)[]
}

type ConfigClassDeclarationNode = ConfigBaseNode & {
	type: 'class-declaration'
	name: ConfigToken
	extends: ConfigToken | null
	body: (ConfigClassDeclarationNode | ConfigAssignmentNode)[]
}

type ConfigAssignmentNode =
	| ConfigLiteralAssignmentNode
	| ConfigArrayAssignmentNode
	| ConfigSqfCodeAssignmentNode

type ConfigLiteralAssignmentNode = ConfigBaseNode & {
	type: 'literal-assignment'
	name: ConfigToken
	init: ConfigLiteralNode
}

type ConfigSqfCodeAssignmentNode = ConfigBaseNode & {
	type: 'sqf-assignment'
	name: ConfigToken
	init: ConfigSqfCode
}

type ConfigArrayAssignmentNode = ConfigBaseNode & {
	type: 'array-assignment'
	name: ConfigToken
	init: ConfigArrayNode
}

type ConfigArrayNode = ConfigBaseNode & {
	type: 'array'
	elements: (ConfigArrayNode | ConfigLiteralNode)[]
}

type ConfigLiteralNode = ConfigBaseNode & {
	type: 'literal'
	value: string | number
	raw: string
}

type ConfigSqfCode = ConfigBaseNode & {
	type: 'sqf-code'
	raw: string
}

export class ConfigParserError extends Error {
	constructor(message: string, public token: SqfToken) {
		super(message)
	}
}

export const parseConfig = (
	tokens: SqfToken[],
	source: string,
	{ debug = false }
): ConfigNode => {
	let index = 0

	// Remove comments as they're useless now
	tokens = tokens.filter(
		(t) => t.type !== 'line-comment' && t.type !== 'multi-line-comment'
	)

	const raise = (token: SqfToken, message: string) => {
		debug &&
			console.trace(
				`(at ${index}) Raising: ${message} (at ${token.type} "${token.contents}")`
			)

		throw new ConfigParserError(message, token)
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

	const parseCode = (): (
		| ConfigClassDeclarationNode
		| ConfigAssignmentNode
	)[] => {
		const body = [] as (ConfigClassDeclarationNode | ConfigAssignmentNode)[]

		while (index < tokens.length) {
			if (peekToken(0).type === 'eof' || peekToken(0).contents === '}') {
				break
			}

			// Skip any number of ';'
			while (peekToken(0).type === 'keyword' && peekToken(0).contents === ';') {
				popToken()
			}

			const token = peekToken(0)

			if (peekToken(0).type === 'eof' || peekToken(0).contents === '}') {
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

	const parseClassDeclaration = (): ConfigClassDeclarationNode => {
		const classToken = popToken()
		const nameToken = popToken()

		if (nameToken.type !== 'identifier') {
			raise(nameToken, 'Expected identifier')
		}

		let extendsToken: ConfigToken | null = null
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

	const parseAssignment = (): ConfigAssignmentNode => {
		const nameToken = popToken()

		if (nameToken.type !== 'identifier') {
			raise(nameToken, 'Expected identifier')
		}

		const nextToken = peekToken(0)
		if (nextToken.type === 'keyword' && nextToken.contents === '=') {
			popToken()

			if (peekToken(0).type === 'string' || peekToken(0).type === 'number') {
				const init = parseLiteral()

				return {
					type: 'literal-assignment',
					name: nameToken,
					init,
					start: nameToken.position.from,
					end: init.end,
				}
			}

			const init = parseSqfCode()

			return {
				type: 'sqf-assignment',
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

	const parseArray = (): ConfigArrayNode => {
		const elements = [] as (ConfigArrayNode | ConfigLiteralNode)[]

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

	const parseLiteral = (): ConfigLiteralNode => {
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

	// TODO: This is not really a correct way, but it kind of works for now
	const parseSqfCode = (): ConfigSqfCode => {
		const parseBrackets = () => {
			const token = popToken()
			if (token.contents !== '(') {
				raise(token, 'Expected "("')
			}

			const inside = parseSqfCode()

			const end = popToken()
			if (end.contents !== ')') {
				raise(token, 'Expected ")"')
			}

			return '(' + inside.raw + ')'
		}

		let result = ''

		while (true) {
			const token = peekToken(0)
			if (token.contents === '(') {
				result += parseBrackets()
			} else if (
				token.contents === ';' ||
				token.type === 'eof' ||
				token.contents === ')'
			) {
				return {
					type: 'sqf-code',
					raw: result,
					start: token.position.from,
					end: token.position.to,
				}
			} else {
				result += token.contents
				popToken()
			}
		}
	}

	return {
		type: 'file',
		body: parseCode(),
		start: 0,
		end: source.length,
	}
}
