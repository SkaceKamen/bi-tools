import { defineRule } from '../defineRule'
import { getCommands } from '@bi-tools/sqf-commands'

const operatorsMap = getCommands()

export const properCasingRule = defineRule({
	id: 'proper-casing',
	walk: (node, ctx) => {
		if (
			node.type === 'binary-expression' ||
			node.type === 'unary-expression' ||
			node.type === 'ternary-expression'
		) {
			const operator = node.operator.contents
			const definition = operatorsMap[operator.toLowerCase()]
			if (definition && definition.title !== operator) {
				ctx.report({
					rule: 'proper-casing',
					message: `Operator "${operator}" is not in the list of known operators`,
					position: {
						start: node.operator.position.from,
						end: node.operator.position.to,
					},
				})
			}
		}
	},
})
