import React, { useCallback, useMemo, useState, useRef } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'react-flow-renderer';
import { Drawer, Button, Space, Divider } from 'antd';

import NodeDrawer from './drawer';

import StartNode from '../flownode/start.node';
import LoopNode from '../flownode/loop.node';
import OptNode from '../flownode/opt.node';
import EndNode from '../flownode/end.node';

import './task.flow.css'


const TaskFlow = (porps) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(porps.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(porps.edges || []);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeDrawer, setNodeDrawer] = useState({ title: 'Task Item', open: false, node: {}})

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const nodeTypes = useMemo(() => ({ 
    start: StartNode,
    logic_loop: LoopNode,
    opt_click: (porps) => <OptNode imgType="opt_click" {...porps} />,
    opt_input: (porps) => <OptNode imgType="opt_input" {...porps}  />,
    opt_pick: (porps) => <OptNode imgType="opt_pick" {...porps}  />,
    opt_verify: (porps) => <OptNode imgType="opt_verify" {...porps} />,
    logic_export: (porps) => <OptNode imgType="logic_export" {...porps} />,
    end: EndNode
  }), []);

  let id = 0;
  const getId = () => `jest_${id++}`;

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

    
  const onNodeClick = useCallback((event, node) =>{
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
    console.log(JSON.stringify(edges) )
  }
  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
      <div className="tools">
        <Button className="tools-btn" onClick={()=> {}}>完成设计</Button>
        <Button className="tools-btn" onClick={ getFlowDesc }>流程描述</Button>
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
      <NodeDrawer title={nodeDrawer.title} open={nodeDrawer.open} node={nodeDrawer.node} onClose={ () => {
        setNodeDrawer({
          ...nodeDrawer,
          open: false,
        })
      }}></NodeDrawer>
    </div>
  );
};

export default TaskFlow