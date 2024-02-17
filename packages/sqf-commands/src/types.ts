export type WikiDocumentation = {
	title: string
	type: 'function' | 'command'
	source: 'core' | 'ace3' | 'cba'
	description?: string
	syntaxes: WikiDocumentationSignature[]
	compatibility?: { game: string; version: string }[]
}

type WikiDocumentationSignatureArgument = {
	name: string
	type?: string
	desc?: string
	since?: string
	default?: string
	optional?: boolean
	position?: 'left' | 'right'
}

export type WikiDocumentationSignature = {
	code: string
	args: WikiDocumentationSignatureArgument[]
	returns?: {
		type?: string
		desc?: string
	}
	since?: string
}
