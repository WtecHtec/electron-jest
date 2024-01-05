import { Tooltip, Space, Divider, Input, Select } from 'antd'
const { TextArea } = Input;
const { Option } = Select;
function OptVerifyItem() {

  return <>
  <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>设置校验名称,方便查找</span>}>
        <span style={{ flexShrink: 0 }}>校验名称:</span>
      </Tooltip>
      <Input style={{ flex: 1}} />
    </Space.Compact>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>该操作会根据当前元素text内容与检验内容比较</span>}>
        <span style={{ flexShrink: 0 }}>检验内容：</span>
      </Tooltip>
      <TextArea rows={4}/>
    </Space.Compact>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>检验失败后,如何提示</span>}>
        <span style={{ flexShrink: 0 }}>提示方式:</span>
      </Tooltip>
      <Select defaultValue="tip_alert" style={{ flex: 1}}  >
        <Option value="tip_alert">弹窗</Option>
      </Select>
    </Space.Compact>
  </>
}

export default OptVerifyItem