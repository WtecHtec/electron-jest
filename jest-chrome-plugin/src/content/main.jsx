import React, { useState } from 'react'
import './content.css'
import MainModal from '@/content/components/mainModal'
import useInspector from '../common/hooks/useInspector'

function Main() {
    const [mainModalVisiable, setMainModalVisiable] = useState(false)
    useInspector()
    return (
        <div className="CRX-content">
            <div
                className="content-entry"
                onClick={() => {
                    setMainModalVisiable(true)
                }}
            >  </div>
            {mainModalVisiable ? (
                <MainModal
                    onClose={() => {
                        setMainModalVisiable(false)
                    }}
                />
            ) : null}
        </div>
    )
}

export default Main