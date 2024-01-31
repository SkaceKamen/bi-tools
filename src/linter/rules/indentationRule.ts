import { Node } from '@/parser/parser'
import { defineRule } from '../defineRule'

export const indentationRule = defineRule({
	id: 'indentation',
	walk(node, ctx) {
		const getIndentOf = (node: Node) => {
			let previousLineIndex = ctx.sourceCode
				.slice(0, node.start)
				.lastIndexOf('\n')

			if (previousLineIndex < 0) {
				previousLineIndex = 0
			}
			console.log(node)
			console.log({
				length: node.start - 1 - previousLineIndex,
				start: previousLineIndex,
				end: node.start - 1,
			})

			return {
				length: node.start - 1 - previousLineIndex,
				start: previousLineIndex,
				end: node.start - 1,
			}
		}

		const checkIndentOf = (nodes: Node[], targetIndent: number) => {
			for (const node of nodes) {
				const indent = getIndentOf(node)
				if (indent.length !== targetIndent) {
					ctx.report({
						rule: 'indentation',
						message: `Expected indentation of ${targetIndent}, but got ${indent.length}.`,
						position: { start: indent.start, end: indent.end },
					})
				}

				if (node.type === 'block') {
					checkIndentOf(node.body, targetIndent + 1)
				}

				if (node.type === 'assignment') {
					if (node.init.type === 'block') {
						checkIndentOf([node.init], targetIndent)
					}
				}
			}
		}

		if (node.type === 'script') {
			checkIndentOf(node.body, 0)
		}
	},
})
