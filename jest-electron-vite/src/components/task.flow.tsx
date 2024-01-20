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
import { useNavigate, useSearchParams } from "react-router-dom";

import NodeDrawer from './drawer';

import StartNode from '../flownode/start.node';
import LoopNode from '../flownode/loop.node';
import OptNode from '../flownode/opt.node';
import EndNode from '../flownode/end.node';
import ConditionNode from '../flownode/condition.node';
import ListNode from '../flownode/list.node';
import ListItemNode from '../flownode/list.item.node';

import './task.flow.css'
import { getMutliLevelProperty } from '../util';

const FLOW_TASK_MAP = {
  logic_loop: 'logic',
  logic_export: 'logic',
  logic_close: 'logic',
  logic_pdf: 'logic',
  logic_back: 'logic',
  logic_reload: 'logic',
  logic_func: 'logic',
  logic_new_page: 'logic',
  logic_condition: 'logic',
  logic_list: 'logic',
  logic_listitem: 'logic',
  opt_click: 'opt',
  opt_input: 'opt',
  opt_verify: 'opt',
  opt_pick: 'opt',
  opt_hover: 'opt',
  opt_exists: 'opt',
  start: 'start',
  end: 'end',
}

const getId = () => Math.random().toString(36).slice(2)

const TaskFlow = (porps) => {
	const navigate = useNavigate();
  const [params]= useSearchParams()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [messageApi, contextHolder] = message.useMessage();
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(porps.nodes || []);
	const [edges, setEdges, onEdgesChange] = useEdgesState(porps.edges || []);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const [nodeDrawer, setNodeDrawer] = useState({ title: 'Task Item', open: false, node: {} })
  const [reRun, setReRun] = useState(params.get('taskid') ? true : false)
  const [loading, setLoading] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)

  useEffect(() => {
    setNodes(porps.nodes)
    setEdges(porps.edges)
  }, [porps.nodes])

	useEffect(() => {
		console.log('task-flow-data----')
		const _onMessage = (_event, message) => {
			// console.log('task-flow-data----', message)
			try {
				const newNode = JSON.parse(message)
				// console.log('newNode---', nodes)
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
				setNodes(nds => nds.concat([{
					id: getId(),
					position: { x: reactFlowBounds.left, y: reactFlowBounds.top },
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
    const nodes = reactFlowInstance.getNodes()
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
    const fTarget = nodes.find(({id}) => id === target)
    const fSource = nodes.find(({id}) => id === source)
    if (sourceHandle === 'loopcondition') {
      if (!['logic_func', 'opt_verify', 'opt_exists'].includes(fTarget.type)) {
        messageApi.open({
          type: 'error',
          content: '不能连接该类型节点！！！',
        });
        return
      }
    } else if (sourceHandle === 'listbody') {
      if (!['logic_listitem'].includes(fTarget.type)) {
        messageApi.open({
          type: 'error',
          content: '不能连接该类型节点！！！',
        });
        return
      }
    } else if (fSource && fSource.type === 'logic_listitem' &&  sourceHandle === 'next'
      && fTarget && fTarget.type !== 'logic_listitem') {
        messageApi.open({
          type: 'error',
          content: '不能连接该类型节点！！！',
        });
        return
    }

		setEdges((eds) => addEdge(params, eds))
	}, [reactFlowInstance]);

	const nodeTypes = useMemo(() => ({
		start: StartNode,
		logic_loop: LoopNode,
    logic_condition: ConditionNode,
    logic_list:ListNode,
    logic_listitem: ListItemNode,
		opt_click: (porps) => <OptNode imgType="opt_click" {...porps} />,
		opt_input: (porps) => <OptNode imgType="opt_input" {...porps} />,
		opt_pick: (porps) => <OptNode imgType="opt_pick" {...porps} />,
		opt_verify: (porps) => <OptNode imgType="opt_verify" {...porps} />,
    opt_hover: (porps) => <OptNode imgType="opt_hover" {...porps} />,
    opt_exists: (porps) => <OptNode imgType="opt_exists" {...porps} />,
		logic_export: (porps) => <OptNode imgType="logic_export" {...porps} />,
    logic_pdf: (porps) => <OptNode imgType="logic_pdf" {...porps} />,
    logic_close: (porps) => <OptNode imgType="logic_close" {...porps} />,
    logic_back: (porps) => <OptNode imgType="logic_back" {...porps} />,
    logic_reload: (porps) => <OptNode imgType="logic_reload" {...porps} />,
    logic_func: (porps) => <OptNode imgType="logic_func" {...porps} />,
    logic_new_page: (porps) => <OptNode imgType="logic_new_page" {...porps} />,
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

	const handleRunning = () => {
		// console.log(JSON.stringify(edges))
		// console.log(nodes)
    // console.log(getTask(nodes, edges))
    if (checkExport(nodes)) {
      messageApi.open({
        type: 'warning',
        content: '导出流程选择导出位置！！',
      });
      return
    }

    if (checkLoopByNode(nodes, edges)) {
      messageApi.open({
        type: 'warning',
        content: '循环流程必须连接条件节点！！',
      });
      return
    }
    if (checkConditionByNode(nodes, edges)) {
      messageApi.open({
        type: 'warning',
        content: '条件判断流程必须连接条件节点！！',
      });
      return
    }
    // console.log(getTask(nodes, edges))
    window.ipcRenderer.send('task-running', {
      data: JSON.stringify(getTask(nodes, edges)),
    })
  }

  const checkExport = (nodes) => {
    const fd = nodes.find(item => item.type === 'logic_export' && getMutliLevelProperty(item, 'data.logicsetting.savaPath', '') === '')
    // console.log('fd---', fd)
    return !!fd
  }

  const checkLoopByNode = (nodes, edges) => {
    const fd = nodes.find(item => 
      item.type === 'logic_loop'
      && getMutliLevelProperty(item, 'data.logicsetting.loopType', '') === 'cooditionnode')
     if (fd) {
      const fed = edges.find(({sourceHandle}) => sourceHandle === 'loopcondition')
      return !fed
    }
     
    return false
  }

  const checkConditionByNode = (nodes, edges) => {
    const fd = nodes.find(item => 
      item.type === 'logic_condition')
     if (fd) {
      const fed = edges.find(({sourceHandle}) => sourceHandle === 'conditionbody')
      return !fed
    }
     
    return false
  }
  const getTask = (nodes, edges, node = null, type= '') => {
    const cache = {}
    let cacheKey = ''
    let current = node || nodes.find(item => item.type === 'start')
    const result: any[] = []
    if (!current) return result
    
    while(current) {
      result.push( {
        nodeType: FLOW_TASK_MAP[current.type],
        ...current.data
      } )
      const edge = edges.find(edg => {
        if ( current.type === 'logic_loop') {
          return edg.source === current.id && edg.sourceHandle === 'next'
        } else if (current.type === 'logic_list') {
          return edg.source === current.id && edg.sourceHandle === 'next'
        }
        return edg.source === current.id
      })
      if (!edge) {
        console.log(current, )
        return result
      }
      let { id, source, target,  sourceHandle, targetHandle, }  =  edge
      cacheKey = `${id}-${source}-${target}-${sourceHandle}-${targetHandle}`
      if (cache[cacheKey]) {
        console.log(' 有环 ')
        current = null
        return []
      }
      cache[cacheKey] = 1
      if (current.type !== 'logic_condition') {
        current = nodes.find(item => item.id === target)
      }
      if (current && current.type === 'logic_loop') {
        // 循环流程 loopBody
        const loopBody = edges.find(edg => edg.source === current.id && edg.sourceHandle === 'loopbody' )
        if (loopBody) {
          const node =  nodes.find(item => item.id === loopBody.target)
          if (node) {
            console.log('node---loop', node)
            current.data.logicsetting['loopBody'] = [ ...getTask(nodes, edges, node)]
          }
        }
        // 循环条件
        const loopType = getMutliLevelProperty(current, 'data.logicsetting.loopType', '') === 'cooditionnode'
        // console.log('loopType--', loopType)
        if (loopType) {
          const loopcondition = edges.find(edg => edg.source === current.id && edg.sourceHandle === 'loopcondition' )
          if (loopcondition) {
            const node =  nodes.find(item => item.id === loopcondition.target)
            if (node) {
              const tasks = getTask(nodes, edges, node)
              current.data.logicsetting['loopcondition'] = tasks.length ? [ tasks[0] ] : ''
            }
          }
        }
        
      } else if (current && current.type === 'logic_condition') {
        // 判断条件
        const loopcondition = edges.find(edg => edg.source === current.id && edg.sourceHandle === 'conditionbody' )
       console.log('loopcondition--', loopcondition)
        if (loopcondition) {
          const node =  nodes.find(item => item.id === loopcondition.target)
          if (node) {
            const tasks = getTask(nodes, edges, node)
            current.data.logicsetting['condition'] = tasks.length ? [ tasks[0] ] : ''
          }
        }

        // 假 流程 nobody 
        const nobody = edges.find(edg => edg.source === current.id && edg.sourceHandle === 'nobody' )
        if (nobody) {
          const node =  nodes.find(item => item.id === nobody.target)
          if (node) {
            const tasks = getTask(nodes, edges, node)
            current.data.logicsetting['noBody'] = [...tasks]
          }
        }

        // 真 流程 yesbody 
        const yesbody = edges.find(edg => edg.source === current.id && edg.sourceHandle === 'yesbody' )
        if (yesbody) {
          const node =  nodes.find(item => item.id === yesbody.target)
          if (node) {
            const tasks = getTask(nodes, edges, node)
            current.data.logicsetting['yesBody'] = [...tasks]
          }
        }
        current = null
    
      } else if (current && current.type === 'logic_list') {
        // 任务队列 listBody
        const listBody = edges.find(edg => edg.source === current.id && edg.sourceHandle === 'listbody' )
        if (listBody) {
          const node =  nodes.find(item => item.id === listBody.target)
          if (node) {
            console.log('node---loop', node)
            current.data.logicsetting['listBody'] = [ ...getTask(nodes, edges, node, 'list')]
          }
        }
      }
    }
    return result
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
  const onDeleteNode = (node) => {
    setEdges((els) => els.filter(el => el.source != node.id && el.target != node.id))
    setNodes((nds) => nds.filter(nd => nd.id !== node.id))
    setNodeDrawer({
      ...nodeDrawer,
      open: false,
    })
  }
  const onClose = (node) => {
    setNodeDrawer({
      ...nodeDrawer,
      open: false,
    })
    setNodes((nds) =>
      nds.map((nd) => {
        if (node.id === nd.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          nd.data =  {...node.data}
        }
        return nd;
    }));
  }

  const handlefinishSet = () => {
      setIsSaveModalOpen(true)
  }
  const handleSaveOk = () => {
    const item = nodes.find(item => item.type === 'start' )
    if (!item) {
      return
    }
    window.ipcRenderer.send('task-save', JSON.stringify({
      id: params.get('taskid') || getId(),
      taskdesc: params.get('taskdesc'),
      isupdate: !!params.get('taskid'),
      taskurl: item.data.url,
      taskdata: JSON.stringify({
        nodes: JSON.stringify(nodes),
        edges: JSON.stringify(edges),
        task: JSON.stringify(getTask(nodes, edges))
      })
    }))
    setIsSaveModalOpen(false)
  }
	return (
		<>
			{contextHolder}
			<div className="reactflow-wrapper" ref={reactFlowWrapper}>
				<div className="tools">
					<Button className="tools-btn" onClick={handlefinishSet}>保存任务</Button>
					<Button className="tools-btn" onClick={handleRunning}>立即执行</Button>
          {
            reRun && <Button  className="tools-btn"  loading={loading} onClick={onReRun}>开始设计</Button>
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
				<NodeDrawer title={nodeDrawer.title} open={nodeDrawer.open} node={nodeDrawer.node} onClose={onClose} onDelete={ onDeleteNode }></NodeDrawer>
				<Modal title="提示" open={isModalOpen} onOk={handleOk} cancelText="取消" okText="确定返回首页" onCancel={() => setIsModalOpen(false)}>
					<p>返回首页,当前页面操作将不会保存！</p>
				</Modal>
        <Modal title="提示" open={isSaveModalOpen} onOk={handleSaveOk} cancelText="取消" okText="确定保存" onCancel={() => setIsSaveModalOpen(false)}>
					<p>如果存在现有任务,该操作将会覆盖原有任务！</p>
				</Modal>
			</div>
		</>
	);
};

export default TaskFlow