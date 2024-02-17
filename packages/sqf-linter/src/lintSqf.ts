import { SqfNode, walkSqf } from '@bi-tools/sqf-parser'
import { indentationRule } from './rules/indentationRule'
import { preferPrivateRule } from './rules/preferPrivateRule'
import { properCasingRule } from './rules/properCasingRule'
import { undefinedVariablesRule } from './rules/undefinedVariablesRule'
import { uppercaseGlobalsRule } from './rules/uppercaseGlobalsRule'

export const lintSqf = (node: SqfNode, code: string) => {
	const rules = [
		uppercaseGlobalsRule,
		undefinedVariablesRule,
		indentationRule,
		preferPrivateRule,
		properCasingRule,
	]

	const issues = [] as {
		position: [start: number, end: number]
		message: string
		rule: string
	}[]

	const ctx = {
		sourceCode: code,
		root: node,
		report: (data: {
			position: [start: number, end: number]
			message: string
			rule: string
		}) => {
			issues.push(data)
		},
	}

	walkSqf(node, (node) => {
		for (const rule of rules) {
			rule.walk(node, ctx)
		}
	})

	return issues
}
