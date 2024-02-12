import * as fs from 'fs'

export type Reader = Awaited<ReturnType<typeof createReader>>

export const createReader = async (filename: string) => {
	const handler = await fs.promises.open(filename, 'r')
	let position = 0

	return {
		async tryRead(length: number) {
			const buffer = Buffer.alloc(length)
			const read = await handler.read({ buffer, length, position })
			if (read.bytesRead !== length) {
				return null
			}

			position += length

			return buffer
		},

		async read(length: number) {
			const buffer = Buffer.alloc(length)
			const read = await handler.read({ buffer, length, position })
			if (read.bytesRead !== length) {
				throw new Error('Unexpected end of file')
			}

			position += length

			return buffer
		},

		async readCString() {
			let result = ''
			while (true) {
				const char = await this.read(1)
				if (char[0] === 0) {
					break
				}

				result += char.toString('ascii')
			}

			return result
		},

		async readUint32LE() {
			const buffer = await this.read(4)
			return buffer.readUInt32LE()
		},

		get position() {
			return position
		},

		advance(advance: number) {
			position += advance
		},

		seek(newPosition: number) {
			position = newPosition
		},

		async close() {
			await handler.close()
		},
	}
}
