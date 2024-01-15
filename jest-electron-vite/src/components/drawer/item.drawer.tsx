import React, { memo } from 'react';
import {  Space, Divider, InputNumber, Input } from 'antd';
const { TextArea } = Input;
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
                  item.valType === 'text' && 	<TextArea rows={4} value={item.subformat(node, item)} onChange={(e) => item.valChange(e, node )} />
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