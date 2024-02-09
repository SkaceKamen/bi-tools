import { EnforceScriptToken } from './tokenizeEnforceScript'

export type EnforceScriptNodeBase = {
	position: [from: number, to: number]
}

export type EnforceScriptNode = EnforceScriptClassNode

export type EnforceScriptClassNode = EnforceScriptNodeBase & {
	type: 'class'
	body: EnforceScriptNode[]
	name: EnforceScriptToken
	modifiers: EnforceScriptToken[]
	extends: EnforceScriptToken | null
}

export class EnforceScriptParserError extends Error {
	constructor(message: string, public token: EnforceScriptToken) {
		super(message)
	}
}

export const parseEnforceScript = (
	tokens: EnforceScriptToken[],
	{
		code,
		debug = false,
	}: {
		code: string
		debug?: boolean
	}
) => {
	let index = 0

	// Remove comments as they're useless now
	tokens = tokens.filter(
		(t) => t.type !== 'line-comment' && t.type !== 'multi-line-comment'
	)

	const raise = (message: string, token = tokens[index]) => {
		debug &&
			console.trace(
				`(at ${index}) Raising: ${message} (at ${token.type} "${token.contents}")`
			)

		throw new EnforceScriptParserError(message, token)
	}

	const peekToken = (offset: number) => {
		if (index + offset >= tokens.length) {
			raise('Unexpected end of file')
		}

		return tokens[index + offset]
	}

	const popToken = () => {
		if (index >= tokens.length) {
			raise('Unexpected end of file')
		}

		const token = tokens[index]
		index++
		return token
	}

	/**
	 * Code: RootExpression*
	 * RootExpression: ClassDeclaration | EnumDeclaration | TypedefDeclaration | Assignment | FunctionDeclaration
	 * EnumDeclaration: 'enum' Identifier '{' EnumField (',' EnumField)* '}' ';'?
	 * EnumField: Identifier ('=' (Number | String))?
	 * TypedefDeclaration: 'typedef' Type Identifier ';'?
	 * ClassDeclaration: ('private')? ('internal')? ('sealed')? 'class' Identifier ((':' | 'extends') Identifier)? '{' ClassBody '}'
	 * ClassBody: MemberDeclaration | MethodDeclaration
	 * MemberDeclaration: ('private' | 'protected')? ('static')? Type Identifier ('=' Expression)? ';'
	 * MethodDeclaration: ('private' | 'protected')? ('static')? Type '~'? Identifier '(' ParameterList ')' ('=' Expression)? '{' Statement* '}'
	 * Assignment: Identifier ('=' Expression)? ';'
	 * FunctionDeclaration: ('private' | 'protected')? ('static')? Type Identifier '(' ParameterList ')' ('=' Expression)? '{' Statement* '}'
	 * ParameterList: (Type Identifier (',' Type Identifier)*)?
	 * Statement: IfStatement | ForStatement | ForeachStatement | SwitchStatement | ReturnStatement | ExpressionStatement
	 * IfStatement: 'if' '(' Expression ')' '{' Statement* '}' ('else' '{' Statement* '}')?
	 * ForStatement: 'for' '(' Expression? ';' Expression? ';' Expression? ')' '{' Statement* '}'
	 * ForeachStatement: 'foreach' '(' Type Identifier 'in' Expression ')' '{' Statement* '}'
	 * SwitchStatement: 'switch' '(' Expression ')' '{' 'case' Expression ':' Statement* 'default' ':' Statement* '}'
	 * ReturnStatement: 'return' Expression? ';'
	 * ExpressionStatement: Expression ';'
	 * Expression: AssignmentExpression | NonAssignmentExpression
	 */
}
