import React, { memo, useState } from 'react';
import {  Space, Divider, Select, Button, Input } from 'antd';
import { getMutliLevelProperty } from '../../util';
const { Option } = Select;
export default memo(({ node }) => {
  // console.log('node===', node)
  const [savaPath, setSavePath] = useState(getMutliLevelProperty(node, 'data.logicsetting.savaPath', ''))

   const [appToken, setAppToken] = useState(getMutliLevelProperty(node, 'data.logicsetting.appToken', ''))
  const [personalBaseToken, setPersonalBaseToken] = useState(getMutliLevelProperty(node, 'data.logicsetting.personalBaseToken', ''))
  const [tableId, setTableId] = useState(getMutliLevelProperty(node, 'data.logicsetting.tableId', ''))

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

   const onAppTokenChange = (e) => {
    const value = e.target.value;
    setAppToken(value);
    try {
      node.data.logicsetting.appToken = value
    } catch (error) {
      console.error('onAppTokenChange---', error)
    }
  }
  
  const onPersonalBaseTokenChange = (e) => {
    const value = e.target.value;
    setPersonalBaseToken(value);
    try {
      node.data.logicsetting.personalBaseToken = value
    } catch (error) {
      console.error('onPersonalBaseTokenChange---', error)
    }
  }
  
  const onTableIdChange = (e) => {
    const value = e.target.value;
    setTableId(value);
    try {
      node.data.logicsetting.tableId = value
    } catch (error) {
      console.error('onTableIdChange---', error)
    }
  }
 
  return <>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">处理事件:</span> 
      <span className="dr-txt"> 导出数据(飞书表格需要填写)</span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">数据类型:</span> 
      <span className="dr-txt"> 
        <Select defaultValue="text" style={{ width: 200 }} onSelect={onDataTypeSelect}  >
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
            <Option value="feishu_excel">飞书多维表格</Option>
          <Option value="doc" disabled>文档</Option>
        
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
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">AppToken:</span> 
      <span className="dr-txt"> 
        <Input 
          placeholder="请输入AppToken" 
          value={appToken} 
          onChange={onAppTokenChange}
          style={{ width: 200 }}
        />
      </span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">personalBaseToken:</span> 
      <span className="dr-txt"> 
        <Input 
          placeholder="请输入personalBaseToken" 
          value={personalBaseToken} 
          onChange={onPersonalBaseTokenChange}
          style={{ width: 200 }}
        />
      </span> 
    </Space.Compact>
    <Divider></Divider>
    <Space.Compact  block style={{ alignItems: 'center',   }}>
      <span className="dr-left">table_id:</span> 
      <span className="dr-txt"> 
        <Input 
          placeholder="请输入多维表格table_id" 
          value={tableId} 
          onChange={onTableIdChange}
          style={{ width: 200 }}
        />
      </span> 
    </Space.Compact>
    <Divider></Divider>
  </> 
});