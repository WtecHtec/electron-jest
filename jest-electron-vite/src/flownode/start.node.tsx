import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

import StartSvg from '../assets/start.svg'
import './flow.node.css'

export default memo(({ isConnectable, selected }) => {
  return (
    <>
      <div className="img-svg" >
        <img src={StartSvg} className={`img-svg  ${selected && 'selected'}`} />
      </div>
      <Handle
        type="source"
        position="bottom"
        style={{ bottom: 0, top: 'auto', backgroundColor: '#576B95' }}
        isConnectable={isConnectable}
      />
    </>
  );
});