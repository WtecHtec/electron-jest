import React, { useState, memo, useEffect, useMemo } from 'react';
import { Drawer, Button, Space, Divider } from 'antd';




import ItemDrawer from './item.drawer';
import ExportDrawer from './export.drawer';
import LoopDrawer from './loop.drawer';
import LogicBaseDrawer from './logic.base.drawer';

import { END_DATAS, START_DATAS, CLICK_DATAS, PICK_DATAS, INPUT_DATAS, 
  VERIFY_DATAS, HOVER_DATAS, OPT_EXISTS_DATAS, LOGIC_CONDITION, LOGIC_LIST, LOGIC_LIST_ITEM, OPT_KEYBOARD_DATAS, 
  OPT_MOUSE_DATAS} from './item.config';


import './index.css'


const DEL_EXCLUDE = ['start']
const ITEM_DATA_MAP = {
	start: START_DATAS,
	end: END_DATAS,
	opt_click: CLICK_DATAS,
	opt_pick: PICK_DATAS,
	opt_input: INPUT_DATAS,
	opt_verify: VERIFY_DATAS,
  opt_hover: HOVER_DATAS,
  opt_exists: OPT_EXISTS_DATAS,
  logic_condition: LOGIC_CONDITION,
  logic_list: LOGIC_LIST,
  logic_listitem: LOGIC_LIST_ITEM,
  opt_keyboard: OPT_KEYBOARD_DATAS,
  opt_mouse: OPT_MOUSE_DATAS,
}
export default memo((porps) => {
	const { node } = porps

	const [open, setOpen] = useState(porps.open);

	useEffect(() => {
		setOpen(porps.open);
	}, [porps.open])

	const onClose = () => {
		
		(typeof porps.onClose === 'function' && porps.onClose(node))
	};

  const onDeleteNode = () => {
    
    (typeof porps.onDelete === 'function' && porps.onDelete(node))
  }

	const DrawerContent =  () => {
		if (ITEM_DATA_MAP[node.type]) return <ItemDrawer node={node} datas={ITEM_DATA_MAP[node.type]}></ItemDrawer>
		if (node.type === 'logic_export') return <ExportDrawer node={node}></ExportDrawer>
    if (node.type === 'logic_loop') return <LoopDrawer node={node}></LoopDrawer>
    if (['logic_close','logic_back','logic_reload','logic_pdf', 'logic_func', 'logic_new_page'].includes(node.type)) return <LogicBaseDrawer node={node}></LogicBaseDrawer>
    return <></>
	}
	return (
		<>
			<Drawer title={porps.title} placement="right" onClose={onClose} open={open} maskClosable={false} keyboard={false}>
				<DrawerContent></DrawerContent>
   
				<p>
					{!DEL_EXCLUDE.includes(node.type) && <Button type="primary" danger onClick={onDeleteNode}>
						删除流程
					</Button>}
				</p>
			</Drawer>
		</>
	);
})
