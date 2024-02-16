import { expect, it } from 'vitest'
import { preprocess } from './preprocess'
import { getMappedOffsetAt } from './getMappedOffsetAt'

/** use ⮓ for new line, makes debugging offsets easier */
const src = (input: string) => input.replace(/⮓/g, '\n')

/** replace NL with ⮓, makes it easier to debug offsets */
// const normalize = (input: string) => input.replace(/\n/g, '⮓')

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

	expect(result.code).toBe('                                      ')
})

it('parses nested macros', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1,arg2) arg1\n#define MACRO2(arg1,arg2) arg2\nMACRO1(a,MACRO2(b,c))',
		{
			filename: '',
		}
	)

	expect(result.code).toBe(
		'                              \n                              \na'
	)
})

// TODO: Argument value being the same as argument name causes infinite loop
/*
it('parses nested macros', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1,arg2) arg1\n#define MACRO2(arg1,arg2) arg2\nMACRO1(arg1,MACRO2(b))',
		{
			filename: '',
		}
	)

	console.log(result)

	expect(result.code).toBe('arg1')
})
*/

it('processes strings in arguments', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1,arg2) arg1\n\nMACRO1("test,test",b)',
		{
			filename: '',
		}
	)

	expect(result.code).toBe('                              \n\n"test,test"')
})

it('processes marco calls with arguments on multiple lines', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1,arg2) arg1##arg2\n\nMACRO1(\n"test,test",\nb)',
		{
			filename: '',
		}
	)

	expect(result.code).toBe(
		'                                    \n\n\n"test,test"\nb'
	)
})

it('glues together nested macro values from left', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1,arg2) arg1##_##arg2\n#define TEST tst\nMACRO1(TEST,arg)',
		{
			filename: '',
		}
	)

	expect(result.code).toBe(
		'                                       \n                \ntst_arg'
	)
})

it('glues together nested macro values from right', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1,arg2) arg1##_##arg2\n#define TEST tst\nMACRO1(arg,TEST)',
		{
			filename: '',
		}
	)

	expect(result.code).toBe(
		'                                       \n                \narg_tst'
	)
})

it('glues together nested macro values from both sides', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1,arg2) arg1##_##arg2\n#define TEST tst\nMACRO1(TEST,TEST)',
		{
			filename: '',
		}
	)

	expect(result.code).toBe(
		'                                       \n                \ntst_tst'
	)
})

it('expands from the left', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1,arg2) arg2\n#define TEST a,b\nMACRO1(aha,[TEST])',
		{
			filename: '',
		}
	)

	expect(result.code).toBe(
		'                              \n                \n[a,b]'
	)
})

it('allows arrays with multiple elements as single arg', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1) arg1\nMACRO1(format ["%1, ahoj", b])',
		{
			filename: '',
		}
	)

	expect(result.code).toBe('                         \nformat ["%1, ahoj", b]')
})

it('allows multiline macros with escapes', async () => {
	const result = await preprocess('#define MACRO1 test\\\ntest\nMACRO1', {
		filename: '',
	})

	expect(result.code).toBe('                         \ntesttest')
})

it('provides proper source maps when using macros', async () => {
	const result = await preprocess(
		'#define MACRO1(arg1) test##arg1\\\ntest\nMACRO1("aj")\n_arr select 1',
		{
			filename: 'test',
		}
	)

	const resolved = getMappedOffsetAt(result.sourceMap, 55, 'test')

	expect(result.sourceMap).toEqual([
		{
			offset: 38,
			fileOffset: 21,
			file: 'test',
		},
		{
			offset: 52,
			fileOffset: 50,
			file: 'test',
		},
	])

	expect(resolved.file).toBe('test')
	expect(resolved.offset).toBe(53)
})

it('proper macro positions', async () => {
	const source = src(
		'#define MACRO1 test⮓#ifdef MACRO1⮓#define MACRO2 test⮓#endif⮓'
	)
	const result = await preprocess(source, { filename: 'test' })

	expect(result.defines.get('MACRO1')?.location).toEqual([0, 19])
	expect(result.defines.get('MACRO2')?.location).toEqual([34, 53])
})

it('if generates proper source maps', async () => {
	const source = src(
		'#define MACRO1 test⮓#ifdef MACRO1⮓#define MACRO2 test⮓#endif⮓'
	)
	const result = await preprocess(source, { filename: 'test' })

	console.log(result.sourceMap)
})
