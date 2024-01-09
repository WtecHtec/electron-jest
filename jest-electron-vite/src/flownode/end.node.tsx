import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

import EndSvg from '../assets/end.svg'
import './flow.node.css'

export default memo(({ isConnectable, selected }) => {
  return (
    <>
   <Handle
        type="target"
        position="top"
        style={{  backgroundColor: '#576B95' }}
        isConnectable={isConnectable}
      />
      <div className={`img-svg  ${selected && 'selected'}`}>
        <img src={EndSvg} className="img-svg" />
      </div>
    </>
  );
});