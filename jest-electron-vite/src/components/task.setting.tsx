
import {  Layout, } from 'antd';
import TaskSider from './task.sider';
import TaskFlow from "./task.flow";
import { nodes, edges } from './data.test'
const { Content, Sider } = Layout;
function TaskSetting() {
  return (
    <Layout style={{height: '100%'}}>
      <Sider width={280} style={{background: 'rbga(0,0,0,0.02)', padding: '12px'}}  theme="light">
        <TaskSider></TaskSider>
      </Sider>
      <Content>
        <TaskFlow nodes={nodes} edges={edges}></TaskFlow>
      </Content>
    </Layout>
   
  );
}
export default TaskSetting