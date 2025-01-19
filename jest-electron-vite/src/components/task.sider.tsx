
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
import HoverSvg from '../assets/hover.svg'
import BackSvg from '../assets/back.svg'
import CloseSvg from '../assets/close.svg'
import PdfSvg from '../assets/pdf.svg'
import ReloadSvg from '../assets/reload.svg'
import SelfdiySvg from '../assets/selfdiy.svg'
import NewSvg from '../assets/new.svg'
import ConditionSvg from '../assets/condition.svg'
import ListItemSvg from '../assets/list-item.svg'
import ListSvg from '../assets/list.svg'
import KeySvg from '../assets/keyboard.svg'
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
              fileType: 'json',
              savaPath: '',
              rename: ''
            }
          }
        }
      },
      {
        imgSrc: PdfSvg,
        disable: false,
        txt: '当前页面导出pdf',
        nodeType: 'logic_pdf',
        data: {
          type: 'logic_pdf',
          data: {
            logicsetting: {
              logicType: 'logic_pdf',
              waitTime: 0,
              savaPath: '',
              rename: ''
            }
          }
        }
      },
    ]
  },
  {
    label: '键盘事件',
    disable: false,
    children: [
      {
        imgSrc: KeySvg,
        txt: '键盘',
        nodeType: 'opt_keyboard',
        data: {
          type: 'opt_keyboard',
          data: {
            optsetting: {
              logicType: 'opt_keyboard',
              rename: '回车',
              waitTime: 1,
              keyType: "enter",
              inputData: {
                inputValue: "",
                inputType: "valueType"
              }
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
      {
        imgSrc: HoverSvg,
        disable: true,
        txt: '鼠标悬停',
        nodeType: 'opt_hover',
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
              loopcondition: '',
              loopBody: [],
              loopType: 'frequency',
              frequency: 5,
              selfFuncCode: '',
            }
          }
        }
      }, 
      {
        imgSrc: ListSvg,
        disable: false,
        txt: '任务队列',
        nodeType: 'logic_list',
        data: {
          type: 'logic_list',
          data: {
            logicsetting: {
              logicType: 'logic_list',
              waitTime: 0,
              listBody: [],
            }
          }
        }
      },
      {
        imgSrc: ListItemSvg,
        disable: false,
        txt: '单个任务队列',
        nodeType: 'logic_listitem',
        data: {
          type: 'logic_listitem',
          data: {
            logicsetting: {
              logicType: 'logic_listitem',
              waitTime: 0,
              taskBody: [],
            }
          }
        }
      },
      {
        imgSrc: ConditionSvg,
        disable: false,
        txt: '条件判断',
        nodeType: 'logic_condition',
        data: {
          type: 'logic_condition',
          data: {
            logicsetting: {
              logicType: 'logic_condition',
              waitTime: 0,
              condition: [],
              noBody: [],
              yesBody: [],
            }
          }
        }
      }, 
      {
        imgSrc: SelfdiySvg,
        disable: false,
        txt: '自定义事件',
        nodeType: 'logic_func',
        data: {
          type: 'logic_func',
          data: {
            logicsetting: {
              logicType: 'logic_func',
              selfFuncCode: '',
              rename: '',
            }
          }
        }
      },
      {
        imgSrc: NewSvg,
        disable: false,
        txt: '获取最新页面',
        nodeType: 'logic_new_page',
        data: {
          type: 'logic_new_page',
          data: {
            logicsetting: {
              logicType: 'logic_new_page',
              waitTime: 1,
            }
          }
        }
      },
      {
        imgSrc: BackSvg,
        disable: false,
        txt: '返回上一页',
        nodeType: 'logic_back',
        data: {
          type: 'logic_back',
          data: {
            logicsetting: {
              logicType: 'logic_back',
              waitTime: 1,
            }
          }
        }
      },
      {
        imgSrc: ReloadSvg,
        disable: false,
        txt: '刷新当前页',
        nodeType: 'logic_reload',
        data: {
          type: 'logic_reload',
          data: {
            logicsetting: {
              logicType: 'logic_reload',
              waitTime: 1,
            }
          }
        }
      },
      {
        imgSrc: CloseSvg,
        disable: false,
        txt: '关闭当前页',
        nodeType: 'logic_close',
        data: {
          type: 'logic_close',
          data: {
            logicsetting: {
              logicType: 'logic_close',
              waitTime: 1,
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