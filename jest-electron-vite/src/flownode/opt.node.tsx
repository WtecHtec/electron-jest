
import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';



import ClickSvg from '../assets/click.svg'
import InputkSvg from '../assets/input.svg'
import PickSvg from '../assets/pick.svg'
import VerifySvg from '../assets/verify.svg'
import ExportSvg from '../assets/export.svg'
import './flow.node.css'
export default memo(({ isConnectable = true, imgType = 'opt_click', selected }) => {
  const SVG_TYPE = {
    opt_click: ClickSvg,
    opt_input: InputkSvg,
    opt_pick: PickSvg,
    opt_verify: VerifySvg,
    logic_export: ExportSvg,
  }
  return (
    <>
    <Handle
        type="target"
        position="top"
        style={{  backgroundColor: '#576B95' }}
        isConnectable={isConnectable}
      />
      <img src={SVG_TYPE[imgType]} className={`img-svg  ${selected && 'selected'}`} />
      <Handle
        type="source"
        position="bottom"
        style={{ bottom: 0, top: 'auto', backgroundColor: '#576B95' }}
        isConnectable={isConnectable}
      />
    </>
  );
});