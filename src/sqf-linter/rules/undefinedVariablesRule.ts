import { SqfArrayNode } from '@/sqf-parser/parseSqf'
import { defineRule } from '../defineRule'

const alreadyDefined = new Set<string>(['_x', '_foreachindex'])

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

export const undefinedVariablesRule = defineRule({
	id: 'undefined-variables',
	walk(node, ctx) {
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
		} else if (node.type === 'assignment') {
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
