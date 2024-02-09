import {
	SqfArrayNode,
	SqfAssignmentNode,
	SqfBinaryExpressionNode,
	SqfBlockNode,
	SqfLiteralNode,
	SqfNode,
	SqfScriptNode,
	SqfTernaryExpressionNode,
	SqfVariableNode,
} from './parseSqfTokens'

const indent = (str: string, level = 2) => {
	return ' '.repeat(level) + str
}

export const stringifySqf = (value: SqfNode, level = 0) => {
	const scriptNode = (node: SqfScriptNode): string => {
		return node.body.map((t) => stringifySqf(t)).join(';\n')
	}

	const assignmentNode = (node: SqfAssignmentNode): string => {
		return `${node.private ? 'private ' : ''}${
			node.id.contents
		} = ${stringifySqf(node.init, level + 1)}`
	}

	const arrayNode = (node: SqfArrayNode): string => {
		return `[${node.elements.map((t) => stringifySqf(t, level)).join(', ')}]`
	}

	const codeBlockNode = (node: SqfBlockNode): string => {
		return `{\n${node.body
			.map((t) => indent(stringifySqf(t, level + 1), level * 2))
			.join(';\n')}\n${indent('}', (level - 1) * 2)}`
	}

	const literalNode = (node: SqfLiteralNode): string => {
		return node.raw
	}

	const ternaryExpressionNode = (node: SqfTernaryExpressionNode): string => {
		return `(${stringifySqf(node.left, level)}) ${
			node.operator.contents
		} (${stringifySqf(node.right, level)})`
	}

	const binaryExpressionNode = (node: SqfBinaryExpressionNode): string => {
		return `${node.operator.contents} (${stringifySqf(node.right, level)})`
	}

	const variableExpressionNode = (node: SqfVariableNode): string => {
		return node.id.contents ?? ''
	}

	switch (value.type) {
		case 'script':
			return scriptNode(value)
		case 'assignment':
			return assignmentNode(value)
		case 'array':
			return arrayNode(value)
		case 'block':
			return codeBlockNode(value)
		case 'literal':
			return literalNode(value)
		case 'ternary-expression':
			return ternaryExpressionNode(value)
		case 'binary-expression':
			return binaryExpressionNode(value)
		case 'unary-expression':
			return String(value.operator.contents)
		case 'variable':
			return variableExpressionNode(value)
	}
}
