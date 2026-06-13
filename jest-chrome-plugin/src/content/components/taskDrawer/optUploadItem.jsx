import {  forwardRef, useImperativeHandle, useState } from 'react'
import { Tooltip, Space, Divider, Input, Select } from 'antd'
const { TextArea } = Input;
const { Option } = Select;
const OptUploadItem = forwardRef((props, ref) => {

  const [uploadData, setUploadData] = useState({ inputValue: '', inputType: 'valueType' })
  useImperativeHandle(ref, () => {
    return {
      uploadData
    }
  })
  const onInputChange = (e) => {
    setUploadData({
      ...uploadData,
      inputValue: e.target.value
    })
  }

  const onPickMethodSelect = (value) => {
    setUploadData({
			...uploadData,
			inputType: value,
		})
  }
  return <>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>该操作会设置路径的读取方式</span>}>
        <span style={{ flexShrink: 0 }}>路径类型：</span>
      </Tooltip>
      <Select defaultValue="valueType" style={{ flex: 1 }} value={uploadData.inputType} onSelect={onPickMethodSelect} >
				<Option value="valueType">赋值</Option>
				<Option value="paramType">参数</Option>
			</Select>
    </Space.Compact>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>该操作会向上传区域塞入文件【参数：为参数名】</span>}>
        <span style={{ flexShrink: 0 }}>文件路径/变量：</span>
      </Tooltip>
      <TextArea rows={4} onChange={onInputChange} value={uploadData.inputValue}/>
    </Space.Compact>
  </>
} ) 

export default OptUploadItem
