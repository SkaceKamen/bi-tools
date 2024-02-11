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
			const lintIssues = lintSqf(parsed, preprocessed.code)

			if (lintIssues.length > 0) {
				console.log(filePath)
				for (const issue of lintIssues) {
					const line = contents.split('\n')[issue.position.startLine - 1]
					const prefix = String(issue.position.startLine).padEnd(4, ' ') + '|'
					const tabs =
						line.slice(0, issue.position.startOffset).split('\t').length - 1

					console.log(prefix, line.split('\t').join('  '))

					console.log(
						' '.repeat(5) +
							' '.repeat(issue.position.startOffset - tabs + tabs * 2) +
							'^'.repeat(issue.position.end - issue.position.start)
					)
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
