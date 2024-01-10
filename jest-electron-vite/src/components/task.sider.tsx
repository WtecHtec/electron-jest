
import React, { memo } from 'react';
import { Collapse, Divider } from 'antd';
import './task.sider.css'

import StartSvg from '../assets/start.svg'
import ClickSvg from '../assets/click.svg'
import InputkSvg from '../assets/input.svg'
import PickSvg from '../assets/pick.svg'
import VerifySvg from '../assets/verify.svg'
import EndSvg from '../assets/end.svg'
import LoopSvg from '../assets/loop.svg'
import ExportSvg from '../assets/export.svg'

const NODE_DATAS = [
  {
    label: '常规',
    children: [
      {
        imgSrc: StartSvg,
        disable: true,
        txt: '开始',
        nodeType: 'start',
      },
      {
        imgSrc: EndSvg,
        disable: false,
        txt: '结束',
        nodeType: 'end',
        data: {}
      },
      {
        imgSrc: ExportSvg,
        disable: false,
        txt: '导出',
        nodeType: 'logic_export',
        data: {
          type: 'logic_export',
          data: {
            logicsetting: {
              logicType: 'logic_export',
              waitTime: 0,
              dataType: 'text',
              exportType: 'json',
              savaPath: '',
              rename: ''
            }
          }
        }
      },
    ]
  },
  {
    label: '元素操作',
    children: [
      {
        imgSrc: ClickSvg,
        disable: true,
        txt: '点击',
        nodeType: 'opt_click',
      },
      {
        imgSrc: InputkSvg,
        disable: true,
        txt: '输入',
        nodeType: 'opt_input',
      },
      {
        imgSrc: PickSvg,
        disable: true,
        txt: '采集',
        nodeType: 'opt_pick',
      },
      {
        imgSrc: VerifySvg,
        disable: true,
        txt: '校验',
        nodeType: 'opt_verify',
      },
    ]
  },
  {
    label: '逻辑',
    children:[
      {
        imgSrc: LoopSvg,
        disable: false,
        txt: '循环',
        nodeType: 'logic_loop',
        data: {
          type: 'logic_loop',
          data: {
            logicsetting: {
              logicType: 'logic_loop',
              waitTime: 0,
              loopBody: [],
              loopType: 'frequency',
              frequency: 5,
            }
          }
        }
      },
    ]
  },
  
]
export default memo(() => {
  const onDragStart = (event, data) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };
  return <>
  {
    NODE_DATAS.map(({ label, children}, index) => <> 
    <Collapse
      size="small"
      key={index} 
      defaultActiveKey={[index]}
      items={[
        {
          key: index,
          label: label,
          children: children.map(( item, kIndex) => {
            const { imgSrc, disable, txt, nodeType } = item
            return <>
              <div key={kIndex} className={`space-block ${ disable && 'disable'}`} onDragStart={(event) => !disable && onDragStart(event,  { nodeType,  item })} draggable>
                <img className="space-block-img" src={imgSrc}></img>
                <div className="space-block-txt">{txt}</div>
              </div>
            </>
          } ),
        },
      ]}
    />
    <Divider></Divider>
  </>)
  }
   <Collapse
      size="small"
      items={[
        {
          key: '1',
          label: '提示',
          children: <>
            <p>不支持再次编辑修改</p>
            <p>选择edge右击删除</p>
            <p><a href="https://juejin.cn/" target="_blank"> 详细文档</a></p>
          </>,
        },
      ]}
    />
  </>
})