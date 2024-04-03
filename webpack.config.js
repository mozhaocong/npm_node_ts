const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const os = require('os')
// // 获取当前执行脚本所在的目录的路径
// console.log('__dirname:', __dirname)
// // 获取 Node.js 进程当前工作目录的路径
// console.log('process.cwd():', process.cwd())
// console.log('entry', path.resolve(process.cwd(), './src/index.ts'))
// console.log('output', path.resolve(process.cwd(), 'dist'))
const threads = os.cpus().length
const initConfig = (item) => {
	const { entry, output } = item
	return {
		mode: 'development',
		watch: true,
		target: 'node', // 设置目标为 Node.js 环境
		entry: path.resolve(process.cwd(), entry), // 入口文件路径
		output: {
			path: path.resolve(process.cwd(), output), // 输出目录
			// filename: 'bundle.js' // 输出文件名
			filename: '[name].js',
			chunkFilename: '[name].[contenthash].js'
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

			// 分割代码
			splitChunks: {
				chunks: 'all', // 对同步和异步加载的chunks都进行分割
				minSize: 30000, // 最小尺寸，默认0
				maxSize: 0, // 最大尺寸，默认Infinity
				minChunks: 1, // 最小chunk数，默认1
				// maxAsyncRequests: 30, // 按需加载时的最大并行请求数，默认30
				// maxInitialRequests: 30, // 入口点依赖的最大并行请求数，默认30
				// automaticNameDelimiter: '&#126;', // 当生成名称太长时，使用的分隔符
				cacheGroups: {
					// 可以定义一些特定的分割规则
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						name(module) {
							// 获取模块名。对于node_modules中的模块，使用其名称作为chunk名称
							return 'vendors'
						}
					},
					defaultVendors: {
						minChunks: 2,
						priority: -10,
						reuseExistingChunk: true
					}
				}
			},
			// // 运行时块分离
			// runtimeChunk: {
			// 	name: 'runtime' // 运行时块的文件名
			// },
			//
			// // 模块ID优化
			// moduleIds: 'hashed', // 使用哈希值作为模块ID
			//
			// 用于存储已生成的资源的缓存
			usedExports: true
			//
			// // 提供Webpack的sideEffects标志
			// sideEffects: true,
			//
			// // 标记那些没有使用到的export
			// providedExports: true,
			//
			// // 标记那些export被其他模块使用
			// consumeSideEffects: true
		},
		cache: {
			type: 'filesystem' // 使用文件缓存
		},
		plugins: [
			{
				apply: (compiler) => {
					compiler.hooks.done.tap('AfterEmitPlugin', (stats) => {
						console.log('stats AfterEmitPlugin')
						// setTimeout(() => {
						// 	const data = path.resolve(process.cwd(), './dist/bundle.js')
						// 	exec(`node ${data}`)
						// 	console.log('AfterEmitPlugin AfterEmitPlugin AfterEmitPlugin')
						// }, 1000)
						// 在每次构建完成后执行 shell 脚本
						// exec('sh watch.sh', (err, stdout, stderr) => {
						// 	if (err) {
						// 		console.error(err)
						// 		return
						// 	}
						// 	console.log(stdout)
						// })
					})
				}
			}
		],
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
