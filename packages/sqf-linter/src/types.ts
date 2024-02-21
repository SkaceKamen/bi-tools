import { SqfNode, SqfToken } from '@bi-tools/sqf-parser'
import { Fixer } from './fixer'

export type RuleContext = {
	sourceCode: string
	root: SqfNode
	tokens: SqfToken[]
	report: (data: LintIssue) => void
}

export type LintIssue = {
	rule: string
	position: [start: number, end: number]
	message: string
	fix?: (fixer: Fixer) => void
}
