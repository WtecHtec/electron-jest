
import React, { useState, useEffect } from 'react'
import { getMaxZIndex, createElement, addOverlay, getXpath, getTouchMouseTargetElement } from '../utils/dom';
import { throttle } from '../utils/utils';
const EVENT = 'mousemove'
/** 最大 zindex  */
const maxZIndex = getMaxZIndex() + 1
// 操作maker(html 元素)
const optOverlay = createElement('div', {
  id: 'dom-inspector-root',
  style: `z-index: ${maxZIndex};`,
});
// 创建辅助元素，用于判断圈选器元素是否被缩放
const assistEle = createElement('div', {
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
  useEffect(() => {
    // 在 html 中加入而非 body，从而消除对 dom 的影响 及 mutationObserver 的频繁触发
    document.body && document.body.appendChild(optOverlay);
    document.body && document.body.appendChild(assistEle);
    // 当前操作 元素
    let currentTarget = null
    // 缓存 操作元素
    let _cachedTarget = null
    // 当前元素 xpath
    let currentXpath = ''
    function _onMove(e) {
      console.log('_onMove', e)
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
    return () => {
      document.body.removeEventListener(EVENT, _throttleOnMove)
    }
  }, [])
  return [xPath]
}

export default useInspector