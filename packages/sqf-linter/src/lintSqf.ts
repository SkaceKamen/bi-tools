import { SqfNode, SqfToken, walkSqf } from '@bi-tools/sqf-parser'
import { globalsTagRule } from './rules/globalsTagRule'
import { indentationRule } from './rules/indentationRule'
import { preferPrivateRule } from './rules/preferPrivateRule'
import { properCasingRule } from './rules/properCasingRule'
import { undefinedVariablesRule } from './rules/undefinedVariablesRule'
import { LintIssue, RuleContext } from './types'

type Props = {
	root: SqfNode
	code: string
	tokens: SqfToken[]
}

export const lintSqf = ({ root, code, tokens }: Props) => {
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
		root,
		tokens,
		report: (data: LintIssue) => {
			issues.push(data)
		},
	}

	const disabledRules = new Set<string>()

	for (const token of tokens) {
		if (token.type === 'line-comment') {
			const match = /^\/\/\s*sqf-lint-disable\s*(.+)$/.exec(token.contents)
			if (match) {
				const rules = match[1].split(',')
				for (const rule of rules) {
					disabledRules.add(rule.trim())
				}
			}
		}
	}

	for (const rule of rules) {
		if (!disabledRules.has(rule.id)) {
			rule.init?.()
		}
	}

	walkSqf(root, (node) => {
		for (const rule of rules) {
			if (!disabledRules.has(rule.id)) {
				rule.walk(node, ctx)
			}
		}
	})

	return issues
}
