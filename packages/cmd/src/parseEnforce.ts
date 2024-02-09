import { tokenizeEnforceScript } from '@bi-tools/enforce-script-parser'
import { preprocess } from '@bi-tools/preprocessor'
import fs from 'fs'

async function main() {
	const fileName = process.argv[2]
	const file = await fs.promises.readFile(fileName)
	const contents = file.toString()

	const preprocessed = preprocess(contents, {
		filename: fileName,
		debug: true,
	})

	await fs.promises.writeFile('preprocessed-enforce.c', preprocessed.code)

	console.log(preprocessed.sourceMap)

	const tokens = tokenizeEnforceScript(preprocessed.code)

	await fs.promises.writeFile(
		'tokens-enforce.json',
		JSON.stringify(tokens, null, 2)
	)
}

main().catch(console.error)
