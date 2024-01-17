import React, { memo, useState, useRef, useMemo, useEffect } from 'react';
import {  Space, Divider, Select, InputNumber } from 'antd';

import CodeModal from '../code.modal';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';


const BASE_CODE = `
/***
 * 【此处为函数体】
 * 参数： const { page, env, browser, ...other } = arg
 * 必须返回 Boolean 类型
 * */
 const { page, env, browser, ...other } = arg
 return true
`
import { getMutliLevelProperty } from '../../util';
const { Option } = Select;
export default memo(({ node }) => {
  // console.log('node===', node)
  const [frequency, setFrequency] = useState(getMutliLevelProperty(node, 'data.logicsetting.frequency', 1))
  const [loopType, setLoopType] = useState(getMutliLevelProperty(node, 'data.logicsetting.loopType', 'frequency'))

  const [funcCode, setFuncCode] = useState(decodeURIComponent(getMutliLevelProperty(node, 'data.logicsetting.selfFuncCode', BASE_CODE) || BASE_CODE)) 
  const editorRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onLoopTypeSelect =  (value) => {
    try {
      node.data.logicsetting.loopType = value
      setLoopType(value)
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
 

  // const onChangeFuncCode = (value) => {
  //   setFuncCode(value)
  //   try {
  //     node.data.logicsetting.selfFuncCode = encodeURIComponent(value) 
  //   } catch (error) {
  //     console.error('onDataTypeSelect---', error)
  //   }
  // }  

  const onCode = (code,) => {
    setIsModalOpen(false)
    try {
      node.data.logicsetting.selfFuncCode = encodeURIComponent(code) 
      setFuncCode(code)
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
        <Select defaultValue="frequency" value={loopType}  style={{ width: 200 }} onSelect={onLoopTypeSelect} >
          <Option value="frequency">次数</Option>
          <Option value="selffunc">自定义事件</Option>
        </Select>
      </span> 
    </Space.Compact>
    <Divider></Divider>
    {
      loopType === 'frequency' && <>
        <Space.Compact  block style={{ alignItems: 'center',   }}>
          <span className="dr-left">循环次数:</span> 
          <span className="dr-txt"> 
            <InputNumber style={{ width: 200 }} min={0} defaultValue={0} value={frequency} onChange={onFrequencyChange} />
          </span> 
        </Space.Compact>
        <Divider></Divider>
      </>
    } 
  
    {
      loopType === 'selffunc' &&  <>
          
          <CodeMirror
            ref={editorRef}
            value={funcCode}
            height="200px"
            readOnly={true}
            extensions={[javascript()]}
            // onChange={(value) => { onChangeFuncCode(value) }}
            onClick={ () => {
                setIsModalOpen(true)
            } }
          />
        <Divider></Divider>
      </>
    }
    <CodeModal onCode={ onCode } open={isModalOpen} code={funcCode}></CodeModal>
  </> 
});