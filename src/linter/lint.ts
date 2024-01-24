import { Node } from '@/parser/parser'
import { uppercaseGlobalsRule } from './rules/uppercaseGlobalsRule'
import { undefinedVariablesRule } from './rules/undefinedVariablesRule'

export const lint = (node: Node, code: string) => {
	const rules = [uppercaseGlobalsRule, undefinedVariablesRule]
	const issues = [] as {
		node: Node
		message: string
	}[]

	const ctx = {
		sourceCode: code,
		root: node,
		report: (data: { node: Node; message: string }) => {
			issues.push(data)
		},
	}

	const walk = (node: Node) => {
		for (const rule of rules) {
			rule.walk(node, ctx)
		}

		switch (node.type) {
			case 'script':
				for (const child of node.body) {
					walk(child)
				}
				break
			case 'array':
				for (const child of node.elements) {
					walk(child)
				}
				break
			case 'assignment':
				walk(node.init)
				break
			case 'binary-expression':
				walk(node.right)
				break
			case 'ternary-expression':
				walk(node.left)
				walk(node.right)
				break
			case 'block':
				for (const child of node.body) {
					walk(child)
				}
				break
		}
	}

	walk(node)

	return issues
}
