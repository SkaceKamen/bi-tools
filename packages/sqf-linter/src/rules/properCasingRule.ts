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
					message: `"${operator}" should be "${definition.title}"`,
					position: node.operator.position,
					fix: (fixer) => {
						fixer.replace(
							node.operator.position[0],
							node.operator.position[1],
							definition.title
						)
					},
				})
			}
		}
	},
})
