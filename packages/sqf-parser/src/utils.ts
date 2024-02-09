export const partition = <T>(a: T[], condition: (item: T) => boolean) => {
	const left: T[] = []
	const right: T[] = []

	for (const item of a) {
		if (condition(item)) {
			left.push(item)
		} else {
			right.push(item)
		}
	}

	return [left, right] as const
}
