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

const BASE_CONFIG = [
	{
		label: '元素Xpath:',
		sublabel: true,
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.xpath', '')
		}
	},
  {
		label: '操作描述:',
		sublabel: true,
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.rename', '')
		}
	},
	{
		label: '等待响应时间(秒):',
		sublabel: true,
    edit: true,
    valType: 'number',
    valChange: (e, node) => {
      node.data.optsetting.waitTime = e
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.waitTime', '')
		}
	},
]
export const CLICK_DATAS = [
	{
		label: '处理事件:',
		sublabel: '点击',
	},
	...BASE_CONFIG,
	{
		label: '是否在新页面操作:',
		sublabel: true,
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.clickData.isCurrentPage', '') == 1 ? '否' : '是'
		}
	},
]

export const INPUT_DATAS = [
	{
		label: '处理事件:',
		sublabel: '输入内容',
	},
	...BASE_CONFIG,
	{
		label: '输入数据:',
		sublabel: true,
    edit: true,
    valType: 'text',
    valChange: (e, node) => {
      node.data.optsetting.inputData.inputValue = e
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.inputData.inputValue', '')
		}
	},
]

export const VERIFY_DATAS = [
	{
		label: '处理事件:',
		sublabel: '校验数据',
	},
	...BASE_CONFIG,
	// {
	// 	label: '校验描述:',
	// 	sublabel: true,
	// 	subformat: (node) => {
	// 		return getMutliLevelProperty(node, 'data.optsetting.verifyData.rename', '')
	// 	}
	// },
	{
		label: '校验数据:',
		sublabel: true,
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.verifyData.verifyValue', '')
		}
	},
	{
		label: '校验提示类型:',
		sublabel: true,
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.verifyData.tipType', '')
		}
	},
]
export const PICK_DATAS = [
	{
		label: '处理事件:',
		sublabel: '采集数据',
	},
	...BASE_CONFIG,
	// {
	// 	label: '描述:',
	// 	sublabel: true,
	// 	subformat: (node) => {
	// 		return getMutliLevelProperty(node, 'data.optsetting.pickData.pickDesc', '')
	// 	}
	// },
	{
		label: '内容类型:',
		sublabel: true,
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.pickData.pickType', '')
		}
	},
	{
		label: '采集方式:',
		sublabel: true,
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.pickData.pickMethod', '')
		}
	},
]


export const HOVER_DATAS = [
  {
		label: '处理事件:',
		sublabel: '鼠标悬停',
	},
  ...BASE_CONFIG,
]