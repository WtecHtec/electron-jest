
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Tooltip, Space, Divider, Select, Input, InputNumber, Button } from 'antd'
import $ from 'jquery';

import { getXpathByParentLevel } from '../../../common/utils/xpath';

const { Option } = Select;
const REG_EXP = /(\[\d+\])$/
const REPLACE_TEXT = '[$index]'
const REPLACE_VALUE = '$index'

const PICK_TYPE = {
  'pick_text': (el)=> el.text(),
  'pick_src': (el)=> el.attr('src'),
  'pick_href': (el)=> el.attr('href'),
}
const OptPickItem = forwardRef((props, ref) => {
	const [pickData, setPickData] = useState({ pickType: 'pick_text', pickMethod: 'itself', pickLevel: 0 })
  const [checkResult, setCheckResult] = useState([])
  const { xpath } = props
	useImperativeHandle(ref, () => {
		return {
			pickData
		}
	})

  useEffect(() => {
    setCheckResult([])
  }, [xpath])
  

	const onPickTypeSelect = (value) => {
		setPickData({
			...pickData,
			pickType: value,
		})
	}
	// const onPickDescChange = (e) => {
	// 	setPickData({
	// 		...pickData,
	// 		pickDesc: e.target.value,
	// 	})
	// }
  const onPickMethodSelect = (value) => {
    setPickData({
			...pickData,
			pickMethod: value,
		})
  }

  const onPickLevelChange = (value) => {
    setPickData({
			...pickData,
			pickLevel: value,
		})
  }

  const onCheckEl = ()=> {
    let  levelXpath = getXpathByParentLevel(xpath, pickData.pickLevel)
     console.log("levelXpath:::", levelXpath)
    if (levelXpath && REG_EXP.test(levelXpath)) {
      try {
        const fixXpath = xpath.split(levelXpath)[1]
        levelXpath = levelXpath.replace(REG_EXP, REPLACE_TEXT)
        console.log('levelXpath, fixXpath', levelXpath, fixXpath)
        const result =  getPickDataByLoop(levelXpath, fixXpath, 5, pickData.pickType)
        setCheckResult(result)
        setPickData({
          ...pickData,
          levelXpath,
          fixXpath,
        })
      } catch (error) {
        console.log('onCheckEl----', error)
      }
    }
  }

  
  const getPickDataByLoop = (parentXpath, fixXpath, count, pickType) => {
    let checkXPath = ''
    const result = []
    let el = null
    let checkPath = ''
    while(count) {
      checkXPath = parentXpath.replace(REPLACE_VALUE, count)
      if (typeof PICK_TYPE[pickType] === 'function') {
        checkPath = `${checkXPath}${fixXpath}`
        el = document.evaluate(checkPath, document).iterateNext()
        result.push(PICK_TYPE[pickType]($(el))) 
      }
      count = count - 1
    }
    return result
  }

	return <>
		{/* <Divider dashed></Divider>
		<Space.Compact block style={{ alignItems: 'center' }}>
			<Tooltip placement="top" title={<span>设置描述,方便查找</span>}>
				<span style={{ flexShrink: 0 }}>采集描述:</span>
			</Tooltip>
			<Input style={{ flex: 1 }} onChange={onPickDescChange} value={pickData.pickDesc} />
		</Space.Compact> */}
		<Divider dashed></Divider>
		<Space.Compact block style={{ alignItems: 'center' }}>
			<Tooltip placement="top" title={<span>采集元素内容,如:text采集容器纯文本</span>}>
				<span style={{ flexShrink: 0 }}>采集内容：</span>
			</Tooltip>
			<Select defaultValue="pick_text" style={{ flex: 1 }} value={pickData.pickType} onSelect={onPickTypeSelect} >
				<Option value="pick_text">text</Option>
				{/* <Option value="pick_html">html</Option> */}
				<Option value="pick_src">src</Option>
				<Option value="pick_href">href</Option>
			</Select>
		</Space.Compact>
    <Divider dashed></Divider>
		<Space.Compact block style={{ alignItems: 'center' }}>
			<Tooltip placement="top" title={<span>采集当前元素\采集某个列表下当前元素,配合循环采集使用</span>}>
				<span style={{ flexShrink: 0 }}>采集方式：</span>
			</Tooltip>
			<Select defaultValue="itself" style={{ flex: 1 }} value={pickData.pickMethod} onSelect={onPickMethodSelect} >
				<Option value="itself">自身</Option>
				{/* <Option value="pick_html">html</Option> */}
				<Option value="list">列表</Option>
			</Select>
		</Space.Compact>
    {
      pickData.pickMethod === 'list' && <>
        <Divider dashed></Divider>
        <Space.Compact block style={{ alignItems: 'center' }}>
          <Tooltip placement="top" title={<span>设置哪个父级下元素</span>}>
            <span style={{ flexShrink: 0 }}>层级：</span>
          </Tooltip>
          <InputNumber style={{ flex: 1 }} min={0} defaultValue={0} value={pickData.pickLevel} onChange={onPickLevelChange} />
          <Button onClick={onCheckEl}>检测</Button>
        </Space.Compact>
        <Divider dashed></Divider>
        <h2 style={{ color: '#333333'}}>检测结果:</h2> 
        {
          checkResult.length > 0 ? checkResult.map((item, index) => <div key={index}>
            <Divider dashed></Divider>
            <p style={{ color:'#333333'}}>{item}</p>
          </div>) : <h4 style={{ color: '#FA5151'}}>没有检测到数据！【点击检测】</h4>
        }
      </>
    }
	</>
})

export default OptPickItem