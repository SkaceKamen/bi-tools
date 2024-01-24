import {
	ArrayNode,
	AssignmentNode,
	BinaryExpressionNode,
	BlockNode,
	LiteralNode,
	Node,
	ScriptNode,
	TernaryExpressionNode,
	VariableNode,
} from './parser'

const indent = (str: string, level = 2) => {
	return ' '.repeat(level) + str
}

export const stringify = (value: Node, level = 0) => {
	const scriptNode = (node: ScriptNode): string => {
		return node.body.map((t) => stringify(t)).join(';\n')
	}

	const assignmentNode = (node: AssignmentNode): string => {
		return `${node.private ? 'private ' : ''}${node.id.contents} = ${stringify(
			node.init,
			level + 1
		)}`
	}

	const arrayNode = (node: ArrayNode): string => {
		return `[${node.elements.map((t) => stringify(t, level)).join(', ')}]`
	}

	const codeBlockNode = (node: BlockNode): string => {
		return `{\n${node.body
			.map((t) => indent(stringify(t, level + 1), level * 2))
			.join(';\n')}\n${indent('}', (level - 1) * 2)}`
	}

	const literalNode = (node: LiteralNode): string => {
		return node.raw
	}

	const ternaryExpressionNode = (node: TernaryExpressionNode): string => {
		return `(${stringify(node.left, level)}) ${
			node.operator.contents
		} (${stringify(node.right, level)})`
	}

	const binaryExpressionNode = (node: BinaryExpressionNode): string => {
		return `${node.operator.contents} (${stringify(node.right, level)})`
	}

	const variableExpressionNode = (node: VariableNode): string => {
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
