import { defineRule } from '../defineRule'

export const globalsTagRule = defineRule({
	id: 'globals-start-with-tag',
	walk: (node, ctx) => {
		if (
			node.type === 'variable' &&
			!node.id.contents.startsWith('_') &&
			!node.id.contents.includes('_fnc_') &&
			!node.id.contents.match(/^[A-Z0-9]_?/)
		) {
			ctx.report({
				rule: 'globals-start-with-tag',
				message: `Global variables should start with TAG_`,
				position: node.position,
			})
		}
	},
})
