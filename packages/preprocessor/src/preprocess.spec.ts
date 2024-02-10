import { expect, it } from 'vitest'
import { preprocess } from './preprocess'

it('properly concat arguments', async () => {
	const result = await preprocess(
		'#define DOUBLES(var1, var2) var1##_##var2\nDOUBLES(a,b)',
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

it('parses nested ifs', async () => {
	const result = await preprocess('#ifdef TEST\n#ifdef TEST2\n#endif\n#endif', {
		filename: '',
	})

	expect(result.code).toBe('')
})

/*
TODO: Infinite loop
it('parses nested macros', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1,arg2) arg1\n#define MACRO2(arg1,arg2) arg2\nMACRO1(arg1,MACRO2(arg2))',
		{
			filename: '',
		}
	)

	console.log(result)

	expect(result.code).toBe('arg1')
})
*/
