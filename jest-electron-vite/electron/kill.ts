
const { exec } = require('child_process');

export default () => {
	exec('pkill -f "Google Chrome for Testing"', (error, stdout, stderr) => {
		if (error) {
			console.error(`执行错误: ${error}`);
			return;
		}
		console.log('应用进程已被终止');
	});
}
