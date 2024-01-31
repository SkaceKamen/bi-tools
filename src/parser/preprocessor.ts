export const preprocess = (code: string) => {
	const lines = code.split('\n')
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i].trimStart()
		if (line.startsWith('#')) {
			// @TODO: Implement
			// const command = line.slice(1).trimStart()
			// if (command.startsWith('include')) {
			// const file = command.slice(7).trimStart()
			// const included = fs.readFileSync(file, 'utf-8')
			// lines.splice(i, 1, ...included.split('\n'))
			// }
			line = ''
			lines[i] = line
		}
	}

	return {
		code: lines.join('\n'),
		sourceMap: {},
	}
}
