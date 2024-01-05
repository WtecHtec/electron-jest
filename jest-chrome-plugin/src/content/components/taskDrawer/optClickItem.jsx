import {  forwardRef, useImperativeHandle, useState } from 'react'
import { Tooltip, Space, Divider, Radio,  } from 'antd'

const OptClickItem = forwardRef((props, ref) => {

  const [ clickData, setClickData ] = useState({ isCurrentPage: 1, })

  useImperativeHandle(ref, () => {
    // 在这里返回的内容，都可以被父组件的REF对象获取到
    return {
      clickData
    };
  });

  const handelCurrentPage = (e) => {
    setClickAttr({
      ...clickData,
      isCurrentPage: e.target.value
    })
  }

  return <>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>该操作存在跳转到新页面,是否继续在当前页面操作</span>}>
        <span>操作页面：</span>
      </Tooltip>
      <Radio.Group style={{flex: 1}} value={ clickData.isCurrentPage} onChange={handelCurrentPage}>
        <Radio value={1}>当前页</Radio>
        <Radio value={2}>新页面</Radio>
      </Radio.Group>
    </Space.Compact>
  </>
})

export default OptClickItem