
import React, { memo } from 'react';
import { Card } from 'antd'
import { Handle } from 'react-flow-renderer';
import { getMutliLevelProperty } from '../util';


import ClickSvg from '../assets/click.svg'
import InputkSvg from '../assets/input.svg'
import PickSvg from '../assets/pick.svg'
import VerifySvg from '../assets/verify.svg'
import ExportSvg from '../assets/export.svg'
import './flow.node.css'
export default memo(({ isConnectable = true, imgType = 'opt_click', selected, data }) => {
	const SVG_TYPE = {
		opt_click: ClickSvg,
		opt_input: InputkSvg,
		opt_pick: PickSvg,
		opt_verify: VerifySvg,
		logic_export: ExportSvg,
	}

	const showLabel = {
		opt_click: `点击：${getMutliLevelProperty(data, 'optsetting.xpath', '')}`,
		opt_input: () => <>
			<p className="wrap-txt"> 向 {getMutliLevelProperty(data, 'optsetting.xpath', '')} </p>
			<p className="wrap-txt"> 输入：{getMutliLevelProperty(data, 'optsetting.inputData.inputValue', '')}</p>
		</>,
		opt_verify: () => <>
			<p className="wrap-txt"> 校验 {getMutliLevelProperty(data, 'optsetting.xpath', '')}</p>
			<p className="wrap-txt"> 是否等于： {getMutliLevelProperty(data, 'optsetting.verifyData.verifyValue', '')}</p>
		</>,
		opt_pick: `采集：${getMutliLevelProperty(data, 'optsetting.xpath', '')}`,
		logic_export: `导出数据到：${getMutliLevelProperty(data, 'logicsetting.savaPath', '')}`
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