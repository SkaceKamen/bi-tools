import { SqfArrayNode } from '@bi-tools/sqf-parser'
import { defineRule } from '../defineRule'

const alreadyDefined = new Set<string>()

const parsePrivateArgs = (node: SqfArrayNode) => {
	for (const item of node.elements) {
		if (item.type === 'literal' && typeof item.value === 'string') {
			alreadyDefined.add(item.value.toLowerCase())
		} else if (
			item.type === 'array' &&
			item.elements[0]?.type === 'literal' &&
			typeof item.elements[0].value === 'string'
		) {
			alreadyDefined.add(item.elements[0].value.toLowerCase())
		}
	}
}

export const preferPrivateRule = defineRule({
	id: 'prefer-private',
	walk: (node, ctx) => {
		// TODO: Doesn't work properly with params [] and private []

		if (node.type === 'ternary-expression') {
			if (node.operator.contents === 'params') {
				if (node.right.type === 'array') {
					parsePrivateArgs(node.right)
				}
			}
		} else if (node.type === 'binary-expression') {
			if (node.operator.contents === 'private') {
				if (
					node.right.type === 'literal' &&
					typeof node.right.value === 'string'
				) {
					alreadyDefined.add(node.right.value.toLowerCase())
				}

				if (node.right.type === 'array') {
					for (const item of node.right.elements) {
						if (item.type === 'literal' && typeof item.value === 'string') {
							alreadyDefined.add(item.value.toLowerCase())
						} else if (
							item.type === 'array' &&
							item.elements[0]?.type === 'literal' &&
							typeof item.elements[0].value === 'string'
						) {
							alreadyDefined.add(item.elements[0].value.toLowerCase())
						}
					}
				}
			}

			if (node.operator.contents === 'params') {
				if (node.right.type === 'array') {
					parsePrivateArgs(node.right)
				}
			}
		} else if (node.type === 'assignment' && node.id.contents.startsWith('_')) {
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
