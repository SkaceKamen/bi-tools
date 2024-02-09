import fs from 'fs'
import { parseBikiCode } from './biki-parser/parseBikiCode'

async function main() {
	const fileName = process.argv[2]
	const file = await fs.promises.readFile(fileName)
	const contents = file.toString()

	const parsed = parseBikiCode(contents)

	console.log(JSON.stringify(parsed, null, 2))

	/*
	await fs.promises.writeFile(
		'biki-parsed.json',
		JSON.stringify(parsed, null, 2)
	)
	*/
}

main().catch(console.error)
