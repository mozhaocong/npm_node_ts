const { Command } = require('commander')
const program = new Command()
const nodemonInit = require('../nodemon')
const nodeInit = require('../nodeNpm')
const rollupBuild = require('../rollup/build')
const webpackDevConfig = require('../webpack/dev')
const webpack = require('webpack')
// webpack 获取main执行文件
const getMainOutputFile = (stats) => {
	const allChunks = stats.compilation.chunks
	// 找到包含最多文件的Chunk
	let maxFilesChunk = null
	let maxFilesCount = 0
	allChunks.forEach((chunk) => {
		if (chunk.files.length > maxFilesCount) {
			maxFilesChunk = chunk
			maxFilesCount = chunk.files.length
		}
	})

	// 获取主执行文件名
	const mainOutputFile = maxFilesChunk.files[0]
	console.log('主执行文件名:', mainOutputFile)
	return mainOutputFile
}

const register = () => {
	program
		.command('watch')
		.description('本地编译')
		.option('--entry  <entryEnv>', ' entry', './index.js')
		.option('--output  <outputEnv>', ' output', 'dist')
		.action(async (item) => {
			console.log('watch')
			let mainFile = ''
			new Promise((resolve, reject) => {
				const data = webpackDevConfig(item)
				webpack(data, (e, stats) => {
					mainFile = getMainOutputFile(stats)
					if (e) {
						reject(false)
					} else {
						resolve(true)
					}
				})
			}).then(() => {
				nodemonInit({ env: 'development', mainFile })
			})
		})

	program
		.command('dev')
		.description('本地编译')
		.option('--entry  <entryEnv>', ' entry', './index.js')
		.option('--output  <outputEnv>', ' output', 'dist')
		.action(async (item) => {
			console.log('dev')
			let mainFile = ''
			new Promise((resolve, reject) => {
				const data = webpackDevConfig(item)
				webpack(data, (e, stats) => {
					mainFile = getMainOutputFile(stats)
					if (e) {
						reject(false)
					} else {
						resolve(true)
					}
				})
			}).then(() => {
				nodeInit({ mainFile })
			})
		})

	program
		.command('rollup')
		.description('本地打包')
		.option('--entry  <entryEnv>', ' entry', './index.js')
		.option('--output  <outputEnv>', ' output', 'build')
		.action(async (item) => {
			console.log('build')
			await rollupBuild(item)
			console.log('打包成功')
			process.exit(0)
		})

	program.parse(process.argv)

	// 对未知命令监听
	program.on('command:*', function (obj) {
		const availableCommands = program.commands.map((cmd) => cmd.name())
		console.log('availableCommands', availableCommands, obj)
	})

	if (!process.argv.slice(2).length) {
		program.outputHelp()
	}
}

module.exports = register
