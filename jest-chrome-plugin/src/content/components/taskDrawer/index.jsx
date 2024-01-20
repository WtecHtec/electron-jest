import { memo, useState, useRef } from 'react'
import { Tooltip, Drawer, Space, Select, Divider, InputNumber, Button, message, Input  } from 'antd'


import useThrottle from '../../../common/hooks/useThrottle'
import WsClient from '../../ws.client'

import OptClickItem from './optClickItem'
import OptInputItem from './optInputItem'
import OptVerifyItem from './optVerifyItem'
import OptPickItem from './optPickItem'
import OptExistsItem from './optExistsItem'


const { Option } = Select;

const getNodeData = (optType, xpath, waitTime, rename, other = {}) => {
	return JSON.stringify({
		type: optType,
		data: {
			optsetting: {
				xpath,
				waitTime,
        rename,
				optType,
				...other,
			}
		}
	})
}
function TaskDrawer({ onClose, open, xpath }) {
	const [messageApi, contextHolder] = message.useMessage();
	const [optType, setOptType] = useState('opt_click')
	const [waitTime, setWaitTime] = useState(1)
  const [optReName, setOptReName] = useState('')
	const optRef = useRef(null)

	const handleOptTypeSelect = (value) => {
		setOptType(value)
	};

	const onWaitTimeChange = (value) => {
		setWaitTime(value)
	};

  const onRenameChange = (e) => {
    setOptReName(e.target.value)
  }
	const handleFinish = useThrottle(() => {
		const wsclient = WsClient.getInstance()
		console.log('handleFinish----', wsclient.getStatus())
		if (wsclient.getStatus()) {
			const other = optRef.current
			wsclient.send(getNodeData(optType, xpath, waitTime, optReName, { ...other }))
			typeof onClose === 'function' && onClose();
		} else {
			messageApi.open({
				type: 'error',
				content: '连接不上ws服务',
			});
		}
	}, 1000, [])

	return <>
		{contextHolder}
		<Drawer title="任务设计"  placement="left" width={500} onClose={onClose} open={open} maskClosable={false} keyboard={false}>
			<div id="dom-inspector-root-jest-pro-drawer">当前xpath: <span style={{ color: '#666666', wordBreak: 'break-all' }}> {xpath} </span> </div>
      <Divider dashed></Divider>
      <Space.Compact block style={{ alignItems: 'center' }}>
        <Tooltip placement="top" title={<span>操作描述,让流程更加清楚</span>}>
          <span style={{ flexShrink: 0 }}>操作描述:</span>
        </Tooltip>
			  <Input style={{ flex: 1 }} onChange={onRenameChange} value={optReName} />
		  </Space.Compact>
			<Divider dashed></Divider>
			<Space.Compact block style={{ alignItems: 'center' }}>
				<Tooltip placement="top" title={<span>元素操作行为,如:点击\输入\悬停等</span>}>
					<span>类型：</span>
				</Tooltip>
				<Select defaultValue="opt_click" style={{ flex: 1 }} value={optType} onSelect={handleOptTypeSelect} >
					<Option value="opt_click">点击</Option>
					<Option value="opt_input">输入</Option>
					<Option value="opt_verify">校验</Option>
					<Option value="opt_pick">采集</Option>
          <Option value="opt_hover">悬停</Option>
          <Option value="opt_exists">是否存在</Option>
				</Select>
			</Space.Compact>
			<Divider dashed></Divider>
			<Space.Compact block style={{ alignItems: 'center' }}>
				<Tooltip placement="top" title={<span>元素操作之后,设置等待响应的时间</span>}>
					<span>响应时长(秒)：</span>
				</Tooltip>
				<InputNumber style={{ flex: 1 }} min={1} defaultValue={1} value={waitTime} onChange={onWaitTimeChange} />
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
      {
				optType === 'opt_exists' && <OptExistsItem ref={optRef} xpath={xpath}></OptExistsItem>
			}
			<Divider dashed></Divider>
			<Space.Compact block style={{ justifyContent: 'center' }}>
				<Button type="primary" onClick={handleFinish}>保存逻辑</Button>
			</Space.Compact>

		</Drawer>
	</>
}

export default memo(TaskDrawer)