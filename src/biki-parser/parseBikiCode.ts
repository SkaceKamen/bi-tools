import Parser from 'wikiparser-node'
import { bikiConfig } from './bikiConfig'

const SYNTAX_MATCH = /^s([1-9][0-9]*)$/
const PARAM_MATCH = /^p([1-9][0-9]*)$/
const RETURNS_MATCH = /^r([1-9][0-9]*)$/
const PARAM_DESC_PATTERN1 = /^(\w+): (\w+) - (.+)$/
const PARAM_DESC_PATTERN2 = /^(\w+): (\w+)$/
const RETURNS_DESC_PATTERN1 = /^(\w+) - (.+)$/
const RETURNS_DESC_PATTERN2 = /^(\w+)$/
const PARAM_OPTIONAL_PATTERN = /^\s*\(\s*optional/i

const innerText = (node: Parser.Token | Parser.AstText | undefined): string => {
	if (node?.type === undefined) {
		return node?.data ?? ''
	}

	if (node?.type === 'text') {
		return node?.data ?? ''
	}

	if (node?.type === 'link') {
		const target = node.childNodes.find((node) => node.type === 'link-target')
		const text = node.childNodes.find((node) => node.type === 'link-text')

		if (text) {
			return innerText(text)
		}

		if (target) {
			return innerText(target)
		}

		return node.childNodes.map((node) => innerText(node)).join('')
	}

	if (node?.type === 'quote') {
		return ''
	}

	if (node?.type === 'template') {
		return ''
	}

	return node?.childNodes?.map((node) => innerText(node)).join('') ?? ''
}

export const parseBikiCode = (code: string) => {
	const data = Parser.parse(code, undefined, undefined, bikiConfig)

	let description = undefined as string | undefined

	const syntaxes = {} as Record<
		number,
		{
			code: string
			since?: string
			args: Record<
				number,
				{
					name: string
					type?: string
					desc?: string
					optional?: boolean
					since?: string
				}
			>
			returns?: {
				type?: string
				desc?: string
			}
		}
	>

	const getSyntax = (index: number) => {
		if (!syntaxes[index]) {
			syntaxes[index] = {
				code: '',
				args: {},
			}
		}

		return syntaxes[index]
	}

	for (const node of data.childNodes ?? []) {
		if (node.type === 'template' && node.name === 'Template:RV') {
			console.log('Parsing RV template')
			for (const child of node.childNodes ?? []) {
				if (child.type === 'parameter') {
					if (child.name === 'descr') {
						description = innerText(child.childNodes?.[1]).trim()
						continue
					}

					const syntaxMatch = SYNTAX_MATCH.exec(child.name ?? '')
					const paramMatch = !syntaxMatch && PARAM_MATCH.exec(child.name ?? '')
					const returnsMatch =
						!syntaxMatch && !paramMatch && RETURNS_MATCH.exec(child.name ?? '')

					if (syntaxMatch) {
						const syntax = getSyntax(+syntaxMatch[1])
						syntax.code = innerText(child.childNodes?.[1]).trim() ?? ''
					} else if (paramMatch) {
						const index = parseInt(paramMatch[1])
						const syntaxIndex = 1 + Math.floor((index - 1) / 20)
						const paramIndex = (index - 1) % 20
						const text = innerText(child.childNodes?.[1]).trim() ?? ''

						let name = text
						let type = undefined as string | undefined
						let description = undefined as string | undefined
						let optional = undefined as boolean | undefined

						const firstPatternMatch = PARAM_DESC_PATTERN1.exec(text)
						const secondPatternMatch =
							!firstPatternMatch && PARAM_DESC_PATTERN2.exec(text)
						if (firstPatternMatch) {
							name = firstPatternMatch[1]
							type = firstPatternMatch[2]
							description = firstPatternMatch[3]
						} else if (secondPatternMatch) {
							name = secondPatternMatch[1]
							type = secondPatternMatch[2]
						}

						if (description) {
							const optionalMatch = PARAM_OPTIONAL_PATTERN.exec(description)
							if (optionalMatch) {
								optional = true
							}
						}

						const syntax = getSyntax(syntaxIndex)
						syntax.args[paramIndex] = {
							name,
							type,
							desc: description?.trim(),
							optional,
						}
					} else if (returnsMatch) {
						const syntax = getSyntax(+returnsMatch[1])
						const text = innerText(child.childNodes?.[1]).trim() ?? ''

						let type = undefined as string | undefined
						let description = undefined as string | undefined

						const firstPatternMatch = RETURNS_DESC_PATTERN1.exec(text)
						const secondPatternMatch =
							!firstPatternMatch && RETURNS_DESC_PATTERN2.exec(text)

						if (firstPatternMatch) {
							type = firstPatternMatch[1]
							description = firstPatternMatch[2]
						} else if (secondPatternMatch) {
							type = secondPatternMatch[1]
						}

						syntax.returns = {
							type,
							desc: description,
						}
					}
				}
			}
		}
	}

	return {
		description,
		syntaxes: Object.values(syntaxes).map((s) => ({
			...s,
			args: Object.values(s.args),
		})),
	}
}
