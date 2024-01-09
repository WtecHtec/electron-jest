import { getMutliLevelProperty } from "../../util"
export const END_DATAS = [
    {
      label: '退出流程',
    },
    {
      label: '该流程只会存在一个',
      color: '#FA5151',
    }
] 

export const START_DATAS = [
  {
    label: '打开页面：',
    sublabel: true,
    subformat: (node) => {
      return getMutliLevelProperty(node, 'data.url', '')
    }
  },
  {
    label: '该流程只会存在一个,不可删除。',
    color: '#FA5151',
  }
] 

export const CLICK_DATAS = [
  {
    label: '处理事件:',
    sublabel: '点击',
  },
  {
    label: '元素Xpath:',
    sublabel: true,
    subformat: (node) => {
      return getMutliLevelProperty(node, 'data.optsetting.xpath', '')
    }
  },
  {
    label: '等待响应时间(秒):',
    sublabel: true,
    subformat: (node) => {
      return getMutliLevelProperty(node, 'data.optsetting.waitTime', '')
    }
  },
  {
    label: '是否在新页面操作:',
    sublabel: true,
    subformat: (node) => {
      return getMutliLevelProperty(node, 'data.optsetting.clickData.isCurrentPage', '') == 1 ? '否' : '是'
    }
  },
]