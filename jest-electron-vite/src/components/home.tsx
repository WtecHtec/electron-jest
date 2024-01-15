import React, { memo, useState, useEffect } from 'react';

import { Layout, Button, Divider, Table, Modal, Input, message, Popconfirm } from 'antd';
import { useNavigate } from "react-router-dom";
const { Header, Content, Footer } = Layout
const { TextArea } = Input;
export default memo((props) => {
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			render: (text) => <a>{text}</a>,
		},
		{
			title: '任务描述',
			dataIndex: 'taskdesc',
			key: 'taskdesc',
		},
		{
			title: '操作',
			key: 'action',
			render: (_, record) => (
				<div>
					<Button type="link" onClick={ ()=> onRunTask(record)}>执行任务</Button>
					<Button type="link" onClick={() =>  onUpdateTask(record)}>修改任务</Button>
          {/* <Button type="link" onClick={() =>  onDelTask(record)}>删除任务</Button> */}
          <Popconfirm title="是否确定删除?" onConfirm={() => onDelTask(record)}>
            <a>删除任务</a>
          </Popconfirm>
				</div>
			),
		},
	];

	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();
	const [open, setOpen] = useState(false)
	const [taskUrl, setTaskUrl] = useState('https://juejin.cn/')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskDatas, setTaskDatas] = useState<any>([])

  useEffect(() => {
    const getData = async () => {
      const data = await window.ipcRenderer.invoke('select-task-all');
      // console.log('data---', data)
      setTaskDatas([...data])
    }
    getData()
    return () => {}
  }, [])

  const onUpdateTask = (value) => {
    console.log(value)
    const { taskurl, taskdesc, id, filepath } =value
    navigate(`/setting?filepath=${filepath}&taskurl=${taskurl}&taskdesc=${taskdesc}&taskid=${id}`)
  }

  const onDelTask = async (value) => {
    const { id } = value
    console.log(id)
    await window.ipcRenderer.invoke('del-task-id', id);
    const data = await window.ipcRenderer.invoke('select-task-all');
    // console.log('data---', data)
    setTaskDatas([...data])
  }

  const onRunTask = (value) => {
    const { filepath } =value
    window.ipcRenderer.send('task-running', {
      filepath,
    })
  }
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
				navigate(`/setting?taskurl=${taskUrl}&taskdesc=${taskDesc}`)
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
  const onDescChange = (e) => {
    setTaskDesc(e.target.value)
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
					<Table columns={columns} dataSource={taskDatas} />
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
        <TextArea placeholder="任务描述" value={taskDesc} onChange={onDescChange} style={{marginTop: 12}}></TextArea>
			</Modal>
		</>
	);
});