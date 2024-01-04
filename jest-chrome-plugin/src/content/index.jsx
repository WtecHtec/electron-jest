import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './content.css'
import MainModal from '@/content/components/mainModal'

function Content() {
    const [mainModalVisiable, setMainModalVisiable] = useState(false)
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

// 创建id为CRX-container的div
const app = document.createElement('div')
app.id = 'CRX-container'
// 将刚创建的div插入body最后
document.body.appendChild(app)
// 将ReactDOM插入刚创建的div
const crxContainer = ReactDOM.createRoot(
    document.getElementById('CRX-container')
)
crxContainer.render(<Content />)

// 向目标页面驻入js
try {
    let insertScript = document.createElement('script')
    insertScript.setAttribute('type', 'text/javascript')
    insertScript.src = window.chrome.runtime.getURL('insert.js')
    document.body.appendChild(insertScript)
} catch (err) {}
