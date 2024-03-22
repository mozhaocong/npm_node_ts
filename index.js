#!/usr/bin/env node

const { exec } = require('child_process')

// 解析用户传递的命令
const userCommand = process.argv.slice(2).join(' ')
// 执行用户命令
try {
	const data = `ts-node-dev --respawn --transpile-only --prefer-ts-exts -r tsconfig-paths/register ${userCommand}`
	const child = exec(data)

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
