import React from 'react';

export const nodes = [
	{
		id: '1',
		type: 'start',
		data: {
			url: 'https://juejin.cn/'
		},
		position: { x: 250, y: 0 },
	},
	{
		id: '2',
		type: 'logic_loop',
		data: {

		},
		position: { x: 100, y: 100 },
	},
	{
		id: '3',
		type: 'opt_click',
		data: {
			optsetting: {
				optType: 'opt_click',
				xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/div[1]/header[1]/div[1]/nav[1]/ul[1]/li[1]/ul[1]/li[2]/a[1]',
				waitTime: 0,
				clickData: {
					isCurrentPage: 2,
				}
			}
		},
		position: { x: 400, y: 100 },
	},
	{
		id: '4',
		type: 'opt_input',
		position: { x: 250, y: 200 },
		data: {
			optsetting: {
				optType: 'opt_input',
				xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/div[1]/header[1]/div[1]/nav[1]/ul[1]/ul[1]/li[1]/ul[1]/li[1]/form[1]/input[1]',
				waitTime: 0,
				inputData: {
					inputValue: '测试输入',
				}
			}
		},
	},
	{
		id: '5',
		type: 'opt_pick',
		data: {
			optsetting: {
				optType: 'opt_pick',
				xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/ul[1]/li[1]/div[1]/a[1]/object[1]/div[1]/div[1]/div[2]/a[1]/div[1]',
				waitTime: 0,
				pickData: {
					pickDesc: '采集校验',
					pickType: 'pick_text',
					pickMethod: 'list',
					pickLevel: 5,
					levelXpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/ul[1]/li[$index]',
					fixXpath: '/div[1]/a[1]/object[1]/div[1]/div[1]/div[2]/a[1]/div[1]'
				}
			}
		},
		position: { x: 250, y: 325 },
	},
	{
		id: '6',
		type: 'end',
		data: {
			label: (
				<>
					An <strong>output node</strong>
				</>
			),
		},
		position: { x: 100, y: 480 },
	},
	{
		id: '7',
		type: 'logic_export',
		data: {
			logicsetting: {
				logicType: 'logic_export',
				waitTime: 0,
				dataType: 'text',
				exportType: 'json',
				savaPath: 'D:\\Wtechtec\\electron-jest\\jest-electron-stage\\',
				rename: '测试保存'
			}
		},
		position: { x: 400, y: 450 },
	},
	{
		id: '8',
		type: 'opt_verify',
		data: {
			optsetting: {
				optType: 'opt_verify',
				xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/ul[1]/li[1]/div[1]/a[1]/object[1]/div[1]/div[1]/div[2]/a[1]/div[1]',
				waitTime: 0,
				verifyData: {
					rename: '测试校验',
					verifyValue: '揭秘百度智能测试在测试分析领域实践1',
					tipType: 'tip_log',
				}
			}
		},
		position: { x: 400, y: 600 },
	},
];

export const edges = [{ "id": "e1-3", "source": "1", "target": "3" }, { "id": "e3-4", "source": "3", "target": "4" }, { "source": "4", "sourceHandle": null, "target": "2", "targetHandle": null, "id": "reactflow__edge-4-2" }, { "source": "2", "sourceHandle": "loopbody", "target": "5", "targetHandle": null, "id": "reactflow__edge-2loopbody-5" }, { "source": "2", "sourceHandle": "next", "target": "7", "targetHandle": null, "id": "reactflow__edge-2next-7" }, { "source": "7", "sourceHandle": null, "target": "6", "targetHandle": null, "id": "reactflow__edge-7-6" }, { "source": "5", "sourceHandle": null, "target": "8", "targetHandle": null, "id": "reactflow__edge-5-8" }]