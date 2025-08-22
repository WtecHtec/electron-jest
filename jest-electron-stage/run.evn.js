class RunEnv {
  constructor() {
    this.child = null
    this.pickDatas  = []
    this.current = {}
  }
  createChild() {
    this.child = new RunEnv()
    return this.child
  } 
  set(key, value) {
    this.current[key] = value
  }
  get(key) {
    return this.current[key]
  }
  pickData(value) {
    this.pickDatas.push(value)
  }
  getPickData() {
    return this.pickDatas
  }
  
    // 通用序列化方法
  toSerializable() {
    return this.makeSerializable(this)
  }
  
  // 通用序列化处理函数
  makeSerializable(obj, visited = new WeakSet()) {
    // 防止循环引用
    if (obj && typeof obj === 'object' && visited.has(obj)) {
      return '[Circular Reference]'
    }
    
    if (obj && typeof obj === 'object') {
      visited.add(obj)
    }
    
    // 处理不同类型
    if (obj === null || obj === undefined) {
      return obj
    }
    
    if (typeof obj === 'function') {
      return {
        __type: 'function',
        name: obj.name || 'anonymous',
        toString: obj.toString().substring(0, 100) + '...'
      }
    }
    
    if (obj instanceof Date) {
      return {
        __type: 'Date',
        value: obj.toISOString()
      }
    }
    
    if (obj instanceof RegExp) {
      return {
        __type: 'RegExp',
        source: obj.source,
        flags: obj.flags
      }
    }
    
    if (obj instanceof Error) {
      return {
        __type: 'Error',
        name: obj.name,
        message: obj.message,
        stack: obj.stack
      }
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.makeSerializable(item, visited))
    }
    
    if (typeof obj === 'object') {
      // 处理特殊对象类型
      const constructor = obj.constructor
      if (constructor && constructor.name !== 'Object') {
        // 自定义类实例
        const result = {
          __type: constructor.name,
          __className: constructor.name
        }
        
        // 复制可序列化的属性
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            try {
              result[key] = this.makeSerializable(obj[key], visited)
            } catch (error) {
              result[key] = `[Serialization Error: ${error.message}]`
            }
          }
        }
        return result
      }
      
      // 普通对象
      const result = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          try {
            result[key] = this.makeSerializable(obj[key], visited)
          } catch (error) {
            result[key] = `[Serialization Error: ${error.message}]`
          }
        }
      }
      return result
    }
    
    // 基本类型
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return obj
    }
    
    // 其他不可序列化的类型
    return {
      __type: typeof obj,
      __value: String(obj)
    }
  }
  
  // 静态方法：通用序列化任何对象
  static serialize(obj) {
    const env = new RunEnv()
    return env.makeSerializable(obj)
  }
}
module.exports = RunEnv
// export default RunEnv