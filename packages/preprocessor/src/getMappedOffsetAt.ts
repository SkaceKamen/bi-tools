import { SourceMapItem } from './preprocess'

// TODO: Seems like this is not reliable
export const getMappedOffsetAt = (
	sourceMap: SourceMapItem[],
	offset: number,
	defaultFile: string,
	startAtIndex?: number
) => {
	/*
	TODO: There is a bug in this:
	// Skip if the offset is out of range
	const lastItem = sourceMap[sourceMap.length - 1]
	if (!lastItem) {
		return { file: defaultFile, offset, itemIndex: null }
	}

	if (offset > lastItem.offset) {
		return {
			offset: lastItem.fileOffset + (offset - lastItem.offset),
			file: lastItem.file,
			itemIndex: sourceMap.length - 1,
		}
	}

	let left = startAtIndex ?? 0
	let right = sourceMap.length - 1
	let mid = 0
	while (left <= right) {
		mid = Math.floor((left + right) / 2)
		if (sourceMap[mid].offset > offset) {
			right = mid - 1
		} else if (sourceMap[mid].offset < offset) {
			left = mid + 1
		} else {
			break
		}
	}

	if (mid < 1) {
		return { file: defaultFile, offset, itemIndex: null }
	}

	const item = sourceMap[mid - 1]
	const itemIndex = mid - 1
	*/

	const lastItemIndex = sourceMap.findIndex((item) => item.offset > offset)
	const itemIndex =
		sourceMap.length > 0 && lastItemIndex < 0
			? sourceMap.length - 1
			: lastItemIndex - 1
	const item = sourceMap[itemIndex]

	if (!item) {
		return { file: defaultFile, offset, itemIndex: null }
	}

	return {
		offset: item.fileOffset + (offset - item.offset),
		file: item.file,
		itemIndex: (startAtIndex ?? 0) + itemIndex,
	}
}
