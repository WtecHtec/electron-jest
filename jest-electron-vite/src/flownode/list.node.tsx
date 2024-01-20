
import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

import { Card } from 'antd'

import ListSvg from '../assets/list.svg'
import './flow.node.css'


export default memo(({ isConnectable = true, selected, data,  }) => {
	return (
		<>
			<Handle
				type="target"
				position="top"
				style={{zIndex: 9999,  backgroundColor: '#576B95' }}
				isConnectable={isConnectable}
			/>
			{/* <img src={LoopSvg} className={`img-svg  ${selected && 'selected'}`} />
			 */}
			<div>
				<Card
					style={{ minWidth: 260 }}
					size="small"
					title={<img src={ListSvg} className={`card-img  ${selected && 'selected'}`} />}
				>
					<p>👉：任务队列流程,仅支持节点【单个任务队列】</p>
					<p>👇:任务队列结束下一步</p>
					{/* <span>下一步</span> */}
				</Card>
			</div>
			<Handle
				type="source"
				position="right"
				id="listbody"
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