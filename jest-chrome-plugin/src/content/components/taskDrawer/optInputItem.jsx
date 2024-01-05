import { Tooltip, Space, Divider, Input } from 'antd'
const { TextArea } = Input;
function OptInputItem() {
  
  return <>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>该操作会向元素输入内容</span>}>
        <span style={{ flexShrink: 0 }}>输入内容：</span>
      </Tooltip>
      <TextArea rows={4}/>
    </Space.Compact>
  </>
}

export default OptInputItem