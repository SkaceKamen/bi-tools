import { SourceMapItem } from './preprocess'

export const getMappedOffsetAt = (
	sourceMap: SourceMapItem[],
	offset: number,
	defaultFile: string
) => {
	//sourceMap.sort((a, b) => a.offset - b.offset)

	// Note this relies on source maps being sorted by offset
	let item = null
	for (const sourceMapItem of sourceMap) {
		if (sourceMapItem.offset >= offset) {
			break
		}

		item = sourceMapItem
	}

	if (!item) {
		return { file: defaultFile, offset }
	}

	return { offset: item.fileOffset + (offset - item.offset), file: item.file }
}
