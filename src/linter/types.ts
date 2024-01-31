import { Node } from '@/parser/parser'

export type RuleContext = {
	sourceCode: string
	root: Node
	report: (data: {
		rule: string
		position: { start: number; end: number }
		message: string
	}) => void
}
