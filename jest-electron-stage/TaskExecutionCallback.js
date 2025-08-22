// 修改 TaskExecutionCallback 类，添加 taskdata 返回
class TaskExecutionCallback {
  constructor() {
    this.callbacks = []
    this.executionId = Date.now().toString()
    this.startTime = new Date()
    this.steps = []
    this.currentTaskData = null // 添加当前任务数据存储
  }

 removeAllCallback() {
     this.callbacks = []
  }

  // 添加回调函数
  addCallback(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback)
    }
  }

  // 触发回调
  trigger(eventType, data) {
    const event = {
      executionId: this.executionId,
      timestamp: new Date(),
      eventType,
      currentTaskData: this.currentTaskData, // 添加当前任务数据
      ...data
    }
    
    this.callbacks.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.error('回调执行错误:', error)
      }
    })
  }

  // 开始执行
  onStart(taskData) {
    this.currentTaskData = taskData // 保存完整任务数据
    this.trigger('start', {
      totalSteps: taskData.length,
      startTime: this.startTime,
      taskData: taskData, // 返回完整的taskData
      taskSummary: taskData.map(task => ({ 
        nodeType: task.nodeType, 
        rename: task.rename,
        id: task.id || task.nodeType + '_' + Math.random().toString(36).substr(2, 9)
      }))
    })
  }

  // 步骤开始
  onStepStart(step, task) {
    this.trigger('step_start', {
      step: step + 1,
      totalSteps: this.currentTaskData ? this.currentTaskData.length : 0,
      nodeType: task.nodeType,
      taskName: task.rename || task.nodeType,
      currentTask: task, // 返回当前执行的完整task数据
      remainingTasks: this.currentTaskData ? this.currentTaskData.slice(step + 1) : [] // 返回剩余任务
    })
  }

  // 步骤成功
  onStepSuccess(step, task, result) {
    this.trigger('step_success', {
      step: step + 1,
      totalSteps: this.currentTaskData ? this.currentTaskData.length : 0,
      nodeType: task.nodeType,
      taskName: task.rename || task.nodeType,
      currentTask: task, // 返回当前执行的完整task数据
      result: result,
      duration: Date.now() - this.stepStartTime,
      completedTasks: this.currentTaskData ? this.currentTaskData.slice(0, step + 1) : [], // 返回已完成任务
      remainingTasks: this.currentTaskData ? this.currentTaskData.slice(step + 1) : [] // 返回剩余任务
    })
  }

  // 步骤失败
  onStepError(step, task, error) {
    this.trigger('step_error', {
      step: step + 1,
      totalSteps: this.currentTaskData ? this.currentTaskData.length : 0,
      nodeType: task.nodeType,
      taskName: task.rename || task.nodeType,
      currentTask: task, // 返回当前执行的完整task数据
      error: error.message || error,
      stack: error.stack,
      duration: Date.now() - this.stepStartTime,
      completedTasks: this.currentTaskData ? this.currentTaskData.slice(0, step) : [], // 返回已完成任务
      failedTask: task, // 返回失败的任务
      remainingTasks: this.currentTaskData ? this.currentTaskData.slice(step + 1) : [] // 返回剩余任务
    })
  }

  // 执行完成
  onComplete(result) {
    this.trigger('complete', {
      result: result,
      duration: Date.now() - this.startTime.getTime(),
      endTime: new Date(),
      completedTasks: this.currentTaskData || [], // 返回所有已完成任务
      totalSteps: this.currentTaskData ? this.currentTaskData.length : 0
    })
  }

  // 执行失败
  onError(error) {
    this.trigger('error', {
      error: error.message || error,
      stack: error.stack,
      duration: Date.now() - this.startTime.getTime(),
      endTime: new Date(),
      failedTaskData: this.currentTaskData // 返回失败时的任务数据
    })
  }

   // 日志回调方法
  onLog(level, message, ...args) {
    this.trigger('log', {
      level, // 'info', 'error', 'warn', 'debug', 'log'
      message,
      args,
      timestamp: new Date()
    })
  }

  // 获取当前执行状态
  getCurrentStatus() {
    return {
      executionId: this.executionId,
      startTime: this.startTime,
      currentTaskData: this.currentTaskData,
      isRunning: !!this.currentTaskData
    }
  }
}

module.exports = TaskExecutionCallback