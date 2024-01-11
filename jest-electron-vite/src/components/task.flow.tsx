import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import ReactFlow, {
	addEdge,
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	ReactFlowProvider,
} from 'react-flow-renderer';
import { Drawer, Button, Space, Divider, message, Modal } from 'antd';
import { useNavigate } from "react-router-dom";

import NodeDrawer from './drawer';

import StartNode from '../flownode/start.node';
import LoopNode from '../flownode/loop.node';
import OptNode from '../flownode/opt.node';
import EndNode from '../flownode/end.node';

import './task.flow.css'
import { getMutliLevelProperty } from '../util';


const getId = () => Math.random().toString(36).slice(2)

const TaskFlow = (porps) => {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [messageApi, contextHolder] = message.useMessage();
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(porps.nodes || []);
	const [edges, setEdges, onEdgesChange] = useEdgesState(porps.edges || []);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const [nodeDrawer, setNodeDrawer] = useState({ title: 'Task Item', open: false, node: {} })
  const [reRun, setReRun] = useState(false)
  const [loading, setLoading] = useState(false)

	useEffect(() => {
		console.log('task-flow-data----')
		const _onMessage = (_event, message) => {
			console.log('task-flow-data----', message)
			try {
				const newNode = JSON.parse(message)
				console.log('newNode---', nodes)
				setNodes(nds => nds.concat([{
					id: getId(),
					position: { x: 400, y: 400 },
					...newNode,
				}]))
			} catch (err) {
				console.log(err)
			}
		}
    const _onStatus = (_event, value) => { 
      setReRun(value)
    }
		window.ipcRenderer.on('task-flow-data', _onMessage)
    window.ipcRenderer.on('browser-close', _onStatus)
		return () => {
			console.log('ipcRenderer off')
			window.ipcRenderer.removeListener('task-flow-data', _onMessage)
      window.ipcRenderer.removeListener('browser-close', _onStatus)
			window.ipcRenderer.removeAllListeners('task-flow-data', 'browser-close')
		}
	}, [])

	const onConnect = useCallback((params) => {
		const edges = reactFlowInstance.getEdges()

		console.log('params===', params, edges)

		const { source, target, sourceHandle, targetHandle } = params
		if (edges.find(item => item.source === source && item.sourceHandle === sourceHandle)
			|| edges.find(item => item.target === target && item.targetHandle === targetHandle)) {
			messageApi.open({
				type: 'warning',
				content: '只允许一个流程',
			});
			return;
		}

		if (source === target) {
			messageApi.open({
				type: 'error',
				content: '不能连接自身！！！',
			});
			return
		}
		setEdges((eds) => addEdge(params, eds))
	}, [reactFlowInstance]);

	const nodeTypes = useMemo(() => ({
		start: StartNode,
		logic_loop: LoopNode,
		opt_click: (porps) => <OptNode imgType="opt_click" {...porps} />,
		opt_input: (porps) => <OptNode imgType="opt_input" {...porps} />,
		opt_pick: (porps) => <OptNode imgType="opt_pick" {...porps} />,
		opt_verify: (porps) => <OptNode imgType="opt_verify" {...porps} />,
		logic_export: (porps) => <OptNode imgType="logic_export" {...porps} />,
		end: EndNode
	}), []);


	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();
			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			let dragData = event.dataTransfer.getData('application/reactflow');
			// check if the dropped element is valid
			if (typeof dragData === 'undefined' || !dragData) {
				return;
			}

			dragData = JSON.parse(dragData)

			const { nodeType } = dragData
			const nodes = reactFlowInstance.getNodes()
			if (nodes.find((item) => item.type === 'end') && nodeType === 'end') {
				messageApi.open({
					type: 'warning',
					content: '只允许有一个结束流程',
				});
				return
			}
			const dataConfig = getMutliLevelProperty(dragData, 'item.data.data', {})
			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			console.log(dragData, dataConfig)
			const newNode = {
				id: getId(),
				type: nodeType,
				position,
				data: {
					...dataConfig,
				},
			};

			setNodes((nds) => nds.concat(newNode));
		},
		[reactFlowInstance]
	);


	const onNodeClick = useCallback((event, node) => {
		setNodeDrawer({
			title: '详情',
			open: true,
			node,
		})
	}, [])

	const onEdgeContextMenu = useCallback((event, edge) => {
		setEdges((els) => els.filter(el => el.id != edge.id))
	}, [])
	const getFlowDesc = () => {
		console.log(JSON.stringify(edges))
		console.log(nodes)
	}
	const goBackRouter = () => {

		setIsModalOpen(true)
	}
	const handleOk = () => {
		window.ipcRenderer.send('close-task-setting')
		setIsModalOpen(false)
		navigate('/')
	}
  const onReRun = async () => {
    setLoading(true)
    const item = nodes.find(item => item.type === 'start' )
    const [status, num] = await window.ipcRenderer.invoke('start-task-setting', item?.data.url);
    setLoading(false)
    if (status) {
      messageApi.open({
        type: 'success',
        content: '重启成功',
      });
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
  }
	return (
		<>
			{contextHolder}
			<div className="reactflow-wrapper" ref={reactFlowWrapper}>
				<div className="tools">
					<Button className="tools-btn" onClick={() => { }}>完成设计</Button>
					<Button className="tools-btn" onClick={getFlowDesc}>流程描述</Button>
          {
            reRun && <Button  className="tools-btn"  loading={loading} onClick={onReRun}>重启服务</Button>
          }
					<Button className="tools-btn" onClick={goBackRouter}>返回首页</Button>
				</div>
				<ReactFlowProvider>
					<ReactFlow
						nodeTypes={nodeTypes}
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onInit={setReactFlowInstance}
						onDragOver={onDragOver}
						onDrop={onDrop}
						onNodeClick={onNodeClick}
						onEdgeContextMenu={onEdgeContextMenu}
						fitView
						attributionPosition="top-right"
						deleteKeyCode={null}
						selectionKeyCode={null}
						multiSelectionKeyCode={null}
					>
						<MiniMap
							nodeBorderRadius={5}
						/>
						<Controls />
						<Background color="#aaa" gap={16} />
					</ReactFlow>
				</ReactFlowProvider>
				<NodeDrawer title={nodeDrawer.title} open={nodeDrawer.open} node={nodeDrawer.node} onClose={() => {
					setNodeDrawer({
						...nodeDrawer,
						open: false,
					})
				}}></NodeDrawer>
				<Modal title="提示" open={isModalOpen} onOk={handleOk} cancelText="取消" okText="确定返回首页" onCancel={() => setIsModalOpen(false)}>
					<p>返回首页,当前页面操作将不会保存！</p>
				</Modal>
			</div>
		</>
	);
};

export default TaskFlow