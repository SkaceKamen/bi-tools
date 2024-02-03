import { SqfNode } from '@/sqf-parser/parseSqf'

export const walk = (node: SqfNode, callback: (node: SqfNode) => void) => {
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
