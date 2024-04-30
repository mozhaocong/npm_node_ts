const path = require('path')
const { babel } = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const { nodeResolve } = require('@rollup/plugin-node-resolve') // 引入依赖包
const json = require('@rollup/plugin-json')
const rollup = require('rollup')
const fs = require('fs')
const extensions = ['.js', '.ts', '.tsx']

// const projectPath = path.join(process.cwd(), '../src/rollup/build.js')
const resolveFile = (name) => path.join(process.cwd(), name)

// console.log('path', path.join(__dirname, '../src/rollup/build.js'))
// console.log('process.cwd()', process.cwd())

const init = async (item) => {
	const { entry } = item
	const data = await new Promise((resolve) => {
		fs.access(resolveFile('./tsconfig.json'), fs.constants.F_OK, (err) => {
			if (err) {
				// console.error('文件不存在')
				resolve(false)
			} else {
				resolve(true)
			}
		})
	})

	const pluginsList = data
		? [
				typescript({
					check: false,
					tsconfig: resolveFile('./tsconfig.json'), // Local ts To configure
					extensions
				})
		  ]
		: []

	const currentPath = resolveFile(entry)
	const config = [
		{
			input: currentPath,
			plugins: [
				json(),
				...pluginsList,
				nodeResolve(),
				commonjs(),
				babel({
					babelHelpers: 'runtime',
					exclude: 'node_modules/**',
					plugins: ['@babel/plugin-transform-runtime']
				})
				// terser()
			]
		}
	]

	const bundle = await rollup.rollup({
		...config[0]
	})
	await bundle.write({
		file: path.join(process.cwd(), 'build/lib/index.js'), // 通用模块
		format: 'umd',
		name: 'htmlTool'
	})
	await bundle.write({
		file: path.join(process.cwd(), 'build/es/index.js'), // 通用模块
		format: 'es'
	})
}

module.exports = init
