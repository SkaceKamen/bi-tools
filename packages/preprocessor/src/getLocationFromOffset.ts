export const getLocationFromOffset = (offset: number, sourceCode: string) => {
	const slice = sourceCode.slice(0, offset)
	const line = slice.split('\n').length
	const column = offset - slice.lastIndexOf('\n')

	return { line, column }
}
