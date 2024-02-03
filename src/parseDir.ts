import { glob } from 'glob'
import fs from 'fs'
import { lintSqf } from './sqf-linter/lintSqf'
import { preprocess } from './preprocessor/preprocess'
import { tokenizeSqf } from './sqf-parser/tokenizeSqf'
import { parseSqf } from './sqf-parser/parseSqf'
import path from 'path'

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
			const preprocessed = preprocess(contents, {
				includeBaseDir: path.dirname(filePath),
			})
			const tokens = tokenizeSqf(preprocessed.code)
			const parsed = parseSqf(tokens, preprocessed.code)
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
