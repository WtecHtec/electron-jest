
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
  return (
    <Layout style={{height: '100%'}}>
      <Sider width={280} style={{background: 'rbga(0,0,0,0.02)', padding: '12px'}}  theme="light">
        <TaskSider></TaskSider>
      </Sider>
      <Content>
        <TaskFlow nodes={nodes} edges={[]}></TaskFlow>
      </Content>
    </Layout>
   
  );
}
export default TaskSetting