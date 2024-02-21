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

export const undefinedVariablesRule = defineRule({
	id: 'undefined-variables',
	init() {
		alreadyDefined.clear()
		alreadyDefined.add('_x')
		alreadyDefined.add('_foreachindex')
	},
	walk(node, ctx) {
		switch (node.type) {
			// Allow to define variable by "// @define <<name>>"
			case 'script': {
				ctx.tokens
					.filter((t) => t.type === 'line-comment')
					.forEach((token) => {
						const match = token.contents.match(
							/\/\/\s*@define\s+([a-zA-Z0-9_]+)/i
						)
						if (match) {
							alreadyDefined.add(match[1].toLowerCase())
						}
					})

				break
			}

			case 'ternary-expression': {
				if (node.operator.contents === 'params') {
					if (node.right.type === 'array') {
						parsePrivateArgs(node.right)
					}
				}
				break
			}

			case 'binary-expression': {
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

				break
			}

			case 'assignment': {
				alreadyDefined.add(node.id.contents.toLowerCase())
				break
			}

			case 'variable': {
				if (!node.id.contents.startsWith('_')) {
					break
				}

				if (!alreadyDefined.has(node.id.contents.toLowerCase())) {
					ctx.report({
						rule: 'undefined-variables',
						message: `Variable "${node.id.contents}" is not defined.`,
						position: node.position,
					})
				}
			}
		}
	},
})
