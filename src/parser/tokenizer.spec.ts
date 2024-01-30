import { test, expect } from 'vitest'
import { tokenize } from './tokenizer'

test('parses strings', () => {
	expect(tokenize("'test'")).toEqual([
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

	expect(tokenize('"test"')).toEqual([
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
	expect(tokenize('"te""st"')).toEqual([
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
	expect(tokenize("'te''st'")).toEqual([
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
