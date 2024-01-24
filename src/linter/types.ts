import { Node } from '@/parser/parser'

export type RuleContext = {
	sourceCode: string
	root: Node
	report: (data: { rule: string; node: Node; message: string }) => void
}
