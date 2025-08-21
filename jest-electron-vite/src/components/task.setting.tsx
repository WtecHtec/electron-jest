import { useEffect, useState } from 'react'
import { Layout, Modal, message } from 'antd';
import { useSearchParams } from "react-router-dom";

import TaskSider from './task.sider';
import TaskFlow from "./task.flow";

// import { nodes, edges } from './data.test'
const { Content, Sider } = Layout;

function TaskSetting() {
  const [params] = useSearchParams()
  const [messageApi, contextHolder] = message.useMessage();
  const [taskparam, setTaskparam] = useState<any>({})
  
  // ... existing code ...
  const nodes = [{
    id: 'jest_0',
    type: 'start',
    data: {
      url: params.get('taskurl'),
      optsetting: {
        rename: '打开网页',
        handleType: 'web',
        waitTime: 1,
        command: params.get('taskurl')
      }
    },
    position: { x: 250, y: 0 },
  }]
  
  const [newNodes, setNewNodes] = useState(nodes)
  const [newEdges, setNewEdges] = useState<any>([])
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false)
  const [clipboardData, setClipboardData] = useState<any>(null)
  
  // 验证数据格式
  const validateFlowData = (data: any) => {
    try {
      console.log('validateFlowData data:::', data)
      if (!data || typeof data !== 'object') {
        return false;
      }
      
      // 检查是否包含必要的字段
      if (!data.nodes || !data.edges) {
        return false;
      }
       
      // 验证nodes格式
      if (!Array.isArray(JSON.parse(data.nodes))) {
        return false;
      }
      
      // 验证每个node的基本结构
      for (const node of JSON.parse(data.nodes)) {
        if (!node.id || !node.type || !node.position || !node.data) {
          return false;
        }
      }
      
      // 验证edges格式
      if (!Array.isArray(JSON.parse(data.edges))) {
        return false;
      }
      
      // 验证每个edge的基本结构
      for (const edge of JSON.parse(data.edges)) {
        if (!edge.id || !edge.source || !edge.target) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // 处理粘贴事件
  const handlePaste = async (event: ClipboardEvent) => {
    try {
      const clipboardText = event.clipboardData?.getData('text/plain');
      if (!clipboardText) {
        return;
      }
      
      const data = JSON.parse(clipboardText);
      
      if (validateFlowData(data)) {
        setClipboardData(data);
        setIsReplaceModalOpen(true);
      } else {
        messageApi.open({
          type: 'error',
          content: '粘贴的数据格式不符合规范，请检查数据格式！',
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '粘贴的数据格式错误，无法解析JSON！',
      });
    }
  }
  
  // 处理复制事件
  const handleCopy = async (event: ClipboardEvent) => {
    try {
      // 获取当前的流程数据
      const flowData = {
        nodes: newNodes,
        edges: newEdges,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      const dataString = JSON.stringify(flowData, null, 2);
      
      // 写入剪贴板
      await navigator.clipboard.writeText(dataString);
      
      messageApi.open({
        type: 'success',
        content: '流程数据已复制到剪贴板！',
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '复制失败，请重试！',
      });
    }
  }
  
  // 键盘事件处理
  const handleKeyDown = (event: KeyboardEvent) => {
    // Ctrl+V 或 Cmd+V (Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      // 阻止默认粘贴行为，使用自定义处理
      event.preventDefault();
      // 手动触发粘贴处理
      navigator.clipboard.readText().then(text => {
        try {
          const data = JSON.parse(text);
          if (validateFlowData(data)) {
            setClipboardData(data);
            setIsReplaceModalOpen(true);
          } else {
            messageApi.open({
              type: 'error',
              content: '粘贴的数据格式不符合规范，请检查数据格式！',
            });
          }
        } catch (error) {
          messageApi.open({
            type: 'error',
            content: '粘贴的数据格式错误，无法解析JSON！',
          });
        }
      }).catch(() => {
        messageApi.open({
          type: 'error',
          content: '无法读取剪贴板内容！',
        });
      });
    }
    
    // Ctrl+C 或 Cmd+C (Mac)
    // if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
    //   handleCopy(event as any);
    // }
  }
  
  // 确认替换流程
  const handleReplaceConfirm = () => {
    if (clipboardData) {
      setNewNodes([...JSON.parse(clipboardData.nodes)]);
      setNewEdges([...JSON.parse(clipboardData.edges)]);
       setTaskparam(clipboardData.taskparam || "{}")
      
      setIsReplaceModalOpen(false);
      setClipboardData(null);
      
      messageApi.open({
        type: 'success',
        content: '流程已成功替换！',
      });
    }
  }
  
  // 取消替换
  const handleReplaceCancel = () => {
    setIsReplaceModalOpen(false);
    setClipboardData(null);
  }
  
  useEffect(() => {
    const getData = async (filepath) => {
      const data = await (window as any).ipcRenderer.invoke('task-detail', filepath);
      // console.log('data---', data)
      try {
        setNewNodes([...JSON.parse(data.nodes)])
        setNewEdges([...JSON.parse(data.edges)])
      } catch (error) {
        console.log(error)
      }
    }
    params.get('taskid') && params.get('filepath') && getData(params.get('filepath'))
    
    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('paste', handlePaste);
    
    return () => {
      // 清理事件监听
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('paste', handlePaste);
    }
  }, [])
  
  return (
    <>
      {contextHolder}
      <Layout style={{height: '100%'}}>
        <Sider width={280} style={{overflow: 'auto', background: 'rbga(0,0,0,0.02)', padding: '12px'}} theme="light">
          <TaskSider></TaskSider>
        </Sider>
        <Content>
          <TaskFlow nodes={newNodes} edges={newEdges} taskparam={taskparam}></TaskFlow>
        </Content>
      </Layout>
      
      {/* 替换确认弹窗 */}
      <Modal 
        title="确认替换流程" 
        open={isReplaceModalOpen} 
        onOk={handleReplaceConfirm} 
        onCancel={handleReplaceCancel}
        okText="确认替换"
        cancelText="取消"
      >
        <p>检测到有效的流程数据，是否要替换当前的流程？</p>
        <p style={{color: '#ff4d4f', fontSize: '12px'}}>注意：此操作将覆盖当前所有未保存的流程数据！</p>
      </Modal>
    </>
  );
}

export default TaskSetting