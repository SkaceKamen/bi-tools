import { SqfNode, SqfToken, walkSqf } from '@bi-tools/sqf-parser'

export const analyzeSqf = (
	node: SqfNode,
	sourceTokens: SqfToken[],
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	sourceCode: string
) => {
	const variables = new Map<
		string,
		{
			originalName: string
			assignments: { position: [from: number, to: number]; comment?: string }[]
			usage: [from: number, to: number][]
		}
	>()

	const getVariable = (name: string) => {
		const nameKey = name.toLowerCase()
		if (!variables.has(nameKey)) {
			variables.set(nameKey, {
				originalName: name,
				assignments: [],
				usage: [],
			})
		}

		return variables.get(nameKey)!
	}

	walkSqf(node, (node) => {
		if (node.type === 'assignment') {
			let comment = undefined as string | undefined
			const firstToken = sourceTokens.findIndex(
				(token) => token.position.from === node.start
			)
			if (firstToken) {
				const previousToken = sourceTokens[firstToken - 1]
				if (
					previousToken.type === 'line-comment' ||
					previousToken.type === 'multi-line-comment'
				) {
					comment = previousToken.contents
				}
			}

			const name = node.id.contents
			getVariable(name).assignments.push({
				position: [node.start, node.end],
				comment,
			})
		} else if (node.type === 'variable') {
			const name = node.id.contents
			getVariable(name).usage.push([node.start, node.end])
		}
	})

	return {
		variables,
	}
}
