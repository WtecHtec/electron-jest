import React, { memo, useState } from 'react';
import {  Space, Divider, Select, InputNumber, Button } from 'antd';
import { getMutliLevelProperty } from '../../util';
const { Option } = Select;
const BASE_DESC = {
   'logic_close': [ '关闭页面', '关闭当前页面后,自动切换最右边tab页面'],
   'logic_back': [ '后退', '返回上一个页面后,自动切换最右边tab页面'],
   'logic_reload': [ '刷新', '刷新当前页面'],
   'logic_pdf': [ '导出PDF', '将当前页面导出为PDF'],
}
export default memo(({ node }) => {
  // console.log('node===', node)
  const [savaPath, setSavePath] = useState(getMutliLevelProperty(node, 'data.logicsetting.savaPath', ''))
  const [waitTime, setWaitTime] = useState(1)

  const onWaitTimeChange = (value) => {
    setWaitTime(value)
    try {
      node.data.logicsetting.waitTime = value
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
 
  </> 
});