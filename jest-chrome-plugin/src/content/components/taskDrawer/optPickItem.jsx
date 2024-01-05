import { Tooltip, Space, Divider, Select } from 'antd'

const { Option } = Select; 
function OptPickItem() {
  return <>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>采集元素内容,如:html会采集标签</span>}>
        <span style={{ flexShrink: 0 }}>采集内容：</span>
      </Tooltip>
      <Select defaultValue="pick_text" style={{ flex: 1}}  >
        <Option value="pick_text">text</Option>
        <Option value="pick_html">html</Option>
        <Option value="pick_src">src</Option>
      </Select>
    </Space.Compact>
  </>
}

export default OptPickItem