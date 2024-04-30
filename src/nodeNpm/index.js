const { spawn } = require('child_process')
// 执行用户命令

const init = async (item) => {
	const { mainFile = 'main.js' } = item
	try {
		// 定义 nodemon 配置参数
		const npmArgs = [
			`dist/${mainFile}` // 执行的命令
		]

		console.log('启动 npm')
		// 启动 nodemon
		const child = spawn('node', npmArgs, { stdio: 'inherit' })
		child.on('close', (code) => {
			console.log(`子进程退出，退出码: ${code}`)
			process.exit(0)
		})

		// child.stdout.on('data', function (data) {
		// 	console.log(data)
		// })
		// child.stderr.on('data', function (data) {
		// 	console.log('stderr: ' + data)
		// })
		// child.on('close', function (code) {
		// 	console.log('closing code: ' + code)
		// })
		// child.on('exit', function (code) {
		// 	console.log('exit: ' + code)
		// })
		// child.on('SIGINT', function () {
		// 	console.log('child SIGINT')
		// 	child.kill()
		// })

		// 在主线程退出时，取消所有子进程
		process.on('exit', (code) => {
			child.kill()
			console.log(`Node.js process is about to exit with code ${code}`)
			// 在这里执行任何必要的清理操作
		})
		// 监听 SIGINT 事件（例如通过 Ctrl+C 发送的中断信号）
		process.on('SIGINT', () => {
			console.log('Received SIGINT signal. Exiting...')
			child.kill()
			// 在这里执行清理操作或者关闭服务器
			process.exit(0)
		})

		// 监听 SIGTERM 事件（例如系统发送的终止信号）
		process.on('SIGTERM', () => {
			console.log('Received SIGTERM signal. Exiting...')
			child.kill()
			// 在这里执行清理操作或者关闭服务器
			process.exit(0)
		})
	} catch (error) {
		console.error(`Error executing command: ${error.message}`)
	}
}

module.exports = init
