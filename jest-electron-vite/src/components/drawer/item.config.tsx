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

export const NEW_PAGE_DATAS = [
  {
		label: '处理事件:',
		sublabel: '获取新页面',
	},
  ...BASE_CONFIG,
]

export const OPT_EXISTS_DATAS = [
  {
		label: '处理事件:',
		sublabel: '检查元素是否存在',
	},
  ...BASE_CONFIG,
  {
		label: '检查方式:',
		sublabel: true,
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.existsData.pickMethod', '')
		}
	},
]

export const LOGIC_CONDITION = [
  {
		label: '处理事件:',
		sublabel: '条件判断',
	},
  {
		label: '👈:',
		sublabel: '判断条件,仅支持一个节点【自定义事件、校验、是否存在】',
	},
  {
		label: '👉:',
		sublabel: '结果为:假,执行右边流程',
	},
  {
		label: '👇:',
		sublabel: '结果为:真,执行下边流程',
	},
]

export const LOGIC_LIST = [
  {
		label: '处理事件:',
		sublabel: '任务队列',
	},
  {
		label: '👉:',
		sublabel: '任务队列流程,仅支持节点【单个任务队列】',
	},
  {
		label: '👇:',
		sublabel: '任务队列结束下一步',
	},
]


export const LOGIC_LIST_ITEM = [
  {
		label: '处理事件:',
		sublabel: '单个任务队列',
	},
  {
		label: '👉:',
		sublabel: '单个任务流程',
	},
  {
		label: '👇:',
		sublabel: '本次任务执行完, 下一个任务,仅支持节点【单个任务队列】',
	},
]
