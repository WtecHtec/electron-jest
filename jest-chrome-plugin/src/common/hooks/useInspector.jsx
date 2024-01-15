
import React, { useState, useEffect, useRef } from 'react'
import $ from 'jquery';


import { getMaxZIndex, createElement, addOverlay, getTouchMouseTargetElement } from '../utils/dom';
import { getXpath } from '../utils/xpath';
import { throttle } from '../utils/utils';

const EVENT = 'mousemove'
const KEY_UP_EVENT = 'keyup'
/** 最大 zindex  */
const maxZIndex = getMaxZIndex() + 1
// 操作maker(html 元素)
const optOverlay = createElement('div', {
  id: 'dom-inspector-root-jest-pro-overlay',
  style: `z-index: ${maxZIndex};`,
});
// 创建辅助元素，用于判断圈选器元素是否被缩放
const assistEle = createElement('div', {
  id: 'dom-inspector-root-jest-pro-scale',
  style: `pointer-events: none;
  visibility: hidden;
  width: 100px;
  height: 100px;
  position: absolute;
  top: -100px;`
});

/** 移除圈选蒙层 */
function _remove() {
  optOverlay.innerHTML = '';
}
    
function useInspector() {
  const [xPath, setXPath] = useState('')
  const [ refresh, setRefresh] = useState(-1)
  const optRef = useRef({
    status: true,
  })
  useEffect(() => {
    // 在 html 中加入而非 body，从而消除对 dom 的影响 及 mutationObserver 的频繁触发
    document.body && document.body.appendChild(optOverlay);
    document.body && document.body.appendChild(assistEle);
    // 当前操作 元素
    let currentTarget = null
    // 缓存 操作元素
    let _cachedTarget = null
    // 当前元素 xpath
    // let currentXpath = ''
    function _onMove(e) {
      // console.log('_onMove', e)
      if (!optRef.current.status) return
      const target = getTouchMouseTargetElement(e)
      if (target && optOverlay && optOverlay.contains(target)) return;
      currentTarget = target;
      if (currentTarget === _cachedTarget) return null;
      _remove()
      _cachedTarget = currentTarget
      addOverlay({
        target: target,
        root: optOverlay,
        assistEle: assistEle,
      });
      // currentXpath = getXpath(target, true)
      // setXPath(currentXpath)
    }
    const _throttleOnMove = throttle(_onMove, 300)
    document.body.addEventListener(EVENT, _throttleOnMove, {
      capture: true,
      passive: true,
    });

    function _onKeyUp(e) {
      console.log(e)
      if (e.keyCode === 81 && optRef.current.status) {
        console.log('currentTarget---', currentTarget)
        const currentXpath = getXpath(currentTarget, true)
        optRef.current.status = false
        setXPath(currentXpath)
        setRefresh(Math.random())
        console.log('_onKeyUp----')
        // setStatus(false)
       
      }
    }
    const _throttleOnKeyUp = throttle(_onKeyUp, 300)
    document.body.addEventListener(KEY_UP_EVENT, _throttleOnKeyUp)

    return () => {
      document.body.removeEventListener(EVENT, _throttleOnMove)
      document.body.removeEventListener(KEY_UP_EVENT, _throttleOnKeyUp)
    }
  }, [])
  return [xPath, optRef, optRef.current.status, refresh]
}

export default useInspector