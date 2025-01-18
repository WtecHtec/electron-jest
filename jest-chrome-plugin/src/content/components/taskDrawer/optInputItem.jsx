
import {  forwardRef, useImperativeHandle, useState } from 'react'
import { Tooltip, Space, Divider, Input, Select } from 'antd'
const { TextArea } = Input;
const { Option } = Select;
const OptInputItem = forwardRef((props, ref) => {

  const [inputData, setInputData] = useState({ inputValue: '', inputType: 'valueType' })
  useImperativeHandle(ref, () => {
    return {
      inputData
    }
  })
  const onInputChange = (e) => {
    setInputData({
      ...inputData,
      inputValue: e.target.value
    })
  }

  const onPickMethodSelect = (value) => {
    setInputData({
			...inputData,
			inputType: value,
		})
  }
  return <>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>该操作会向元素输入内容设置类型</span>}>
        <span style={{ flexShrink: 0 }}>输入类型：</span>
      </Tooltip>
      <Select defaultValue="itself" style={{ flex: 1 }} value={inputData.inputType} onSelect={onPickMethodSelect} >
				<Option value="valueType">赋值</Option>
				{/* <Option value="pick_html">html</Option> */}
				<Option value="paramType">参数</Option>
			</Select>
    </Space.Compact>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>该操作会向元素输入内容【参数：为参数名】</span>}>
        <span style={{ flexShrink: 0 }}>输入内容：</span>
      </Tooltip>
      <TextArea rows={4} onChange={onInputChange} value={inputData.inputValue}/>
    </Space.Compact>
  </>
} ) 

export default OptInputItem