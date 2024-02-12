import { Reader } from './createReader'
import { Header, HeaderMime } from './types'

export const readHeaders = async (stream: Reader) => {
	const headers = [] as Header[]
	const properties = {} as Record<string, string>

	while (true) {
		const header = {
			filename: await stream.readCString(),
			mime: await stream.readUint32LE(),
			original: await stream.readUint32LE(),
			reserved: await stream.readUint32LE(),
			timestamp: await stream.readUint32LE(),
			size: await stream.readUint32LE(),
		}

		if (header.mime !== HeaderMime.Vers && header.filename.length === 0) {
			break
		}

		if (header.mime === HeaderMime.Vers) {
			while (true) {
				const key = await stream.readCString()
				if (key.length === 0) {
					break
				}

				const value = await stream.readCString()
				properties[key] = value
			}
		}

		headers.push(header)
	}

	return { headers, properties, dataStart: stream.position }
}
