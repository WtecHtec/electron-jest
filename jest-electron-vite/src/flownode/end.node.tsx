import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import { Card } from 'antd'
import EndSvg from '../assets/end.svg'
import './flow.node.css'

export default memo(({ isConnectable, selected }) => {
	return (
		<>
			<Handle
				type="target"
				position="top"
				style={{ zIndex: 9999, backgroundColor: '#576B95' }}
				isConnectable={isConnectable}
			/>
			<Card
				size="small"
				title={<img src={EndSvg} className={`card-img  ${selected && 'selected'}`} />}
				style={{ maxWidth: 300, minWidth: 260 }}
			>
				<p className="wrap-txt">结束任务</p>
				{/* <span>下一步</span> */}
			</Card>
		</>
	);
});