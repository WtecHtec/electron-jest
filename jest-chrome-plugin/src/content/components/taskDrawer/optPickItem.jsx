
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Tooltip, Space, Divider, Select, Input } from 'antd'

const { Option } = Select;
const OptPickItem = forwardRef((props, ref) => {
	const [pickData, setPickData] = useState({ pickType: 'pick_text', pickDesc: '' })
	useImperativeHandle(ref, () => {
		return {
			pickData
		}
	})

	const onPickTypeSelect = (value) => {
		setPickData({
			...pickData,
			pickType: value,
		})
	}
	const onPickDescChange = (e) => {
		setPickData({
			...pickData,
			pickDesc: e.target.value,
		})
	}
	return <>
		<Divider dashed></Divider>
		<Space.Compact block style={{ alignItems: 'center' }}>
			<Tooltip placement="top" title={<span>设置描述,方便查找</span>}>
				<span style={{ flexShrink: 0 }}>采集描述:</span>
			</Tooltip>
			<Input style={{ flex: 1 }} onChange={onPickDescChange} value={pickData.pickDesc} />
		</Space.Compact>
		<Divider dashed></Divider>
		<Space.Compact block style={{ alignItems: 'center' }}>
			<Tooltip placement="top" title={<span>采集元素内容,如:text采集容器纯文本</span>}>
				<span style={{ flexShrink: 0 }}>采集内容：</span>
			</Tooltip>
			<Select defaultValue="pick_text" style={{ flex: 1 }} value={pickData.pickType} onSelect={onPickTypeSelect} >
				<Option value="pick_text">text</Option>
				{/* <Option value="pick_html">html</Option> */}
				<Option value="pick_src">src</Option>
				<Option value="pick_href">href</Option>
			</Select>
		</Space.Compact>
	</>
})

export default OptPickItem