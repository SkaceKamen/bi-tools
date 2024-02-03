import { SqfNode } from '@/sqf-parser/parseSqf'
import { walk } from '@/utils/walk'
import { indentationRule } from './rules/indentationRule'
import { preferPrivateRule } from './rules/preferPrivateRule'
import { undefinedVariablesRule } from './rules/undefinedVariablesRule'
import { uppercaseGlobalsRule } from './rules/uppercaseGlobalsRule'

export const lintSqf = (node: SqfNode, code: string) => {
	const rules = [
		uppercaseGlobalsRule,
		undefinedVariablesRule,
		indentationRule,
		preferPrivateRule,
	]

	const issues = [] as {
		position: { start: number; end: number }
		message: string
		rule: string
	}[]

	const ctx = {
		sourceCode: code,
		root: node,
		report: (data: {
			position: { start: number; end: number }
			message: string
			rule: string
		}) => {
			issues.push(data)
		},
	}

	walk(node, (node) => {
		for (const rule of rules) {
			rule.walk(node, ctx)
		}
	})

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
