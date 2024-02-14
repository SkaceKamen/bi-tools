import { expect, it } from 'vitest'
import { getMappedOffsetAt } from './getMappedOffsetAt'

it('performance is manageable', () => {
	const sourcemap = Array.from({ length: 10000 }).map((_, i) => ({
		offset: i,
		fileOffset: i,
		file: 'test',
	}))

	const start = performance.now()
	const result = getMappedOffsetAt(sourcemap, 9_500, 'test')
	const end = performance.now()

	expect(result.itemIndex).toBe(9499)
	expect(result.offset).toBe(9500)
	expect(result.file).toBe('test')
	expect(end - start).toBeLessThan(0.2)
})

it('works for empty source map', () => {
	const result = getMappedOffsetAt([], 0, 'test')

	expect(result.itemIndex).toBe(null)
	expect(result.offset).toBe(0)
	expect(result.file).toBe('test')
})

it('works when offset is outside source map range', () => {
	const result = getMappedOffsetAt(
		[
			{
				offset: 10,
				fileOffset: 5,
				file: 'test',
			},
		],
		12,
		'test'
	)

	expect(result.itemIndex).toBe(0)
	expect(result.offset).toBe(7)
	expect(result.file).toBe('test')
})

it('works when offset is before first source map item', () => {
	const result = getMappedOffsetAt(
		[
			{
				offset: 10,
				fileOffset: 5,
				file: 'test',
			},
		],
		8,
		'test'
	)

	expect(result.itemIndex).toBe(null)
	expect(result.offset).toBe(8)
	expect(result.file).toBe('test')
})

it('maps to correct offset', () => {
	const sourceMap = [
		{
			offset: 10,
			fileOffset: 5,
			file: 'test-1',
		},
		{
			offset: 20,
			fileOffset: 15,
			file: 'test-2',
		},
	]

	const result = getMappedOffsetAt(sourceMap, 12, 'test')
	const result2 = getMappedOffsetAt(sourceMap, 21, 'test')
	const result3 = getMappedOffsetAt(sourceMap, 8, 'test')

	expect(result.itemIndex).toBe(0)
	expect(result.offset).toBe(7)
	expect(result.file).toBe('test-1')

	expect(result2.itemIndex).toBe(1)
	expect(result2.offset).toBe(16)
	expect(result2.file).toBe('test-2')

	expect(result3.itemIndex).toBe(null)
	expect(result3.offset).toBe(8)
	expect(result3.file).toBe('test')
})
