import fs from 'fs'
import { preprocess } from '@bi-tools/preprocessor'
import { parseSqfTokens, tokenizeSqf } from '@bi-tools/sqf-parser'
import { lintSqf } from '@bi-tools/sqf-linter'
import { analyzeSqf } from '@bi-tools/sqf-analyzer'
import path from 'path'

async function main() {
	const file = await fs.promises.readFile(process.argv[2])
	const contents = file.toString()

	const preprocessed = await preprocess(contents, {
		filename: process.argv[2],
		async resolveFn(includeParam, sourceFilename) {
			try {
				return {
					contents: await fs.promises.readFile(
						path.join(path.dirname(sourceFilename), includeParam),
						'utf-8'
					),
					filename: path.join(path.dirname(sourceFilename), includeParam),
				}
			} catch (err) {
				console.error('failed to load included file', err)
				return { contents: '', filename: '' }
			}
		},
	})

	await fs.promises.writeFile('processed.sqf', preprocessed.code)

	console.time('tokenize')
	const tokens = tokenizeSqf(preprocessed.code)
	console.timeEnd('tokenize')
	await fs.promises.writeFile('tokens.json', JSON.stringify(tokens, null, 2))

	console.time('parse')
	const parsed = parseSqfTokens(tokens, { debug: false })
	console.timeEnd('parse')
	await fs.promises.writeFile('parsed.json', JSON.stringify(parsed, null, 2))

	console.log(JSON.stringify(parsed.errors, null, 2))

	console.time('lint')
	const linerIssues = lintSqf({
		root: parsed.script,
		code: preprocessed.code,
		tokens,
	})
	//console.log(stringify(parsed))
	console.timeEnd('lint')

	/*
	console.log(JSON.stringify(linerIssues.slice(0, 5), null, 2))

	console.log(
		JSON.stringify(
			Object.fromEntries(
				analyzeSqf(parsed.script, tokens, preprocessed.code).variables.entries()
			),
			null,
			2
		)
	)
	*/
}

main().catch(console.error)
