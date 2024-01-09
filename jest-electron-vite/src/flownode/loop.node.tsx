
import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

import { Space, } from 'antd'

import LoopSvg from '../assets/loop.svg'
import './flow.node.css'

export default memo(({ isConnectable = true, selected }) => {
  return (
    <>
    <Handle
        type="target"
        position="top"
        style={{  backgroundColor: '#576B95' }}
        isConnectable={isConnectable}
      />
      <img src={LoopSvg} className={`img-svg  ${selected && 'selected'}`} />
      <Handle
        type="source"
        position="left"
        id="loopbody"
        style={{ backgroundColor: '#576B95' }}
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