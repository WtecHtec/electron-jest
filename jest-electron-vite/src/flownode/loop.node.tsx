
import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

import { Card } from 'antd'

import LoopSvg from '../assets/loop.svg'
import './flow.node.css'

export default memo(({ isConnectable = true, selected }) => {
	return (
		<>
			<Handle
				type="target"
				position="top"
				style={{ backgroundColor: '#576B95' }}
				isConnectable={isConnectable}
			/>
			{/* <img src={LoopSvg} className={`img-svg  ${selected && 'selected'}`} />
			 */}
			<div>
				<Card
					style={{ minWidth: 260 }}
					size="small"
					title={<img src={LoopSvg} className={`card-img  ${selected && 'selected'}`} />}
				>
					<p>👉：循环流程</p>
					<p>👇:循环结束下一步</p>
					{/* <span>下一步</span> */}
				</Card>
			</div>
			<Handle
				type="source"
				position="right"
				id="loopbody"
				style={{ backgroundColor: '#FA5151' }}
				isConnectable={isConnectable}
			/>
			<Handle
				type="source"
				position="bottom"
				id="next"
				style={{ bottom: 0, top: 'auto', backgroundColor: '#576B95' }}
				isConnectable={isConnectable}
			/>
		</>
	);
});