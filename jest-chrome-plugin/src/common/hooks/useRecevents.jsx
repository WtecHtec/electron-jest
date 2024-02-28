import React, { useState, useEffect, useRef } from 'react'
import { getXpath, checkElByPlugin } from '../utils/xpath';
import { throttle } from '../utils/utils';

function useRecevents() {
  const optRef = useRef({
    status: false,
    datas: [],
  })


  useEffect(() => {

    function _onInput(event) {
      if (checkElByPlugin(event.target)) return
      const { status,  datas} = optRef.current
      let dlen = datas.length
      if (status) {
        console.log('_onInput---', event)
        // optRef.current.inputEls.add()
        const xpath = getXpath(event.target)
        const item = {
          type: 'opt_input',
          data: {
            optsetting: {
              optType: 'opt_input',
              xpath,
              waitTime: 2,
              rename: '输入：' + event.target.value.slice(0, 8),
              inputData: {
                inputValue: event.target.value,
              }
            }
          }
        }
        if (datas[dlen -1]) {
          const { data: {  optsetting: { optType, xpath: dXpath } } } = datas[dlen -1]
          if (optType === 'opt_input' && dXpath === xpath) {
            datas[dlen -1] = item
            return
          } 
        } 
        datas.push(	item )
      }
    }
    const _throttleOnInput = throttle(_onInput, 10)
    document.body.addEventListener('input', _throttleOnInput, {
      capture: true,
      passive: true,
    } )



    function _onClick(event) {
      if (checkElByPlugin(event.target)) return
      const { status,  datas} = optRef.current
      let dlen = datas.length
      if (status) {
        console.log('_onClick---', event)
        // optRef.current.inputEls.add()
        const xpath = getXpath(event.target)
        const item = {
          type: 'opt_click',
          data: {
            optsetting: {
              optType: 'opt_click',
              xpath,
              waitTime: 2,
              rename: '点击:' + event.target.innerText.slice(0, 8),
              clickData: {
                isCurrentPage: 1,
              }
            }
          }
        }
        if (datas[dlen -1]) {
          const { data: { optsetting: { optType, xpath: dXpath } } } = datas[dlen -1]
          if (optType === 'opt_click' && dXpath === xpath) {
            datas[dlen -1] = item
            return
          } 
        } 
        datas.push(	item )
      }
    }
    const _throttleOnClick = throttle(_onClick, 10)
    document.body.addEventListener('click', _throttleOnClick, {
      capture: true, 
      passive: true,
    })

    return () => {
      document.body.removeEventListener('input', _throttleOnInput)
      document.body.removeEventListener('click', _throttleOnClick)
    }
  }, [])
  return [optRef]
}

export default useRecevents