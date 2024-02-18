import { SqfNode, walkSqf } from '@bi-tools/sqf-parser'
import { indentationRule } from './rules/indentationRule'
import { preferPrivateRule } from './rules/preferPrivateRule'
import { properCasingRule } from './rules/properCasingRule'
import { undefinedVariablesRule } from './rules/undefinedVariablesRule'
import { globalsTagRule } from './rules/globalsTagRule'
import { LintIssue, RuleContext } from './types'

export const lintSqf = (node: SqfNode, code: string) => {
	const rules = [
		globalsTagRule,
		undefinedVariablesRule,
		indentationRule,
		preferPrivateRule,
		properCasingRule,
	]

	const issues = [] as LintIssue[]

	const ctx: RuleContext = {
		sourceCode: code,
		root: node,
		report: (data: LintIssue) => {
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
