import React, { useState, useEffect, useCallback } from 'react'
import { Tooltip, message } from 'antd'
import './content.css'

import WsClient from './ws.client'

import TipsModal from '@/content/components/tipsModal'
import useInspector from '../common/hooks/useInspector'
import TaskDrawer from './components/taskDrawer'
import useRecevents from '../common/hooks/useRecevents'

import ICON01 from './images/icon-01.png'
import ICON02 from './images/icon-02.png'
import ICON03 from './images/icon-03.png'
import ICON04 from './images/icon-04.png'

function Main() {
  const [messageApi, contextHolder] = message.useMessage();
	const [mainModalVisiable, setMainModalVisiable] = useState(false)
  const [optType, setOptType] = useState('select')
	const [xPath, optRef, status] = useInspector()
  const [recRef] = useRecevents()
	console.log('xPath----', xPath, optRef, status)
	const [open, setOpen] = useState(false);
	const text = <span id="dom-inspector-root-jest-pro-tip-span"> 有惊喜！！ </span>

	useEffect(() => {
		// 初始化连接ws
		WsClient.getInstance()
	}, [])

	useEffect(() => {
		console.log('useEffect----', optRef.current.status, xPath, status)
		if (!optRef.current.status && !status && xPath && optType === 'select') {
			setOpen(true);
		}
	}, [status])

	const onClose = () => {
    if (optType === 'select') {
      optRef.current.status = true
	    setOpen(false);
    }
	};

  useEffect(() => {
    const handleBeforeunload = (event) => {
      sendRecData(optType)
    }
    window.addEventListener('beforeunload', handleBeforeunload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload)
    }
  }, [optType])

  const handleOptType = (type) => {
    if (optType === type) return
    setOptType(type)
    optRef.current.status = type === 'select'
    recRef.current.status = type === 'rec'
    document.getElementById('dom-inspector-root-jest-pro-overlay').innerHTML = ''
    sendRecData(type)
  }

  const sendRecData = (type) => {
    const { datas } = recRef.current
    if (type !== 'rec' && datas.length) {
      const wsclient = WsClient.getInstance()
      console.log('handleFinish----', wsclient.getStatus())
      if (wsclient.getStatus()) {
        wsclient.send(JSON.stringify(datas))
        recRef.current.datas = []
      } else {
        messageApi.open({
          type: 'error',
          content: '连接不上ws服务',
        });
      }
    }
  }

	return (
    <>
    	{contextHolder}
      <div className="CRX-content" id="dom-inspector-root-jest-pro-crx-content">
        <Tooltip placement="top" title={text} defaultOpen >
          <div
            id="dom-inspector-root-jest-pro-crx-tip"
            className="content-entry"
            onClick={() => {
              setMainModalVisiable(true);
              optRef.current.status = false;
              recRef.current.status = false;
              document.getElementById('dom-inspector-root-jest-pro-overlay').innerHTML = ''
            }}
          > </div>
          <img id="dom-inspector-root-jest-pro-crx-select-img" onClick={ ()=> handleOptType('select')} src={ optType === 'select' ? ICON04 : ICON03} className="CRX-content-select CRX-content-img"></img>
          <img id="dom-inspector-root-jest-pro-crx-rec-img" onClick={ ()=> handleOptType('rec')}  src={ optType === 'rec' ? ICON02 : ICON01} className=" CRX-content-rec CRX-content-img"></img>
        </Tooltip>
    
        {mainModalVisiable ? (
          <TipsModal
            onClose={() => {
              setMainModalVisiable(false);
              optRef.current.status = optType === 'select';
              recRef.current.status = optType === 'rec';
            }}
          />
        ) : null}
        <div></div>
        <TaskDrawer  onClose={onClose} open={open} xpath={xPath}></TaskDrawer>
      </div>
    </>
	)
}

export default Main