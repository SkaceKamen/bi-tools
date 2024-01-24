import { Node } from '@/parser/parser'
import { RuleContext } from './types'

type RuleDefinition = {
	id: string
	init?: () => void
	walk: (node: Node, ctx: RuleContext) => void
}

export const defineRule = (rule: RuleDefinition) => rule
