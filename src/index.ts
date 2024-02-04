import fs from 'fs'
import { lintSqf } from './sqf-linter/lintSqf'
import { analyze } from './sqf-analyzer/analyzeSqf'
import { tokenizeSqf } from './sqf-parser/tokenizeSqf'
import { preprocess } from './preprocessor/preprocess'
import { parseSqf } from './sqf-parser/parseSqf'

async function main() {
	const file = await fs.promises.readFile(process.argv[2])
	const contents = file.toString()

	const preprocessed = preprocess(contents, {
		filename: process.argv[2],
	})

	await fs.promises.writeFile('processed.sqf', preprocessed.code)

	console.time('tokenize')
	const tokens = tokenizeSqf(preprocessed.code)
	console.timeEnd('tokenize')
	await fs.promises.writeFile('tokens.json', JSON.stringify(tokens, null, 2))

	console.time('parse')
	const parsed = parseSqf(tokens, preprocessed.code, { debug: false })
	console.timeEnd('parse')
	await fs.promises.writeFile('parsed.json', JSON.stringify(parsed, null, 2))

	console.time('lint')
	const linerIssues = lintSqf(parsed, preprocessed.code)
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
