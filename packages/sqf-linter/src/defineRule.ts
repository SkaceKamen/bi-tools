import { SqfNode } from '@bi-tools/sqf-parser'
import { RuleContext } from './types'

type RuleDefinition = {
	id: string
	init?: () => void
	walk: (node: SqfNode, ctx: RuleContext) => void
}

export const defineRule = (rule: RuleDefinition) => rule
