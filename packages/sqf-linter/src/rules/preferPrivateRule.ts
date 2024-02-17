import { defineRule } from '../defineRule'

const alreadyDefined = new Set<string>()

export const preferPrivateRule = defineRule({
	id: 'prefer-private',
	walk: (node, ctx) => {
		// TODO: Doesn't work properly with params [] and private []

		if (node.type === 'assignment' && node.id.contents.startsWith('_')) {
			const varName = node.id.contents.toLowerCase()
			if (!node.private && !alreadyDefined.has(varName)) {
				ctx.report({
					rule: 'prefer-private',
					message: `Local variables should be declared as private`,
					position: node.position,
				})
			}

			alreadyDefined.add(varName)
		}
	},
})
