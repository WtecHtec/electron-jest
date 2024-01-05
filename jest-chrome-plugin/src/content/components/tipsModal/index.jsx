
import { Tag , Space, Modal, Divider  } from 'antd'
import './mainModal.styl'

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
          <div className="main-content-con">
            <Space size={[0, 8]}  align="start">
              <Tag color="success">Tip:1</Tag>
              <span> 按"Q"选择操作元素,如果没有响应,先"点击"一下页面！ </span> 
            </Space>
            <Divider dashed />
            <Space size={[0, 8]} align="start">
              <Tag color="success">doc</Tag>
              <span> <a href="https://juejin.cn/" target="_blank"> 详细文档</a></span> 
            </Space>
          </div>
        </Modal>
    )
}

export default MainModal
