import { getMutliLevelProperty } from "../../util"

const INPUT_BASE_CONFIG = [
	{
		label: '操作描述:',
		sublabel: true,
    edit: true,
    valType: 'text',
    valChange: (e, node) => {
      node.data.optsetting.rename = e.target.value
    },
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
	// {
	// 	label: '打开页面：',
	// 	sublabel: true,
	// 	subformat: (node) => {
	// 		return getMutliLevelProperty(node, 'data.url', '')
	// 	}
	// },
	...INPUT_BASE_CONFIG,
	{
		label: '类型:',
		sublabel: true,
    edit: true,
    valType: 'select',
	selectOptions: [
		{
			label: '网页',
			value: 'web'
		},
		{
			label: '指令',
			value: 'command'
		}
	],
    valChange: (e, node) => {
      node.data.optsetting.handleType = e
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.handleType', 'web')
		}
	},
	{
		label: '操作内容:',
		sublabel: true,
    edit: true,
    valType: 'text',
    valChange: (e, node) => {
      node.data.optsetting.command = e.target.value
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.command', '')
		},
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
	...INPUT_BASE_CONFIG,

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
    edit: true,
    valType: 'radio',
    valChange: (e, node) => {
      node.data.optsetting.clickData.isCurrentPage = e.target.value
    },
		subformat: (node) => {
			// return getMutliLevelProperty(node, 'data.optsetting.clickData.isCurrentPage', '') == 1 ? '否' : '是'
      return getMutliLevelProperty(node, 'data.optsetting.clickData.isCurrentPage', '')
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
		label: '输入类型:',
		sublabel: true,
    edit: true,
    valType: 'select',
	selectOptions: [
		{
			label: '赋值',
			value: 'valueType'
		},
		{
			label: '参数',
			value: 'paramType'
		}
	],
    valChange: (e, node) => {
      node.data.optsetting.inputData.inputType = e
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.inputData.inputType', 'valueType')
		}
	},
	{
		label: '内容:',
		sublabel: true,
    edit: true,
    valType: 'text',
    valChange: (e, node) => {
      node.data.optsetting.inputData.inputValue = e.target.value
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.inputData.inputValue', '')
		},
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
  {
		label: '重试次数:',
		sublabel: true,
    edit: true,
    valType: 'number',
    valChange: (e, node) => {
      node.data.optsetting.existsData.retryCount = e
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.existsData.retryCount', 1)
		}
	},
  {
		label: '重试间隔(秒):',
		sublabel: true,
    edit: true,
    valType: 'number',
    valChange: (e, node) => {
      node.data.optsetting.existsData.retryInterval = e
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.existsData.retryInterval', 1)
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

export const OPT_KEYBOARD_DATAS = [
	{
		label: '处理事件:',
		sublabel: '按键操作',
	},
	...INPUT_BASE_CONFIG,
	{
		label: '按键类型:',
		sublabel: true,
    edit: true,
    valType: 'select',
	itemtype: 'opt_keyboard',
	selectOptions: [
		{
			label: '回车',
			value: 'enter'
		},
		{
			label: 'ESC',
			value: 'esc'
		},
		{
			label: 'TAB',
			value: 'tab'
		},
		{
			label: '输入',
			value: 'input'
		},
		{
			label: '搜索',
			value: 'sreach'
		},
		{
			label: '快捷键',
			value: 'shortcut'
		},
	],
		valChange: (e, node) => {
			node.data.optsetting.keyType = e
		},
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.keyType', 'enter')
		}
	},
	{
		label: '类型:',
		sublabel: true,
    edit: true,
    valType: 'select',
	selectOptions: [
		{
			label: '无操作',
			value: 'none'
		},
		{
			label: '赋值',
			value: 'valueType'
		},
		{
			label: '参数',
			value: 'paramType'
		},
		
	],
    valChange: (e, node) => {
      node.data.optsetting.inputData.inputType = e
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.inputData.inputType', 'valueType')
		}
	},
	{
		label: '内容:',
		sublabel: true,
    edit: true,
    valType: 'text',

    valChange: (e, node) => {
      node.data.optsetting.inputData.inputValue = e.target.value
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.inputData.inputValue', '')
		},
	},
]



export const OPT_MOUSE_DATAS = [
	{
		label: '处理事件:',
		sublabel: '应用操作',
	},
	...INPUT_BASE_CONFIG,
	{
		label: '类型:',
		sublabel: true,
    edit: true,
    valType: 'select',
	selectOptions: [
		// {
		// 	label: '单个单词',
		// 	value: 'singleWord'
		// },
		// {
		// 	label: '文本行',
		// 	value: 'textLine'
		// },
		{
			label: '鼠标移动',
			value: 'mousemove'
		},
		{
			label: '鼠标左击',
			value: 'mouseleftclick'
		},
		{
			label: '左键双击',
			value: 'mousedoubleleftclick'
		},
		{
			label: '鼠标右击',
			value: 'mouserightclick'
		},
		{
			label: '右键双击',
			value: 'mousedoublerightclick'
		},
		{
			label: '向下滚动',
			value: 'scrollDown'
		},
		{
			label: '向上滚动',
			value: 'scrollUp'
		},
	],
		valChange: (e, node) => {
			node.data.optsetting.mouseType = e
		},
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.mouseType', 'mouseleftclick')
		}
	},
	{
		label: '内容:',
		sublabel: true,
    edit: true,
    valType: 'text',

    valChange: (e, node) => {
      node.data.optsetting.inputData.inputValue = e.target.value
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.inputData.inputValue', '')
		},
	},
]


export const LOGIC_API_INTERCEPT_REQUEST = [

	{
		label: '接口链接:',
		sublabel: true,
    edit: true,
    valType: 'text',
    valChange: (e, node) => {
      node.data.logicsetting.api_url = e.target.value
    },
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.logicsetting.api_url', '')
		}
	},
]


export const LOGIC_FETCH_REQUEST = [
	{
		label: '发起接口请求链接:',
			sublabel: true,
			edit: true,
			valType: 'text',
			valChange: (e, node) => {
			node.data.logicsetting.api_url = e.target.value
			},
				subformat: (node) => {
					return getMutliLevelProperty(node, 'data.logicsetting.api_url', '')
				}},
		{
	label: '获取请求参数连接检测:',
		sublabel: true,
	edit: true,
	valType: 'text',
	valChange: (e, node) => {
	node.data.logicsetting.test_api_url = e.target.value
	},
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.logicsetting.test_api_url', '')
		}
}
]

export const OPT_UPLOAD_DATAS = [
	{
		label: '处理事件:',
		sublabel: '文件上传',
	},
	...BASE_CONFIG,
	{
		label: '路径类型:',
		sublabel: true,
		edit: true,
		valType: 'select',
		selectOptions: [
			{
				label: '赋值 (直接上传路径)',
				value: 'valueType'
			},
			{
				label: '参数 (变量提取)',
				value: 'paramType'
			}
		],
		valChange: (e, node) => {
			node.data.optsetting.uploadData.inputType = e
		},
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.uploadData.inputType', 'valueType')
		}
	},
	{
		label: '文件路径/变量:',
		sublabel: true,
		edit: true,
		valType: 'text',
		valChange: (e, node) => {
			node.data.optsetting.uploadData.inputValue = e.target.value
		},
		subformat: (node) => {
			return getMutliLevelProperty(node, 'data.optsetting.uploadData.inputValue', '')
		},
	},
]
