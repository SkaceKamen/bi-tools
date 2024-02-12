import { readHeaders } from './readHeaders'
import { createReader } from './createReader'

export const createPboReader = async (filename: string) => {
	const stream = await createReader(filename)

	const { headers, properties, dataStart } = await readHeaders(stream)

	// Checksum is at the end of the file
	stream.seek(
		dataStart + headers.reduce((acc, header) => acc + header.size, 0) + 1
	)
	const checksum = await stream.read(20)
	stream.advance(1)

	// If there's data after checksum we did something wrong or the file is corrupted
	const testRead = await stream.tryRead(1)
	if (testRead) {
		throw new Error('Unexpected data after checksum')
	}

	return {
		get properties() {
			return properties
		},

		get checksum() {
			return checksum
		},

		get files() {
			return headers
		},

		async close() {
			await stream.close()
		},

		async readFile(filename: string) {
			const header = headers.findIndex((h) => h.filename === filename)
			if (header < 0) {
				for (const header of headers) {
					console.log(header.filename)
				}
				throw new Error('File not found')
			}

			stream.seek(
				dataStart +
					headers.slice(0, header - 1).reduce((acc, h) => acc + h.size, 0)
			)

			return stream.read(headers[header].size)
		},
	}
}
