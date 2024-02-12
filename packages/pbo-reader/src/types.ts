export type Header = {
	filename: string
	mime: HeaderMime
	original: number
	reserved: number
	timestamp: number
	size: number
}

export enum HeaderMime {
	Vers = 0x5665_7273,
	Cprs = 0x4370_7273,
	Enco = 0x456e_6372,
	Blank = 0x0000_0000,
}
