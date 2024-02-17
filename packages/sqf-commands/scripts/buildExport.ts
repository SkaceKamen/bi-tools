import { parseBikiExport } from './lib/parseBikiExport'
import fs from 'fs'

async function buildExports() {
	const operatorsContents = await fs.promises.readFile(
		'exports/operatorsExport.xml',
		'utf-8'
	)

	const commands = parseBikiExport(operatorsContents, 'command', {})

	await fs.promises.writeFile('exports/commands.json', JSON.stringify(commands))

	const functionsContents = await fs.promises.readFile(
		'exports/functionsExport.xml',
		'utf-8'
	)

	const functions = parseBikiExport(functionsContents, 'function')

	await fs.promises.writeFile(
		'exports/functions.json',
		JSON.stringify(functions)
	)
}

buildExports().catch((err) => {
	console.error(err)
	process.exit(1)
})
