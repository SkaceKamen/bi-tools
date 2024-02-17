import { SqfNode } from '@bi-tools/sqf-parser'
import { defineRule } from '../defineRule'

export const indentationRule = defineRule({
	id: 'indentation',
	walk(node, ctx) {
		const isFirstNode = (node: SqfNode) => {
			let previousLineIndex = ctx.sourceCode
				.slice(0, node.position[0])
				.lastIndexOf('\n')

			if (previousLineIndex < 0) {
				previousLineIndex = 0
			}

			return (
				ctx.sourceCode
					.slice(previousLineIndex + 1, node.position[0])
					.match(/^[ \t]*$/) !== null
			)
		}

		const getIndentOf = (node: SqfNode) => {
			let previousLineIndex = ctx.sourceCode
				.slice(0, node.position[0])
				.lastIndexOf('\n')

			if (previousLineIndex < 0) {
				previousLineIndex = -1
			}

			return {
				length: node.position[0] - (previousLineIndex + 1),
				start: previousLineIndex + 1,
				end: node.position[0],
			}
		}

		const checkIndentOf = (nodes: SqfNode[], targetIndent: number) => {
			for (const node of nodes) {
				const firstNode = isFirstNode(node)
				const indent = getIndentOf(node)
				if (firstNode && indent.length !== targetIndent) {
					ctx.report({
						rule: 'indentation',
						message: `Expected indentation of ${targetIndent}, but got ${indent.length}.`,
						position: [indent.start, indent.end],
					})
				}

				if (node.type === 'block') {
					checkIndentOf(node.body, targetIndent + 1)
				}

				if (node.type === 'assignment') {
					// if (node.init.type === 'block') {
					checkIndentOf([node.init], targetIndent)
					// }
				}

				if (node.type === 'array') {
					checkIndentOf(node.elements, targetIndent + 1)
				}
			}
		}

		if (node.type === 'script') {
			checkIndentOf(node.body, 0)
		}
	},
})
