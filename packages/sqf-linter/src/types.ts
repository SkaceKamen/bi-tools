import { SqfNode } from '@bi-tools/sqf-parser'

export type RuleContext = {
	sourceCode: string
	root: SqfNode
	report: (data: {
		rule: string
		position: { start: number; end: number }
		message: string
	}) => void
}
