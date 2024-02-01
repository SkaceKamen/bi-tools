import fs from 'fs'
import { tokenize } from './parser/tokenizer'
import { parse } from './parser/parser'
import { stringify } from './parser/stringify'
import { preprocess } from './parser/preprocessor'
import { lint } from './linter/lint'
import { analyze } from './analyzer/analyze'

async function main() {
	const file = await fs.promises.readFile(process.argv[2])
	const contents = file.toString()

	const preprocessed = preprocess(contents)

	await fs.promises.writeFile('processed.sqf', preprocessed.code)

	console.time('tokenize')
	const tokens = tokenize(preprocessed.code)
	console.timeEnd('tokenize')
	await fs.promises.writeFile('tokens.json', JSON.stringify(tokens, null, 2))

	console.time('parse')
	const parsed = parse(tokens, preprocessed.code, { debug: false })
	console.timeEnd('parse')
	await fs.promises.writeFile('parsed.json', JSON.stringify(parsed, null, 2))

	console.time('lint')
	const linerIssues = lint(parsed, preprocessed.code)
	//console.log(stringify(parsed))
	console.timeEnd('lint')

	console.log(JSON.stringify(linerIssues.slice(0, 5), null, 2))

	console.log(
		JSON.stringify(
			Object.fromEntries(analyze(parsed).variables.entries()),
			null,
			2
		)
	)
}

main().catch(console.error)
