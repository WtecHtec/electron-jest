
import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

import { Card } from 'antd'

import LoopSvg from '../assets/loop.svg'
import './flow.node.css'
import { getMutliLevelProperty } from '../util';

export default memo(({ isConnectable = true, selected, data,  }) => {
  const loopType = getMutliLevelProperty(data, 'logicsetting.loopType', '')
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
					title={<img src={LoopSvg} className={`card-img  ${selected && 'selected'}`} />}
				>
          { loopType === 'cooditionnode' &&  <p>👈：判断条件,仅支持一个节点【自定义事件、校验、是否存在】</p>} 
					<p>👉：循环流程</p>
					<p>👇:循环结束下一步</p>
					{/* <span>下一步</span> */}
				</Card>
			</div>
      { loopType === 'cooditionnode' &&
      <Handle
				type="source"
				position="left"
				id="loopcondition"
				style={{ backgroundColor: '#13227a', }}
				isConnectable={isConnectable}
			/>}
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