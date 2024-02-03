import { SqfNode } from '@/sqf-parser/parseSqf'

export const walkSqf = (node: SqfNode, callback: (node: SqfNode) => void) => {
	callback(node)

	switch (node.type) {
		case 'script':
			for (const child of node.body) {
				walkSqf(child, callback)
			}
			break
		case 'array':
			for (const child of node.elements) {
				walkSqf(child, callback)
			}
			break
		case 'assignment':
			walkSqf(node.init, callback)
			break
		case 'binary-expression':
			walkSqf(node.right, callback)
			break
		case 'ternary-expression':
			walkSqf(node.left, callback)
			walkSqf(node.right, callback)
			break
		case 'block':
			for (const child of node.body) {
				walkSqf(child, callback)
			}
			break
	}
}
