import { SourceMapItem } from './preprocess'

export const getMappedOffsetAt = (
	sourceMap: SourceMapItem[],
	offset: number,
	defaultFile: string,
	startAtIndex?: number
) => {
	//sourceMap.sort((a, b) => a.offset - b.offset)

	// Note this relies on source maps being sorted by offset
	let item = null as SourceMapItem | null
	let itemIndex = null as number | null
	for (let i = startAtIndex || 0; i < sourceMap.length; i++) {
		const sourceMapItem = sourceMap[i]
		if (sourceMapItem.offset >= offset) {
			break
		}

		item = sourceMapItem
		itemIndex = i
	}

	if (!item) {
		return { file: defaultFile, offset, itemIndex }
	}

	return {
		offset: item.fileOffset + (offset - item.offset),
		file: item.file,
		itemIndex,
	}
}
