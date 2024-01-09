import React, { useState, memo, useEffect } from 'react';
import { Drawer, Button, Space, Divider } from 'antd';




import ItemDrawer from './item.drawer';

import { END_DATAS, START_DATAS, CLICK_DATAS, PICK_DATAS, INPUT_DATAS, VERIFY_DATAS } from './item.config';

import './index.css'


const DEL_EXCLUDE = ['start']
const ITEM_DATA_MAP = {
	start: START_DATAS,
	end: END_DATAS,
	opt_click: CLICK_DATAS,
	opt_pick: PICK_DATAS,
	opt_input: INPUT_DATAS,
	opt_verify: VERIFY_DATAS,
}
export default memo((porps) => {
	const { node } = porps

	const [open, setOpen] = useState(porps.open);

	useEffect(() => {
		setOpen(porps.open);
	}, [porps.open])

	const onClose = () => {
		setOpen(false);
		(typeof porps.onClose === 'function' && porps.onClose())
	};

	const DrawerContent = () => {
		if (ITEM_DATA_MAP[node.type]) return <ItemDrawer node={node} datas={ITEM_DATA_MAP[node.type]}></ItemDrawer>
		return <></>
	}
	return (
		<>
			<Drawer title={porps.title} placement="right" onClose={onClose} open={open}>
				<DrawerContent></DrawerContent>
				<p>
					{!DEL_EXCLUDE.includes(node.type) && <Button type="primary" danger>
						删除流程
					</Button>}
				</p>
			</Drawer>
		</>
	);
})
