import { Node } from '@/parser/parser'
import { uppercaseGlobalsRule } from './rules/uppercaseGlobalsRule'
import { undefinedVariablesRule } from './rules/undefinedVariablesRule'
import { indentationRule } from './rules/indentationRule'
import { preferPrivateRule } from './rules/preferPrivateRule'

export const lint = (node: Node, code: string) => {
	const rules = [
		uppercaseGlobalsRule,
		undefinedVariablesRule,
		indentationRule,
		preferPrivateRule,
	]

	const issues = [] as {
		position: { start: number; end: number }
		message: string
	}[]

	const ctx = {
		sourceCode: code,
		root: node,
		report: (data: {
			position: { start: number; end: number }
			message: string
		}) => {
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

	return issues.map((issue) => ({
		...issue,
		position: {
			...issue.position,
			startLine: code.slice(0, issue.position.start).split('\n').length,
			startOffset:
				issue.position.start -
				code.slice(0, issue.position.start).lastIndexOf('\n'),
			endLine: code.slice(0, issue.position.end).split('\n').length,
			endOffset:
				issue.position.end -
				code.slice(0, issue.position.end).lastIndexOf('\n'),
		},
	}))
}
