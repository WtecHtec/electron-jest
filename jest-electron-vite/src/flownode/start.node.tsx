import React, { memo } from 'react';
import { Card } from 'antd'
import { Handle } from 'react-flow-renderer';

import StartSvg from '../assets/start.svg'
import './flow.node.css'

export default memo(({ isConnectable, selected, data }) => {
	return (
		<>
			<div>
				<Card
					size="small"
					title={<img src={StartSvg} className={`card-img  ${selected && 'selected'}`} />}
					style={{ maxWidth: 300, minWidth: 260 }}
				>
					<p className="wrap-txt">打开页面：{data.url}</p>
					{/* <span>下一步</span> */}
				</Card>
			</div>
			<Handle
				type="source"
				position="bottom"
				style={{ backgroundColor: '#576B95' }}
				isConnectable={isConnectable}
			></Handle>
		</>
	);
});