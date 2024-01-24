import { defineRule } from '../defineRule'

export const uppercaseGlobalsRule = defineRule({
	id: 'uppercase-globals',
	walk: (node, ctx) => {
		if (
			node.type === 'variable' &&
			!node.id.contents.startsWith('_') &&
			!node.id.contents.includes('_fnc_') &&
			node.id.contents.match(/[a-z]/)
		) {
			ctx.report({
				rule: 'uppercase-globals',
				message: `Global variables should use only uppercase letters.`,
				node,
			})
		}
	},
})
