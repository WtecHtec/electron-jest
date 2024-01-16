import React, { memo, useState } from 'react';
import {  Space, Divider, Select, InputNumber, Button, Input } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import { getMutliLevelProperty } from '../../util';
const { Option } = Select;
const BASE_DESC = {
   'logic_close': [ '关闭页面', '关闭当前页面后,自动切换最右边tab页面'],
   'logic_back': [ '后退', '返回上一个页面后,自动切换最右边tab页面'],
   'logic_reload': [ '刷新', '刷新当前页面'],
   'logic_pdf': [ '导出PDF', '将当前页面导出为PDF'],
   'logic_func': ['自定义事件', '通过代码实现处理逻辑']
}

const BASE_CODE = `
/***
 * 【此处为函数体】
 * 参数： const { page, env, browser, ...other } = arg
 * 返回一个对象 【可修改page,下次操作参数会在arg中】
 * */
 const { page, env, browser, ...other } = arg
 return {}
`
export default memo(({ node }) => {
  // console.log('node===', node)
  const [savaPath, setSavePath] = useState(getMutliLevelProperty(node, 'data.logicsetting.savaPath', ''))
  const [waitTime, setWaitTime] = useState(getMutliLevelProperty(node, 'data.logicsetting.waitTime', ''))
  const [rename, setReName] = useState(getMutliLevelProperty(node, 'data.logicsetting.rename', ''))
  const [funcCode, setFuncCode] = useState(decodeURIComponent(getMutliLevelProperty(node, 'data.logicsetting.selfFuncCode', BASE_CODE) || BASE_CODE)) 

  const onWaitTimeChange = (value) => {
    setWaitTime(value)
    try {
      node.data.logicsetting.waitTime = value
    } catch (error) {
      console.error('onDataTypeSelect---', error)
    }
  }

  const onReNameChange = (e) => {
    try {
      setReName(e.target.value)
      node.data.logicsetting.rename = e.target.value
    } catch (error) {
      console.error('onSavePathSelect---', error)
    }
  }

  const onChangeFuncCode = (value) => {
    setFuncCode(value)
    try {
      node.data.logicsetting.selfFuncCode = encodeURIComponent(value) 
    } catch (error) {
      console.error('onDataTypeSelect---', error)
    }
  }  

  const onSavePathSelect = async () => {
    const folderPath = await  window.ipcRenderer.invoke('select-folder');
    setSavePath(folderPath)
    try {
      node.data.logicsetting.savaPath = folderPath
    } catch (error) {
      console.error('onSavePathSelect---', error)
    }
  }
 
  return <>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">处理事件:</span> 
      <span className="dr-txt"> {  BASE_DESC[node.type][0] }</span> 
    </Space.Compact>
    <Divider></Divider>
   <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">描述：</span> 
      <span className="dr-txt"> 
        {BASE_DESC[node.type][1]}
      </span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">执行等待响应时间:</span> 
      <span className="dr-txt"> 
        <InputNumber style={{ width: 200 }} min={0} defaultValue={0} value={waitTime} onChange={onWaitTimeChange} />
      </span> 
    </Space.Compact>
    <Divider></Divider>
    {
      node.type === 'logic_pdf' && <>
         <Space.Compact  block style={{ alignItems: 'center',   }}>
          <span className="dr-left">保存路径:</span> 
          <span className="dr-txt"> 
            <Button type="link" onClick={onSavePathSelect}>选择文件夹</Button>
            <div> { savaPath }  </div>
          </span> 
        </Space.Compact>
        <Divider></Divider>
      </>
    }
    {
       node.type === 'logic_func' && <>
        <Space.Compact  block style={{ alignItems: 'center',   }}>
          <span className="dr-left">处理描述:</span> 
          <span className="dr-txt"> 
            <Input  style={{ width: 200 }}  value={rename} onChange={onReNameChange} />
          </span> 
        </Space.Compact>
        <Divider></Divider>
        <CodeMirror
            value={funcCode}
            height="200px"
            extensions={[javascript()]}
            onChange={(value) => { onChangeFuncCode(value) }}
          />
        <Divider></Divider>
      </>

    }
  </> 
});