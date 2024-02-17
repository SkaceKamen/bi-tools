import { LintIssue } from './types'

export type Fixer = ReturnType<typeof createFixer>

export const createFixer = (sourceCode: string) => {
	const fixes = [] as (
		| {
				type: 'insert'
				position: number
				text: string
		  }
		| { type: 'remove'; range: [start: number, end: number] }
		| { type: 'replace'; range: [start: number, end: number]; text: string }
	)[]

	const fixStart = (f: (typeof fixes)[number]) => {
		switch (f.type) {
			case 'insert':
				return f.position
			case 'remove':
				return f.range[0]
			case 'replace':
				return f.range[0]
		}
	}

	return {
		sourceCode,
		insert: (position: number, text: string) => {
			fixes.push({ position, text, type: 'insert' })
		},
		remove: (start: number, end: number) => {
			fixes.push({ range: [start, end], type: 'remove' })
		},
		replace: (start: number, end: number, text: string) => {
			fixes.push({ range: [start, end], text, type: 'replace' })
		},
		apply(issues: LintIssue[]) {
			// TODO: This is not tested yet
			for (const issue of issues) {
				if (!issue.fix) {
					continue
				}

				issue.fix(this)
			}

			fixes.sort((a, b) => fixStart(a) - fixStart(b))

			let output = ''
			let lastPos = 0

			for (const fix of fixes) {
				output += sourceCode.slice(lastPos, fixStart(fix))

				switch (fix.type) {
					case 'insert':
						output += fix.text
						lastPos = fix.position
						break
					case 'remove':
						lastPos = fix.range[1]
						break
					case 'replace':
						output += fix.text
						lastPos = fix.range[1]
						break
				}
			}

			return output + sourceCode.slice(lastPos)
		},
	}
}
