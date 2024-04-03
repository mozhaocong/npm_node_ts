const { spawn } = require('child_process')
// 执行用户命令

const init = () => {
	try {
		// 定义 nodemon 配置参数
		const nodemonArgs = [
			'--watch',
			'dist', // 监听的文件
			'--ext',
			'js,json,ts', // 监听的文件扩展名
			'--exec',
			'node dist/main.js', // 执行的命令
			'--env',
			'NODE_ENV=development' // 设置环境变量为开发环境
		]

		// 启动 nodemon
		const child = spawn('nodemon', nodemonArgs, { stdio: 'inherit' })

		child.stdout.on('data', function (data) {
			console.log(data)
		})
		child.stderr.on('data', function (data) {
			console.log('stderr: ' + data)
		})
		child.on('close', function (code) {
			console.log('closing code: ' + code)
		})
		child.on('exit', function (code) {
			console.log('exit: ' + code)
		})

		child.on('SIGINT', function () {
			console.log('child SIGINT')
			child.kill()
		})

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
