import { SqfNode } from '@/sqf-parser/parseSqf'

export type RuleContext = {
	sourceCode: string
	root: SqfNode
	report: (data: {
		rule: string
		position: { start: number; end: number }
		message: string
	}) => void
}
