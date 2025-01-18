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
}
module.exports = RunEnv
// export default RunEnv