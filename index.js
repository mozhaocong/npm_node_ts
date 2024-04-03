#!/usr/bin/env node

const register = require('./src/commander')

try {
	register()
} catch (e) {
	console.log('e', e)
}
