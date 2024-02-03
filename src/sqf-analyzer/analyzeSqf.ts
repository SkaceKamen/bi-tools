import { SqfNode } from '@/sqf-parser/parseSqf'
import { walk } from '@/utils/walk'

export const analyze = (node: SqfNode) => {
	const variables = new Map<
		string,
		{ originalName: string; assignments: [from: number, to: number][] }
	>()

	walk(node, (node) => {
		if (node.type === 'assignment') {
			const name = node.id.contents
			const nameKey = node.id.contents.toLowerCase()
			if (!variables.has(nameKey)) {
				variables.set(nameKey, { originalName: name, assignments: [] })
			}

			variables.get(nameKey)!.assignments.push([node.start, node.end])
		}
	})

	return {
		variables,
	}
}
