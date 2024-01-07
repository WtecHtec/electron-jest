import { memo, useState, useRef } from 'react'
import { Tooltip, Drawer, Space, Select, Divider, InputNumber, Button } from 'antd'

import OptClickItem from './optClickItem'
import OptInputItem from './optInputItem'
import OptVerifyItem from './optVerifyItem'
import OptPickItem from './optPickItem'

const { Option } = Select;

function TaskDrawer({ onClose, open, xpath }) {

	const [optType, setOptType] = useState('opt_click')
	const [waitTime, setWaitTime] = useState(0)
	const optRef = useRef(null)

	const handleOptTypeSelect = (value) => {
		setOptType(value)
	};

	const onWaitTimeChange = (value) => {
		setWaitTime(value)
	};

	const handleFinish = () => {
		console.log('handleFinish----', optRef)
	}

	return <>
		<Drawer title="任务设计" placement="right" width={500} onClose={onClose} open={open} maskClosable={false} keyboard={false}>
			<div>当前xpath: <span style={{ color: '#666666' }}> {xpath} </span> </div>
			<Divider dashed></Divider>
			<Space.Compact block style={{ alignItems: 'center' }}>
				<Tooltip placement="top" title={<span>元素操作行为,如:点击、输入等</span>}>
					<span>类型：</span>
				</Tooltip>
				<Select defaultValue="opt_click" style={{ flex: 1 }} value={optType} onSelect={handleOptTypeSelect} >
					<Option value="opt_click">点击</Option>
					<Option value="opt_input">输入</Option>
					<Option value="opt_verify">校验</Option>
					<Option value="opt_pick">采集</Option>
				</Select>
			</Space.Compact>
			<Divider dashed></Divider>
			<Space.Compact block style={{ alignItems: 'center' }}>
				<Tooltip placement="top" title={<span>元素操作之后,设置等待响应的时间</span>}>
					<span>响应时长(秒)：</span>
				</Tooltip>
				<InputNumber style={{ flex: 1 }} min={0} defaultValue={0} value={waitTime} onChange={onWaitTimeChange} />
			</Space.Compact>
			{
				optType === 'opt_click' && <OptClickItem ref={optRef}></OptClickItem>
			}
			{
				optType === 'opt_input' && <OptInputItem ref={optRef}></OptInputItem>
			}
			{
				optType === 'opt_verify' && <OptVerifyItem ref={optRef}></OptVerifyItem>
			}
			{
				optType === 'opt_pick' && <OptPickItem ref={optRef} xpath={xpath}></OptPickItem>
			}
			<Divider dashed></Divider>
			<Space.Compact block style={{ justifyContent: 'center' }}>
				<Button type="primary" onClick={handleFinish}>完成设计</Button>
			</Space.Compact>

		</Drawer>
	</>
}

export default memo(TaskDrawer)