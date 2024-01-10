import React, { memo, useState } from 'react';

import { Layout, Button, Divider, Table, Modal, Input, message } from 'antd';
import { useNavigate } from "react-router-dom";
const { Header, Content, Footer } = Layout
export default memo((props) => {
	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (text) => <a>{text}</a>,
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: 'Tags',
			key: 'tags',
			dataIndex: 'tags',
			render: (_, { tags }) => (
				<>
					{tags.map((tag) => {
						let color = tag.length > 5 ? 'geekblue' : 'green';
						if (tag === 'loser') {
							color = 'volcano';
						}
						return (
							<div>
								{tag.toUpperCase()}
							</div>
						);
					})}
				</>
			),
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<div>
					<a>Invite {record.name}</a>
					<a>Delete</a>
				</div>
			),
		},
	];
	const data = [
		{
			key: '1',
			name: 'John Brown',
			age: 32,
			address: 'New York No. 1 Lake Park',
			tags: ['nice', 'developer'],
		},
		{
			key: '2',
			name: 'Jim Green',
			age: 42,
			address: 'London No. 1 Lake Park',
			tags: ['loser'],
		},
		{
			key: '3',
			name: 'Joe Black',
			age: 32,
			address: 'Sydney No. 1 Lake Park',
			tags: ['cool', 'teacher'],
		},
	];
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();
	const [open, setOpen] = useState(false)
	const [taskUrl, setTaskUrl] = useState('')
	const onCreateTask = () => {
		setOpen(true)
	}

	const handleOk = async () => {
		if (!taskUrl) {
			messageApi.open({
				type: 'warning',
				content: '页面URL不能为空！！',
			});
			return
		}
		if (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.test(taskUrl)) {
			// window.ipcRenderer.send('start-task-setting', taskUrl)
			const [status, num] = await window.ipcRenderer.invoke('start-task-setting', taskUrl);
			if (status) {
				navigate(`/setting?taskurl=${taskUrl}`)
				setOpen(false)
			} else if (!status && num) {
				messageApi.open({
					type: 'warning',
					content: '只能启动一个服务',
				});
			} else {
				messageApi.open({
					type: 'error',
					content: '服务启动失败',
				});
			}
		} else {
			messageApi.open({
				type: 'error',
				content: '页面URL不合法！！！',
			});
		}

	}
	const handleCancel = () => {
		setOpen(false)
	}
	const onUrlChange = (e) => {
		setTaskUrl(e.target.value)
	}
	const onClearCache = () => {
		window.ipcRenderer.send('close-task-setting')
	}
	return (
		<>
			{contextHolder}
			<Layout>
				<Header className="layout-header">
					<Button onClick={onClearCache} className="mr-12"> 清除缓存 </Button>
					<Button onClick={onCreateTask}> 新建任务</Button>
				</Header>
				<Divider>任务列表</Divider>
				<Content>
					<Table columns={columns} dataSource={data} />
				</Content>
			</Layout>
			<Modal
				open={open}
				title="新建任务"
				onOk={handleOk}
				onCancel={handleCancel}
				maskClosable={false}
				keyboard={false}
				footer={(_, { OkBtn, CancelBtn }) => (
					<>
						<OkBtn />
					</>
				)}
			>
				<Input placeholder="页面URL" value={taskUrl} onChange={onUrlChange}></Input>
			</Modal>
		</>
	);
});