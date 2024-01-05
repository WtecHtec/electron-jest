import React, { useState, useEffect, useCallback } from 'react'
import { Tooltip, } from 'antd'
import './content.css'


import TipsModal from '@/content/components/tipsModal'
import useInspector from '../common/hooks/useInspector'
import TaskDrawer from './components/taskDrawer'
function Main() {
    const [mainModalVisiable, setMainModalVisiable] = useState(false)
    const [ xPath, optRef, status ]  = useInspector()
    console.log('xPath----', xPath, optRef, status)
    const [open, setOpen] = useState(false);
    const text = <span> 有惊喜！！ </span>

    
    useEffect(() => {
      console.log('useEffect----', optRef.current.status, xPath, status)
      if (!optRef.current.status && !status && xPath) {
        setOpen(true);
      }
    }, [status])

    const onClose = useCallback(() => {
      optRef.current.status = true
      setOpen(false);
    }) ;
  
    return (
        <div className="CRX-content">
          <Tooltip placement="top" title={text} defaultOpen>
            <div
                  className="content-entry"
                  onClick={() => {
                      setMainModalVisiable(true)
                  }}
              >  </div>
          </Tooltip>
            {mainModalVisiable ? (
                <TipsModal
                    onClose={() => {
                        setMainModalVisiable(false)
                        // optRef.current.status = true
                    }}
                />
            ) : null}
            <TaskDrawer onClose={ onClose } open={open} xpath={ xPath }></TaskDrawer>
        </div>
    )
}

export default Main