import { useEffect, useState } from 'react'
import {  Layout, } from 'antd';
import { useSearchParams   } from "react-router-dom";

import TaskSider from './task.sider';
import TaskFlow from "./task.flow";

// import { nodes, edges } from './data.test'
const { Content, Sider } = Layout;
function TaskSetting() {
  
  const [params]= useSearchParams()
  
  // console.log('taskurl---', )
  const nodes = [	{
		id: 'jest_0',
		type: 'start',
		data: {
			url: params.get('taskurl')
		},
		position: { x: 250, y: 0 },
	},]
  const [newNodes, setNewNodes] = useState(nodes)
  const [newEdges, setNewEdges] = useState<any>([])
  useEffect(() => {
    const getData = async (filepath) => {
      const data = await window.ipcRenderer.invoke('task-detail', filepath);
      // console.log('data---', data)
      try {
        setNewNodes([...JSON.parse(data.nodes)])
        setNewEdges([...JSON.parse(data.edges)])
      } catch (error) {
        console.log(error)
      }
    }
    params.get('taskid') && params.get('filepath') && getData(params.get('filepath'))
    return () => {}
  }, [])
  return (
    <Layout style={{height: '100%'}}>
      <Sider width={280} style={{background: 'rbga(0,0,0,0.02)', padding: '12px'}}  theme="light">
        <TaskSider></TaskSider>
      </Sider>
      <Content>
        <TaskFlow nodes={newNodes} edges={newEdges}></TaskFlow>
      </Content>
    </Layout>
   
  );
}
export default TaskSetting