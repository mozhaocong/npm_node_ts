const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
// // 获取当前执行脚本所在的目录的路径
// console.log('__dirname:', __dirname)
// // 获取 Node.js 进程当前工作目录的路径
// console.log('process.cwd():', process.cwd())
// console.log('entry', path.resolve(process.cwd(), './src/index.ts'))
// console.log('output', path.resolve(process.cwd(), 'dist'))
const initConfig = (item) => {
	const { entry, output } = item
	return {
		mode: 'production',
		watch: true,
		target: 'node', // 设置目标为 Node.js 环境
		entry: path.resolve(process.cwd(), entry), // 入口文件路径
		output: {
			path: path.resolve(process.cwd(), output), // 输出目录
			filename: 'bundle.js' // 输出文件名
		},
		// 优化选项
		optimization: {
			// // 最小化输出
			// minimize: true,
			// 使用TerserWebpackPlugin进行代码压缩
			minimizer: [
				new TerserPlugin({
					// Terser插件的配置
				})
			],
			usedExports: true
		},
		cache: {
			type: 'filesystem' // 使用文件缓存
		},
		plugins: [],
		module: {
			rules: [
				{
					test: /\.tsx?$/, // 匹配 TypeScript 文件
					use: 'ts-loader', // 使用 ts-loader 加载器处理 TypeScript 文件
					exclude: /node_modules/ // 排除 node_modules 目录
				}
			]
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'], // 解析文件扩展名
			alias: {
				'@': path.resolve(process.cwd(), 'src') // 设置 @/ 别名为 src 目录的绝对路径
			}
		}
	}
}

module.exports = initConfig
