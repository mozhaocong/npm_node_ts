const { Command } = require('commander')
const program = new Command()
const init = require('../nodemon')
const webpackConfig = require('../../webpack.config')
const webpack = require('webpack')

const register = () => {
	program
		.command('dev')
		.description('本地编译')
		.option('--entry  <entryEnv>', ' entry', './index.js')
		.option('--output  <outputEnv>', ' output', 'dist')
		.action(async (item) => {
			await new Promise((resolve) => {
				const data = webpackConfig(item)
				webpack(data, (e) => {
					resolve(true)
				})
			})
			init()
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
