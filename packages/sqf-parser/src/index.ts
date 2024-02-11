import { preprocess } from '@bi-tools/preprocessor'
import { parseSqfTokens } from './parseSqfTokens'
import { tokenizeSqf } from './tokenizeSqf'

export { walkSqf } from './walkSqf'
export * from './parseSqfTokens'
export * from './tokenizeSqf'

export const parseSqf = async (input: string, filename: string) => {
	// TODO: Errors should be adjusted to have proper position
	const preprocessed = await preprocess(input, { filename })
	const tokens = tokenizeSqf(preprocessed.code)

	return {
		ast: parseSqfTokens(tokens),
		sourceMap: preprocessed.sourceMap,
	}
}
