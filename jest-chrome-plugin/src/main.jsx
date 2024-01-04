import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
// 引入Ant Design中文语言包
import zhCN from 'antd/locale/zh_CN'
// 全局样式
import '@/common/styles/frame.styl'
import Popup from '@/popup'
// 在popup页面调试content script，仅用于开发环境，build前记得要注释掉。
// import '@/content'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider locale={zhCN}>
        <Popup />
    </ConfigProvider>
)
