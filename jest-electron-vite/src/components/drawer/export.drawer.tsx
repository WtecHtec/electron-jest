import React, { memo, useState } from 'react';
import {  Space, Divider, Select, Button } from 'antd';
import { getMutliLevelProperty } from '../../util';
const { Option } = Select;
export default memo(({ node }) => {
  console.log('node===', node)
  const [savaPath, setSavePath] = useState(getMutliLevelProperty(node, 'data.logicsetting.savaPath', ''))
  const onDataTypeSelect = (value) => {
    try {
      node.data.logicsetting.dataType = value
    } catch (error) {
      console.error('onDataTypeSelect---', error)
    }
  }
  const onFileTypeSelect =  (value) => {
    try {
      node.data.logicsetting.fileType = value
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
      <span className="dr-txt"> 导出数据</span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">数据类型:</span> 
      <span className="dr-txt"> 
        <Select defaultValue="text" style={{ flex: 1 }} onSelect={onDataTypeSelect}  >
          <Option value="text">文本</Option>
          <Option value="image" disabled>图片</Option>
        </Select>
      </span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">导出文件格式:</span> 
      <span className="dr-txt"> 
        <Select defaultValue="json" style={{ width: 200 }} onSelect={onFileTypeSelect} >
          <Option value="json">json</Option>
          <Option value="doc" disabled>文档</Option>
          <Option value="excel" disabled>表格</Option>
        </Select>
      </span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">保存路径:</span> 
      <span className="dr-txt"> 
        <Button type="link" onClick={onSavePathSelect}>选择文件夹</Button>
        <div> { savaPath }  </div>
      </span> 
    </Space.Compact>
    <Divider></Divider>
  </> 
});