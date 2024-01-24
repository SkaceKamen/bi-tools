import fs from 'fs'
import { tokenize } from './parser/tokenizer'
import { parse } from './parser/parser'
import { stringify } from './parser/stringify'
import { preprocess } from './parser/preprocessor'
import { lint } from './linter/lint'

async function main() {
	const file = await fs.promises.readFile(process.argv[2])
	const contents = file.toString()

	const preprocessed = preprocess(contents)

	console.time('tokenize')
	const tokens = tokenize(preprocessed.code)
	console.timeEnd('tokenize')
	// await fs.promises.writeFile('tokens.json', JSON.stringify(tokens, null, 2))

	console.time('parse')
	const parsed = parse(tokens, preprocessed.code)
	console.timeEnd('parse')
	// await fs.promises.writeFile('parsed.json', JSON.stringify(parsed, null, 2))

	//console.log(stringify(parsed))

	console.log(JSON.stringify(lint(parsed, preprocessed.code), null, 2))
}

main().catch(console.error)
