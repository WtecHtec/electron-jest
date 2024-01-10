import React, { memo, useState } from 'react';
import {  Space, Divider, Select, InputNumber } from 'antd';
import { getMutliLevelProperty } from '../../util';
const { Option } = Select;
export default memo(({ node }) => {
  console.log('node===', node)
  const [frequency, setFrequency] = useState(1)

  const onLoopTypeSelect =  (value) => {
    try {
      node.data.logicsetting.loopType = value
    } catch (error) {
      console.error('onDataTypeSelect---', error)
    }
  }

  const onFrequencyChange = (value) => {
    setFrequency(value)
    try {
      node.data.logicsetting.frequency = value
    } catch (error) {
      console.error('onDataTypeSelect---', error)
    }
  }
 
  return <>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">处理事件:</span> 
      <span className="dr-txt"> 循环</span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">👉：</span> 
      <span className="dr-txt"> 
        右边流程为需要循环执行事件
      </span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">👇：</span> 
      <span className="dr-txt"> 
        底部流程为循环结束后继续执行事件
      </span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">循环类型:</span> 
      <span className="dr-txt"> 
        <Select defaultValue="frequency" style={{ width: 200 }} onSelect={onLoopTypeSelect} >
          <Option value="frequency">次数</Option>
          <Option value="function" disabled>自定义事件</Option>
        </Select>
      </span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">循环次数:</span> 
      <span className="dr-txt"> 
        <InputNumber style={{ width: 200 }} min={0} defaultValue={0} value={frequency} onChange={onFrequencyChange} />
      </span> 
    </Space.Compact>
    <Divider></Divider>
  </> 
});