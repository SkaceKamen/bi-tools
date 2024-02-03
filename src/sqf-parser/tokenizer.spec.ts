import { test, expect } from 'vitest'
import { tokenizeSqf } from './tokenizeSqf'

test('parses strings', () => {
	expect(tokenizeSqf("'test'")).toEqual([
		{
			type: 'string',
			contents: "'test'",
			position: {
				from: 0,
				to: 5,
			},
		},
		{
			contents: '',
			type: 'eof',
			position: { from: 6, to: 6 },
		},
	])

	expect(tokenizeSqf('"test"')).toEqual([
		{
			type: 'string',
			contents: '"test"',
			position: {
				from: 0,
				to: 5,
			},
		},
		{
			contents: '',
			type: 'eof',
			position: { from: 6, to: 6 },
		},
	])
})

test('parses strings with escapes', () => {
	expect(tokenizeSqf('"te""st"')).toEqual([
		{
			type: 'string',
			contents: '"te""st"',
			position: {
				from: 0,
				to: 7,
			},
		},
		{
			contents: '',
			type: 'eof',
			position: { from: 8, to: 8 },
		},
	])
	expect(tokenizeSqf("'te''st'")).toEqual([
		{
			type: 'string',
			contents: "'te''st'",
			position: {
				from: 0,
				to: 7,
			},
		},
		{
			contents: '',
			type: 'eof',
			position: { from: 8, to: 8 },
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
})
