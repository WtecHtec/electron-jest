
import {  forwardRef, useImperativeHandle, useState } from 'react'
import { Tooltip, Space, Divider, Input } from 'antd'
const { TextArea } = Input;
const OptInputItem = forwardRef((props, ref) => {
  const [inputData, setInputData] = useState({ inputValue: '' })
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
  return <>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>该操作会向元素输入内容</span>}>
        <span style={{ flexShrink: 0 }}>输入内容：</span>
      </Tooltip>
      <TextArea rows={4} onChange={onInputChange} value={inputData.inputValue}/>
    </Space.Compact>
  </>
} ) 

export default OptInputItem