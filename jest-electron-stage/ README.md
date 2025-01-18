# flowauto

Google Chrome Automation Executor

# 安装

```
npm install -g flowauto
```

# 使用

```
flowauto --userDataDir ./userDataDir --filepath ./flow.json
```

# 参数

- userDataDir: 浏览器缓存数据文件夹配置路径
- filepath: 任务配置文件路径

# 任务配置文件
可以在桌面应用编排好的任务，然后导出json文件，然后使用flowauto执行

```
{
  "task": []
}
```
# 参数使用

这里根据你任务编排输入操作时，选择以参数类型输入的情况下使用，这里需要记录参数名称，然后使用flowauto执行时，通过--param1 value1 --param2 value2 方式传入

如下：

```
flowauto --userDataDir ./userDataDir --filepath ./flow.json --param1 value1 --param2 value2
```
