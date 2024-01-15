import React from 'react'
import ReactDOM from 'react-dom/client'
import Content from './main'
import $ from 'jquery';
// import { getMaxZIndex, createElement } from '../common/utils/dom';

// 创建id为CRX-container的div
const app = document.createElement('div')
app.id = 'dom-inspector-root-jest-pro-crx-container'
// 将刚创建的div插入body最后
document.body.appendChild(app)
// 将ReactDOM插入刚创建的div
const crxContainer = ReactDOM.createRoot(
    document.getElementById('dom-inspector-root-jest-pro-crx-container')
)
crxContainer.render(<Content />)

// 向目标页面驻入js
try {
    let insertScript = document.createElement('script')
    insertScript.setAttribute('type', 'text/javascript')
    insertScript.src = window.chrome.runtime.getURL('insert.js')
    document.body.appendChild(insertScript)
    $('body').css('cursor', 'pointer')
} catch (err) {}
