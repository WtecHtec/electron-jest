
import React, { memo } from 'react';
import { Card } from 'antd'
import { Handle } from 'react-flow-renderer';
import { getMutliLevelProperty } from '../util';


import ClickSvg from '../assets/click.svg'
import InputkSvg from '../assets/input.svg'
import PickSvg from '../assets/pick.svg'
import VerifySvg from '../assets/verify.svg'
import ExportSvg from '../assets/export.svg'
import HoverSvg from '../assets/hover.svg'
import BackSvg from '../assets/back.svg'
import CloseSvg from '../assets/close.svg'
import PdfSvg from '../assets/pdf.svg'
import ReloadSvg from '../assets/reload.svg'
import SelfdiySvg from '../assets/selfdiy.svg'
import NewSvg from '../assets/new.svg'
import ExistsSvg from '../assets/exists.svg'
import KeySvg from '../assets/keyboard.svg'

import './flow.node.css'
export default memo(({ isConnectable = true, imgType = 'opt_click', selected, data }) => {
	const SVG_TYPE = {
		opt_click: ClickSvg,
		opt_input: InputkSvg,
		opt_pick: PickSvg,
		opt_verify: VerifySvg,
    opt_hover: HoverSvg,
    opt_exists: ExistsSvg,
		logic_export: ExportSvg,
    logic_pdf: PdfSvg,
    logic_close: CloseSvg,
    logic_reload: ReloadSvg,
    logic_back: BackSvg,
    logic_func: SelfdiySvg,
    logic_new_page: NewSvg,
    opt_keyboard: KeySvg
	}

	const showLabel = {
		opt_click: () => <>
      <p className="wrap-txt"> 操作描述：{getMutliLevelProperty(data, 'optsetting.rename', '')}</p>
      <p className="wrap-txt"> 点击：{getMutliLevelProperty(data, 'optsetting.xpath', '')}</p>
    </>,
		opt_input: () => <>
    <p className="wrap-txt"> 操作描述：{getMutliLevelProperty(data, 'optsetting.rename', '')}</p>
			<p className="wrap-txt"> 向 {getMutliLevelProperty(data, 'optsetting.xpath', '')} </p>
			<p className="wrap-txt"> 输入：{getMutliLevelProperty(data, 'optsetting.inputData.inputValue', '')}</p>
		</>,
		opt_verify: () => <>
      <p className="wrap-txt"> 操作描述：{getMutliLevelProperty(data, 'optsetting.rename', '')}</p>
			<p className="wrap-txt"> 校验 {getMutliLevelProperty(data, 'optsetting.xpath', '')}</p>
			<p className="wrap-txt"> 是否等于： {getMutliLevelProperty(data, 'optsetting.verifyData.verifyValue', '')}</p>
		</>,
		opt_pick:  () => <>
      <p className="wrap-txt"> 操作描述：{getMutliLevelProperty(data, 'optsetting.rename', '')}</p>
      <p className="wrap-txt"> 采集：{getMutliLevelProperty(data, 'optsetting.xpath', '')}</p>
    </>, 
    opt_exists:  () => <>
      <p className="wrap-txt"> 操作描述：{getMutliLevelProperty(data, 'optsetting.rename', '')}</p>
      <p className="wrap-txt"> 检查元素(是否存在)：{getMutliLevelProperty(data, 'optsetting.xpath', '')}</p>
    </>, 
		logic_export: `导出数据到：${getMutliLevelProperty(data, 'logicsetting.savaPath', '')}`,
    opt_hover: () => <>
      <p className="wrap-txt"> 操作描述：{getMutliLevelProperty(data, 'optsetting.rename', '')}</p>
      <p className="wrap-txt"> 鼠标悬停：{getMutliLevelProperty(data, 'optsetting.xpath', '')}</p>
    </>,
    logic_pdf: `导出pdf到：${getMutliLevelProperty(data, 'logicsetting.savaPath', '')}`,
    logic_close: `关闭页面`,
    logic_back: '后退',
    logic_reload: '刷新',
    logic_func: () => <>
      <p className="wrap-txt"> 操作描述：{getMutliLevelProperty(data, 'logicsetting.rename', '')}</p>
      <p className="wrap-txt"> 自定义事件</p>
    </>,
	opt_keyboard: () => <>
		<p className="wrap-txt"> 操作描述：{getMutliLevelProperty(data, 'optsetting.rename', '这是一个按键操作')}</p>
		<p className="wrap-txt"> 按键操作：{getMutliLevelProperty(data, 'optsetting.keyType', '')}</p>
	</>,
    logic_new_page: '获取最新页面',
	}

	return (
		<>
			<Handle
				type="target"
				position="top"
				style={{ zIndex: 9999, backgroundColor: '#576B95' }}
				isConnectable={isConnectable}
			/>
			{/* <img src={SVG_TYPE[imgType]} className={`img-svg  ${selected && 'selected'}`} /> */}
			<Card
				size="small"
				title={<img src={SVG_TYPE[imgType]} className={`card-img  ${selected && 'selected'}`} />}
				style={{ maxWidth: 300, minWidth: 260 }}
			>
				{
					typeof showLabel[imgType] === 'function' ? showLabel[imgType]() : <p className="wrap-txt">{showLabel[imgType]}</p>
				}
				{/* <span>下一步</span> */}
			</Card>
			<Handle
				type="source"
				position="bottom"
				style={{ bottom: 0, top: 'auto', backgroundColor: '#576B95' }}
				isConnectable={isConnectable}
			/>
		</>
	);
});