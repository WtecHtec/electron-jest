import { forwardRef, useImperativeHandle, useState } from 'react'
import { Tooltip, Space, Divider, Input, Select } from 'antd'
const { TextArea } = Input;
const { Option } = Select;
const OptVerifyItem = forwardRef((props, ref) => {
	const [verifyData, setVerifyData] = useState({ tipType: 'tip_alert', verifyValue: '' })
	useImperativeHandle(ref, () => {
		return {
			verifyData
		}
	})

	// const onRenameChange = (e) => {
	// 	setVerifyData({
	// 		...verifyData,
	// 		rename: e.target.value,
	// 	})
	// }

	const onTipTypeSelect = (value) => {
		setVerifyData({
			...verifyData,
			tipType: value,
		})
	}
	const onVerifyValueChange = (e) => {
		setVerifyData({
			...verifyData,
			verifyValue: e.target.value
		})
	}
	return <>
		{/* <Divider dashed></Divider>
		<Space.Compact block style={{ alignItems: 'center' }}>
			<Tooltip placement="top" title={<span>设置校验名称,方便查找</span>}>
				<span style={{ flexShrink: 0 }}>校验名称:</span>
			</Tooltip>
			<Input style={{ flex: 1 }} onChange={onRenameChange} value={verifyData.rename} />
		</Space.Compact> */}
		<Divider dashed></Divider>
		<Space.Compact block style={{ alignItems: 'center' }}>
			<Tooltip placement="top" title={<span>该操作会根据当前元素text内容与检验内容比较</span>}>
				<span style={{ flexShrink: 0 }}>检验内容：</span>
			</Tooltip>
			<TextArea rows={4} value={verifyData.verifyValue} onChange={onVerifyValueChange} />
		</Space.Compact>
		<Divider dashed></Divider>
		<Space.Compact block style={{ alignItems: 'center' }}>
			<Tooltip placement="top" title={<span>检验失败后,如何提示</span>}>
				<span style={{ flexShrink: 0 }}>提示方式:</span>
			</Tooltip>
			<Select defaultValue="tip_log" style={{ flex: 1 }} onSelect={onTipTypeSelect} >
				<Option value="tip_log">日志</Option>
				<Option value="tip_alert">弹窗</Option>
			</Select>
		</Space.Compact>
	</>
})

export default OptVerifyItem