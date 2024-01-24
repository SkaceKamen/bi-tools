import fs from 'fs'
import { tokenize } from './tokenizer'
import { parse } from './parser'
import { stringify } from './stringify'

async function main() {
	const file = await fs.promises.readFile('./tests/push.sqf')
	const contents = file.toString()
	const tokens = tokenize(contents)
	await fs.promises.writeFile('tokens.json', JSON.stringify(tokens, null, 2))

	const parsed = parse(tokens, contents)
	await fs.promises.writeFile('parsed.json', JSON.stringify(parsed, null, 2))

	console.log(stringify(parsed))
}

main().catch(console.error)
