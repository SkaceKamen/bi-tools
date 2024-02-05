import fs from 'fs'
import { tokenizeEnforceScript } from './enforce-script-parser/tokenizeEnforceScript'
import { preprocess } from './preprocessor/preprocess'

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
