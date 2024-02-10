import { expect, it } from 'vitest'
import { preprocess } from './preprocess'

it('properly concat arguments', async () => {
	const result = await preprocess(
		'#define DOUBLES(var1, var2) var1##_##var2\nDOUBLES(a, b)',
		{
			filename: '',
		}
	)

	expect(result.code).toBe('                                         \na_b')
})

it('properly quotes arguments', async () => {
	const result = await preprocess('#define QUOTE(var1) #var1\nQUOTE(test)', {
		filename: '',
	})

	expect(result.code).toBe('                         \n"test"')
})
