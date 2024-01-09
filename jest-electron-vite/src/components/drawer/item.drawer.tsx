import React, { memo } from 'react';
import {  Space, Divider } from 'antd';
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
            { item.label && <span className="dr-left"> { item.label}</span> }
            { item.sublabel && <span className="dr-txt"> { typeof item.subformat === 'function' ? item.subformat(node, item) : item.sublabel}</span> }
          </Space.Compact>
          <Divider></Divider>
        </>
      })
    }
  </> 
});