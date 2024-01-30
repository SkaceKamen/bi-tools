export const parseOperators = (input: string) => {
	const ternaryOperators = new Set<string>()
	const binaryOperators = new Set<string>()
	const unaryOperators = new Set<string>()

	input.split('\n').forEach((op) => {
		if (op.startsWith('b:')) {
			ternaryOperators.add(op.split(' ')[1].toLowerCase())
		} else if (op.startsWith('u:')) {
			binaryOperators.add(op.split(' ')[0].replace('u:', '').toLowerCase())
		} else if (op.startsWith('n:')) {
			unaryOperators.add(op.replace('n:', '').toLowerCase())
		}
	})

	return {
		ternaryOperators,
		binaryOperators,
		unaryOperators,
	}
}
