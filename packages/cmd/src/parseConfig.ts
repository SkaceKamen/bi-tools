import {
	tokenizeConfig,
	parseConfig,
	ConfigParserError,
} from '@bi-tools/config-parser'
import {
	preprocess,
	getMappedOffsetAt,
	getLocationFromOffset,
} from '@bi-tools/preprocessor'
import fs from 'fs'

async function main() {
	const fileName = process.argv[2]
	const file = await fs.promises.readFile(fileName)
	const contents = file.toString()

	const preprocessed = preprocess(contents, {
		filename: fileName,
		debug: true,
	})

	await fs.promises.writeFile('preprocessed.hpp', preprocessed.code)

	console.log(preprocessed.sourceMap)

	const offset = getMappedOffsetAt(preprocessed.sourceMap, 4680, fileName)
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

	const tokens = tokenizeConfig(preprocessed.code)

	await fs.promises.writeFile(
		'tokens-class.json',
		JSON.stringify(tokens, null, 2)
	)

	try {
		const parsed = parseConfig(tokens, preprocessed.code, { debug: true })
		await fs.promises.writeFile(
			'parsed-class.json',
			JSON.stringify(parsed, null, 2)
		)
	} catch (err) {
		if (err instanceof ConfigParserError) {
			const mappedOffset = getMappedOffsetAt(
				preprocessed.sourceMap,
				err.token.position.from,
				fileName
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
