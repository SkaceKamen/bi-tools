import { createPboReader } from '@bi-tools/pbo-reader'

async function main() {
	const file = await createPboReader(process.argv[2])

	for (const item of file.files) {
		if (
			item.filename.endsWith('.inc') ||
			item.filename.endsWith('.hpp') ||
			item.filename.endsWith('.inc.sqf')
		) {
			console.log(item.filename)
		}
	}
}

main().catch(console.error)
