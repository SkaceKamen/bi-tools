import fs from 'fs'
import { dirname } from 'path'
import { parseClass } from './class-parser/parseClass'
import { tokenizeClass } from './class-parser/tokenizeClass'
import { preprocess } from './preprocessor/preprocess'
import { getMappedOffsetAt } from './preprocessor/getMappedOffsetAt'
import { getLocationFromOffset } from './preprocessor/getLocationFromOffset'

async function main() {
	const fileName = process.argv[2]
	const file = await fs.promises.readFile(fileName)
	const contents = file.toString()

	const preprocessed = preprocess(contents, {
		includeBaseDir: dirname(fileName),
		debug: true,
	})

	await fs.promises.writeFile('preprocessed.hpp', preprocessed.code)

	const offset = getMappedOffsetAt(preprocessed.sourceMap, 4300)
	console.log({
		location: getLocationFromOffset(
			offset.offset,
			offset.file === null
				? contents
				: (await fs.promises.readFile(offset.file)).toString()
		),
		file: offset.file,
	})

	const tokens = tokenizeClass(preprocessed.code)

	await fs.promises.writeFile(
		'tokens-class.json',
		JSON.stringify(tokens, null, 2)
	)

	const parsed = parseClass(tokens, preprocessed.code, { debug: true })
	await fs.promises.writeFile(
		'parsed-class.json',
		JSON.stringify(parsed, null, 2)
	)
}

main().catch(console.error)
