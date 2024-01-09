
function isObject(obj) {
	var type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
}
function getMutliLevelProperty(ctx, path, defaultVal) {
	let res = defaultVal;
	if (!(typeof path === 'string') || !isObject(ctx)) return res;
	let key = path.replace(/\[(\w+)\]/g, '.$1');
	key = key.replace(/^\./, '');
	const arr = key.split('.');
	for (let i = 0, count = arr.length; i < count; i++) {
		const p = arr[i];
		if ((isObject(ctx) || Array.isArray(ctx)) && p in ctx) {
			ctx = ctx[p];
		} else {
			return res;
		}
	}
	res = ctx;
	return res;
}


function tryJsonPaseByStr(strJson, def) {
  try {
    const result = JSON.parse(strJson)
    return result
  } catch (error) {
    console.log(error)
  }
  return def
}


export {
	getMutliLevelProperty,
  tryJsonPaseByStr
}