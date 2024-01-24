module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
	],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		indent: 'off',
		curly: ['warn', 'all'],
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/explicit-member-accessibility': [
			'warn',
			{ accessibility: 'no-public' },
		],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/member-delimiter-style': [
			'warn',
			{ multiline: { delimiter: 'none' } },
		],
		'@typescript-eslint/no-object-literal-type-assertion': 'off',
		'@typescript-eslint/prefer-interface': 'off',
		'prettier/prettier': 'warn',
		// This assertion is used a lot in the original code, lets disable it
		'@typescript-eslint/no-non-null-assertion': 'off',
		eqeqeq: ['warn', 'always'],
		'react-hooks/rules-of-hooks': 'warn',
		'react-hooks/exhaustive-deps': 'warn',
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
}
