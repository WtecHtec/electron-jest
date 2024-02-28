
import { Tag , Space, Modal, Divider  } from 'antd'
import './mainModal.styl'
import ICON02 from '../../images/icon-02.png'
import ICON04 from '../../images/icon-04.png'
function MainModal(props) {
 
    // 接收父组件控制本组件关闭的方法
    const { onClose } = props

    return (
        <Modal
            className="CRX-mainModal"
            open={true}
            title={'提示'}
            footer={null}
            maskClosable={false}
            onCancel={() => {
                onClose && onClose()
            }}
            width={600}
        >
          <div className="main-content-con" id="dom-inspector-root-jest-pro-tips-modal">
            <Space size={[0, 8]}  align="start">
              <Tag color="success">Tip:1</Tag>
              <span><img src={ICON04} className="tip-img"></img> 圈选状态:  按"Q"选择操作元素,如果没有响应,先"点击"一下页面！ </span> 
            </Space>
            <Divider dashed />
            <Space size={[0, 8]}  align="start">
              <Tag color="success">Tip:2</Tag>
              <span><img src={ICON02} className="tip-img"></img> 录制状态:  会记录当前你的点击 输入等操作。 </span> 
            </Space>
            <Divider dashed />
            <Space size={[0, 8]}  align="start">
              <Tag color="success">Tip:3</Tag>
              <span> 录制状态或圈选状态每次操作仅一个状态  </span> 
            </Space>
            <Divider dashed />
            <Space size={[0, 8]} align="start">
              <Tag color="success">doc</Tag>
              <span> <a href="https://juejin.cn/column/7330388563790921765" target="_blank"> 详细文档</a></span> 
            </Space>
          </div>
        </Modal>
    )
}

export default MainModal
