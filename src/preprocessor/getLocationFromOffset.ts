export const getLocationFromOffset = (offset: number, sourceCode: string) => {
	const line = sourceCode.slice(0, offset).split('\n').length
	const column = offset - sourceCode.slice(0, offset).lastIndexOf('\n')

	return { line, column }
}
