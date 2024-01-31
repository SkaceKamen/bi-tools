import { defineRule } from '../defineRule'

const alreadyDefined = new Set<string>(['_x', '_foreachindex'])

export const undefinedVariablesRule = defineRule({
	id: 'undefined-variables',
	walk(node, ctx) {
		if (node.type === 'assignment') {
			alreadyDefined.add(node.id.contents.toLowerCase())
		} else if (node.type === 'variable' && node.type.startsWith('_')) {
			if (!alreadyDefined.has(node.id.contents.toLowerCase())) {
				ctx.report({
					rule: 'undefined-variables',
					message: `Variable "${node.id.contents}" is not defined.`,
					position: { start: node.start, end: node.end },
				})
			}
		}
	},
})
