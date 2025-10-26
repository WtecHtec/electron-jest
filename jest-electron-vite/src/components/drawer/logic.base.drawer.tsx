import React, { memo, useState } from 'react';
import {  Space, Divider, Select, InputNumber, Button, Input } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import CodeModal from '../code.modal';
import { javascript } from '@codemirror/lang-javascript';

import { getMutliLevelProperty } from '../../util';
import ItemDrawer from './item.drawer';
import { LOGIC_API_INTERCEPT_REQUEST, LOGIC_FETCH_REQUEST } from './item.config';
const { Option } = Select;
const BASE_DESC = {
   'logic_close': [ '关闭页面', '关闭当前页面后,自动切换最右边tab页面'],
   'logic_back': [ '后退', '返回上一个页面后,自动切换最右边tab页面'],
   'logic_reload': [ '刷新', '刷新当前页面'],
   'logic_pdf': [ '导出PDF', '将当前页面导出为PDF'],
   'logic_func': ['自定义事件', '通过代码实现处理逻辑'],
   'logic_js_func': ['自定义JS函数', '通过JS代码实现处理逻辑'],
   'logic_new_page': ['获取最新页面', '获取最新页面'],
   'logic_intercepting_response': ['拦截响应', '拦截响应'],
   'logic_fetch_request': ['发起请求', '发起请求'],
}

const BASE_CODE = `
/***
 * 【此处为函数体】
 * 参数： const { page, env, browser, logWithCallback, ...other } = arg
 * 返回一个对象 【可调用page,下次操作参数会在arg中】
 * logWithCallback.info('') 可打印日志
 * 注意1：  page, env, browser , logWithCallback 尽量不要返回
 * 注意2：  导出时，export_data 会被导出
 * 
 * */
 const { page, env, browser, logWithCallback, ...other } = arg
 return {}
`

const BASE_JS_CODE = `
/***
 * 【此处为函数体】 【JS函数】 可以使用window 关键字
 * 参数： const {  ...other } = arg 
 * 返回一个对象 【下次操作参数会在arg中】
 * 注意： 导出时，export_data 会被导出
 * */
 const { ...other } = arg
 return {}
`
const REQUEST_CODE = `
/**
 * 此处为函数体, 处理请求参数
 *  入参： const { url , method, headers, postData } = arg || {};
 *  返回回一个对象  { url , method, headers, postData }
 * */
const { url = '' , method = 'GET', headers = {}, postData = {} } = arg || {};
return { url , method, headers, postData}
`


const CODE_BY_TYPE = {
  logic_js_func: BASE_JS_CODE,
  logic_func: BASE_CODE,
  logic_intercepting_response: REQUEST_CODE,
  logic_fetch_request: REQUEST_CODE,
}

const ITEM_DATA_MAP = {
  logic_intercepting_response: LOGIC_API_INTERCEPT_REQUEST,
  logic_fetch_request: LOGIC_FETCH_REQUEST,
}

export default memo(({ node }) => {
  // console.log('node===', node)
  const [savaPath, setSavePath] = useState(getMutliLevelProperty(node, 'data.logicsetting.savaPath', ''))
  const [waitTime, setWaitTime] = useState(getMutliLevelProperty(node, 'data.logicsetting.waitTime', ''))
  const [rename, setReName] = useState(getMutliLevelProperty(node, 'data.logicsetting.rename', ''))
  const [funcCode, setFuncCode] = useState(decodeURIComponent(getMutliLevelProperty(node, 'data.logicsetting.selfFuncCode',  CODE_BY_TYPE[node.type] ||  BASE_CODE ) || (CODE_BY_TYPE[node.type] ||  BASE_CODE))) 
  const [isModalOpen, setIsModalOpen] = useState(false);

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
       (node.type === 'logic_func' || node.type === 'logic_js_func' || node.type === 'logic_intercepting_response' || node.type === 'logic_fetch_request')  && <>
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
    <ItemDrawer node={node} datas={ITEM_DATA_MAP[node.type] || []}></ItemDrawer>
    <CodeModal onCode={ onCode } open={isModalOpen} code={funcCode}></CodeModal>
  </> 
});