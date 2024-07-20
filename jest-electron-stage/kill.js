
const { exec } = require('child_process');

module.exports = () => {
	return new  Promise((resolve, reject) => {
		exec('pkill -f "Google Chrome for Testing"', (error, stdout, stderr) => {
			if (error) {
				console.error(`执行错误: ${error}`);
				resolve(error)
				return;
			}
			console.log('应用进程已被终止:', stdout);
			resolve(stdout)
		});
	})

}
