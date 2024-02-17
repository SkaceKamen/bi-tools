import {
	SqfLiteralNode,
	SqfNode,
	SqfToken,
	walkSqf,
} from '@bi-tools/sqf-parser'

const isStringLiteral = (
	node: SqfNode
): node is SqfLiteralNode & { value: string } =>
	node.type === 'literal' && typeof node.value === 'string'

const determineType = (node: SqfNode) => {
	if (node.type === 'literal') {
		if (typeof node.value === 'string') {
			return 'string'
		} else if (typeof node.value === 'number') {
			return 'scalar'
		}
	}

	return undefined
}

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
			assignments: {
				position: [from: number, to: number]
				comment?: string
				type?: string
			}[]
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
		switch (node.type) {
			case 'assignment': {
				let comment = undefined as string | undefined
				const firstToken = sourceTokens.findIndex(
					(token) => token.position[0] === node.position[0]
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
					position: node.position,
					comment,
					type: determineType(node.init),
				})

				break
			}

			case 'variable': {
				const name = node.id.contents
				getVariable(name).usage.push(node.position)

				break
			}

			case 'binary-expression': {
				switch (node.operator.contents) {
					case 'params': {
						if (node.right.type === 'array') {
							for (const item of node.right.elements) {
								if (isStringLiteral(item)) {
									const name = item.value
									getVariable(name).assignments.push({
										position: item.position,
										comment: undefined,
									})
								} else if (item.type === 'array') {
									const firstItem = item.elements[0]
									if (isStringLiteral(firstItem)) {
										const name = firstItem.value
										getVariable(name).assignments.push({
											position: firstItem.position,
											comment: undefined,
										})
									}
								}
							}
						}

						break
					}

					case 'private': {
						if (node.right.type === 'array') {
							for (const item of node.right.elements) {
								if (isStringLiteral(item)) {
									const name = item.value
									getVariable(name).assignments.push({
										position: item.position,
										comment: undefined,
									})
								}
							}
						}

						break
					}
				}
			}
		}
	})

	return {
		variables,
	}
}
