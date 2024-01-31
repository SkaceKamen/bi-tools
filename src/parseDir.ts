import { glob } from 'glob'
import { parse } from './parser/parser'
import fs from 'fs'
import { preprocess } from './parser/preprocessor'
import { tokenize } from './parser/tokenizer'
import { lint } from './linter/lint'

async function main() {
	const files = await glob(
		'c:/Users/menxm/Documents/Arma 3/missions/RIS.Altis/**/*.sqf'
	)

	console.time('parsing')

	let failed = 0

	for (const filePath of files) {
		try {
			const file = await fs.promises.readFile(filePath)
			const contents = file.toString()
			const preprocessed = preprocess(contents)
			const tokens = tokenize(preprocessed.code)
			const parsed = parse(tokens, preprocessed.code)
			lint(parsed, preprocessed.code)
		} catch (err) {
			console.log(filePath)
			console.error(err)
			failed++
		}
	}
	console.timeEnd('parsing')
	console.log('Processed', files.length, 'files', failed, 'failed')
}

main().catch(console.error)
