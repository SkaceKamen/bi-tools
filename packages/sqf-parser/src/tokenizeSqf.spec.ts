import { test, expect } from 'vitest'
import { tokenizeSqf } from './tokenizeSqf'

test('parses strings', () => {
	expect(tokenizeSqf("'test'")).toEqual([
		{
			type: 'string',
			contents: "'test'",
			position: [0, 5],
		},
		{
			contents: '',
			type: 'eof',
			position: [6, 6],
		},
	])

	expect(tokenizeSqf('"test"')).toEqual([
		{
			type: 'string',
			contents: '"test"',
			position: [0, 5],
		},
		{
			contents: '',
			type: 'eof',
			position: [6, 6],
		},
	])
})

test('parses strings with escapes', () => {
	expect(tokenizeSqf('"te""st"')).toEqual([
		{
			type: 'string',
			contents: '"te""st"',
			position: [0, 7],
		},
		{
			contents: '',
			type: 'eof',
			position: [8, 8],
		},
	])
	expect(tokenizeSqf("'te''st'")).toEqual([
		{
			type: 'string',
			contents: "'te''st'",
			position: [0, 7],
		},
		{
			contents: '',
			type: 'eof',
			position: [8, 8],
		},
	])
})

test('parses numbers', () => {
	expect(tokenizeSqf('144.2e5')).toEqual([
		expect.objectContaining({
			type: 'number',
			contents: '144.2e5',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])

	expect(tokenizeSqf('10e-005')).toEqual([
		expect.objectContaining({
			type: 'number',
			contents: '10e-005',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])

	expect(tokenizeSqf('10E-005')).toEqual([
		expect.objectContaining({
			type: 'number',
			contents: '10E-005',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])

	expect(tokenizeSqf('0xEf5')).toEqual([
		expect.objectContaining({
			type: 'number',
			contents: '0xEf5',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])

	expect(tokenizeSqf('0b0110')).toEqual([
		expect.objectContaining({
			type: 'number',
			contents: '0b0110',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])

	expect(tokenizeSqf('0o655')).toEqual([
		expect.objectContaining({
			type: 'number',
			contents: '0o655',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])
})

test('parses line comments', () => {
	expect(tokenizeSqf(' // test comment')).toEqual([
		expect.objectContaining({
			type: 'line-comment',
			contents: '// test comment',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])

	expect(tokenizeSqf(' // test comment\n')).toEqual([
		expect.objectContaining({
			type: 'line-comment',
			contents: '// test comment',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])

	expect(tokenizeSqf(' // test comment\r\n')).toEqual([
		expect.objectContaining({
			type: 'line-comment',
			contents: '// test comment',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])
})

test('parses multi-line comments', () => {
	expect(tokenizeSqf('/* test comment */')).toEqual([
		expect.objectContaining({
			type: 'multi-line-comment',
			contents: '/* test comment */',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])

	expect(tokenizeSqf('\r\n/* test comment */\r\n')).toEqual([
		expect.objectContaining({
			type: 'multi-line-comment',
			contents: '/* test comment */',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])

	expect(tokenizeSqf('\r\n/* test \r\n comment */\r\n')).toEqual([
		expect.objectContaining({
			type: 'multi-line-comment',
			contents: '/* test \r\n comment */',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])

	expect(tokenizeSqf('\n/* test \n comment */\n')).toEqual([
		expect.objectContaining({
			type: 'multi-line-comment',
			contents: '/* test \n comment */',
		}),
		expect.objectContaining({
			contents: '',
			type: 'eof',
		}),
	])
})
