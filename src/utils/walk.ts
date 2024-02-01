import { Node } from '@/parser/parser'

export const walk = (node: Node, callback: (node: Node) => void) => {
	callback(node)

	switch (node.type) {
		case 'script':
			for (const child of node.body) {
				walk(child, callback)
			}
			break
		case 'array':
			for (const child of node.elements) {
				walk(child, callback)
			}
			break
		case 'assignment':
			walk(node.init, callback)
			break
		case 'binary-expression':
			walk(node.right, callback)
			break
		case 'ternary-expression':
			walk(node.left, callback)
			walk(node.right, callback)
			break
		case 'block':
			for (const child of node.body) {
				walk(child, callback)
			}
			break
	}
}
