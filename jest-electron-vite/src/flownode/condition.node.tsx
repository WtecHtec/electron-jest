
import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

import { Card } from 'antd'

import ConditionSvg from '../assets/condition.svg'
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
					title={<img src={ConditionSvg} className={`card-img  ${selected && 'selected'}`} />}
				>
           <p>👈：判断条件,仅支持一个节点【自定义事件、校验、是否存在】</p>
					<p>👉:结果为:假,执行右边流程</p>
					<p>👇:结果为:真,执行下边流程</p>
					{/* <span>下一步</span> */}
				</Card>
			</div>
      <Handle
				type="source"
				position="left"
				id="conditionbody"
				style={{ backgroundColor: '#13227a', }}
				isConnectable={isConnectable}
			/>
			<Handle
				type="source"
				position="right"
				id="nobody"
				style={{ backgroundColor: '#FA5151' }}
				isConnectable={isConnectable}
			/>
			<Handle
				type="source"
				position="bottom"
				id="yesbody"
				style={{ bottom: 0, top: 'auto', backgroundColor: '#576B95' }}
				isConnectable={isConnectable}
			/>
		</>
	);
});