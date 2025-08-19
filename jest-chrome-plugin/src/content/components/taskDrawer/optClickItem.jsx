import {  forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Tooltip, Space, Divider, Radio, Select , InputNumber, Button} from 'antd'

import $ from 'jquery';

import { getXpathByParentLevel } from '../../../common/utils/xpath';

const REG_EXP = /(\[\d+\])$/
const REPLACE_TEXT = '[$index]'
const REPLACE_VALUE = '$index'

const OptClickItem = forwardRef((props, ref) => {

    const [checkResult, setCheckResult] = useState([])

  const [ clickData, setClickData ] = useState({ isCurrentPage: 1, })
   const { xpath } = props
  useImperativeHandle(ref, () => {
    // 在这里返回的内容，都可以被父组件的REF对象获取到
    return {
      clickData
    };
  });

   useEffect(() => {
    setCheckResult([])
  }, [xpath])

  const handelCurrentPage = (e) => {
    setClickData({
      ...clickData,
      isCurrentPage: e.target.value
    })
  }

  const onPickMethodSelect = (value) => {
    setClickData({
			...clickData,
			clickMethod: value,
		})
  }

    const onPickLevelChange = (value) => {
    setClickData({
			...clickData,
			clickLevel: value,
		})
  }

    const getPickDataByLoop = (parentXpath, fixXpath, count, pickType) => {
    let checkXPath = ''
    const result = []
    let el = null
    let checkPath = ''
    while(count) {
      checkXPath = parentXpath.replace(REPLACE_VALUE, count)
      checkPath = `${checkXPath}${fixXpath}`
      el = document.evaluate(checkPath, document).iterateNext()
      console.log("checkPath", checkPath)
      console.log("el:::", el)
      result.push($(el).html()) 
      count = count - 1
    }
    return result
  }


   const onCheckEl = ()=> {
    let  levelXpath = getXpathByParentLevel(xpath, clickData.clickLevel)
    console.log("levelXpath:::", levelXpath, clickData)
    if (levelXpath && REG_EXP.test(levelXpath)) {
      try {
        const fixXpath = xpath.split(levelXpath)[1]
        levelXpath = levelXpath.replace(REG_EXP, REPLACE_TEXT)
        console.log('levelXpath, fixXpath', levelXpath, fixXpath)
        const result =  getPickDataByLoop(levelXpath, fixXpath, 5, clickData.clickType)
        setCheckResult(result)
        setClickData({
          ...clickData,
          levelXpath,
          fixXpath,
        })
      } catch (error) {
        console.log('onCheckEl----', error)
      }
    }
  }

  return <>
    <Divider dashed></Divider>
    <Space.Compact  block style={{ alignItems: 'center'}}>
      <Tooltip placement="top" title={<span>该操作存在跳转到新页面,是否继续在当前页面操作</span>}>
        <span>操作页面：</span>
      </Tooltip>
      <Radio.Group style={{flex: 1}} value={ clickData.isCurrentPage} onChange={handelCurrentPage}>
        <Radio value={1}>当前页</Radio>
        <Radio value={2}>新页面</Radio>
      </Radio.Group>
    </Space.Compact>
    <Divider dashed></Divider>
		<Space.Compact block style={{ alignItems: 'center' }}>
			<Tooltip placement="top" title={<span>触发当前元素\采集某个列表下当前元素,配合循环采集使用</span>}>
				<span style={{ flexShrink: 0 }}>触发行为：</span>
			</Tooltip>
			<Select defaultValue="itself" style={{ flex: 1 }} value={clickData.clickMethod} onSelect={onPickMethodSelect} >
				<Option value="itself">自身</Option>
				{/* <Option value="pick_html">html</Option> */}
				<Option value="list">列表</Option>
			</Select>
		</Space.Compact>

        {
      clickData.clickMethod === 'list' && <>
        <Divider dashed></Divider>
        <Space.Compact block style={{ alignItems: 'center' }}>
          <Tooltip placement="top" title={<span>设置哪个父级下元素</span>}>
            <span style={{ flexShrink: 0 }}>层级：</span>
          </Tooltip>
          <InputNumber style={{ flex: 1 }} min={0} defaultValue={0} value={clickData.clickLevel} onChange={onPickLevelChange} />
          <Button onClick={onCheckEl}>检测</Button>
        </Space.Compact>
        <Divider dashed></Divider>
        <h2 style={{ color: '#333333'}}>检测结果:</h2> 
        {
          checkResult.length > 0 ? checkResult.map((item, index) => <div key={index}>
            <Divider dashed></Divider>
            <p style={{ color:'#333333', overflow: 'auto', whiteSpace: 'nowrap'}}>{item}</p>
          </div>) : <h4 style={{ color: '#FA5151'}}>没有检测到数据！【点击检测】</h4>
        }
      </>
    }
  </>
})

export default OptClickItem