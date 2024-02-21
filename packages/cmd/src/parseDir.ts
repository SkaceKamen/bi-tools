import { preprocess } from '@bi-tools/preprocessor'
import { lintSqf } from '@bi-tools/sqf-linter'
import { parseSqfTokens, tokenizeSqf } from '@bi-tools/sqf-parser'
import fs from 'fs'
import { glob } from 'glob'

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
			const preprocessed = await preprocess(contents, {
				filename: filePath,
			})
			const tokens = tokenizeSqf(preprocessed.code)
			const parsed = parseSqfTokens(tokens)
			const lintIssues = lintSqf({
				root: parsed.script,
				code: preprocessed.code,
				tokens,
			})

			if (lintIssues.length > 0) {
				console.log(filePath)
				for (const issue of lintIssues) {
					console.log('   ', issue.message, '(' + issue.rule + ')')
					console.log('')
				}
			}
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
