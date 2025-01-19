import React, { memo, useState } from 'react';
import {  Space, Divider, InputNumber, Input, Radio, Select } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
export default memo(({ node, datas}) => {
  // const datas = [
  //   {
  //     label: '退出流程',
  //     sublabel: '',
  //     color: '',
  //     subformat: () => {}
  //   },
  //   {
  //     label: '该流程只会存在一个',
  //     sublabel: '',
  //     color: '#FA5151',
  //     subformat: () => {}
  //   }
  // ]
  const [ refresh, setRefresh] = useState(-1)
  return <>
    {
      datas.map((item) => {
        return <>
          <Space.Compact  block style={{ alignItems: 'center', color: item.color || '#333333'  }}>
            { !!item.label && <span className="dr-left"> { item.label}</span> }
            { !item.edit ?
               <span className="dr-txt"> { typeof item.subformat === 'function' ? item.subformat(node, item) : item.sublabel}</span>
              : <>
                {
                  item.valType === 'number' && <InputNumber style={{ width: 200 }} min={1} defaultValue={ item.subformat(node, item) }  onChange={ (e) => item.valChange(e, node )} ></InputNumber>
                }
                {
                   item.valType === 'select'   && <Select  
                   defaultValue={item.subformat(node, item)} onSelect={(e) =>   {
                    item.valChange(e, node )
                    // node.data.optsetting.inputData.inputType = e
              
                  } } >
                    {
                      item.selectOptions.map((item) => {
                        return <Option value={item.value}>{item.label}</Option>
                      })
                    }
                  {/* <Option value="valueType">赋值</Option>
                  <Option value="paramType">参数</Option> */}
                </Select>
                }
                {
                  item.valType === 'text' && 	<TextArea rows={4} defaultValue={item.subformat(node, item)} onChange={(e) => {
                    // setRefresh(Math.random)
                    // console.log('onchange----', e)
                    item.valChange(e, node )
                  }} />
                } {
                  item.valType === 'radio' &&  
                  <Radio.Group onChange={(e) => { item.valChange(e, node ) }} defaultValue={item.subformat(node, item)}>
                    <Radio value={1}>否</Radio>
                    <Radio value={2}>是</Radio>
                  </Radio.Group>
                }
              </>
            }
          </Space.Compact>
          <Divider></Divider>
        </>
      })
    }
  </> 
});