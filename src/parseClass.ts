import fs from 'fs'
import { dirname } from 'path'
import { ClassParserError, parseClass } from './class-parser/parseClass'
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
		debug: false,
	})

	await fs.promises.writeFile('preprocessed.hpp', preprocessed.code)

	console.log(preprocessed.sourceMap)

	/*
	TEST:
	const offset = getMappedOffsetAt(preprocessed.sourceMap, 4561)
	console.log({
		offset: offset.offset,
		location: getLocationFromOffset(
			offset.offset,
			offset.file === null
				? contents
				: (await fs.promises.readFile(offset.file)).toString()
		),
		file: offset.file,
	})
	*/

	const tokens = tokenizeClass(preprocessed.code)

	await fs.promises.writeFile(
		'tokens-class.json',
		JSON.stringify(tokens, null, 2)
	)

	try {
		const parsed = parseClass(tokens, preprocessed.code, { debug: true })
		await fs.promises.writeFile(
			'parsed-class.json',
			JSON.stringify(parsed, null, 2)
		)
	} catch (err) {
		if (err instanceof ClassParserError) {
			const mappedOffset = getMappedOffsetAt(
				preprocessed.sourceMap,
				err.token.position.from
			)

			const actualLocation = getLocationFromOffset(
				mappedOffset.offset,
				mappedOffset.file === null
					? contents
					: (await fs.promises.readFile(mappedOffset.file)).toString()
			)

			const filePath = mappedOffset.file ?? fileName

			console.error(
				`Error at ${filePath}:${actualLocation.line}:${actualLocation.column}: ${err.message} (at ${err.token.type} "${err.token.contents}")`
			)
		}

		throw err
	}
}

main().catch(console.error)
