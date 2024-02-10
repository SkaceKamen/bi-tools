import { preprocess } from '@bi-tools/preprocessor'
import fs from 'fs'

async function main() {
	const file = await fs.promises.readFile(process.argv[2])
	const contents = file.toString()

	const preprocessed = await preprocess(contents, {
		filename: process.argv[2],
		async resolveFn() {
			return { contents: '', filename: '' }
		},
	})

	console.log(preprocessed.sourceMap)
	console.log(preprocessed.code)
}

main().catch(console.error)
