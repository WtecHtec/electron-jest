import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
const CodeModal = ({ code, open, onCode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [funcCode, setFuncCode] = useState(code) 
  useEffect(() => {
    if (open) { 
      setFuncCode(code)
    } 
    setIsModalOpen(open)
  }, [open])

  const handleCancel = () => {
    setIsModalOpen(false);
    typeof onCode === 'function' && onCode(funcCode, false)
  };
  const onChangeFuncCode = (value) => {
    setFuncCode(value)
  }  
  return (
    <>
      <Modal title="函数体" open={isModalOpen} zIndex={999999} onCancel={ handleCancel } width={ 800 } keyboard={false} footer={null}>
      <CodeMirror
            value={funcCode}
            height="600px"
            extensions={[javascript()]}
            onChange={(value) => { onChangeFuncCode(value) }}
          />
      </Modal>
    </>
  );
};
export default CodeModal;