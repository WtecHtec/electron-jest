import { useState } from 'react'
import { Button, Input, Modal } from 'antd'
import { apiReqs } from '@/api'
import './mainModal.styl'

function MainModal(props) {
    const [text, setText] = useState(null)

    // 接收父组件控制本组件关闭的方法
    const { onClose } = props

    // 随着Input的输入变化，及时更新text
    const handleIptChange = (e) => {
        setText(e.target.value)
    }

    // 提交
    const submit = () => {
        apiReqs.submitByBackground({
            data: {
                text,
            },
            success: (res) => {
                console.log(res)
            },
            fail: (res) => {
                alert(res)
            },
        })
    }

    return (
        <Modal
            className="CRX-mainModal"
            open={true}
            title={'CRX对话框'}
            footer={null}
            maskClosable={false}
            onCancel={() => {
                onClose && onClose()
            }}
            width={600}
        >
            <div className="main-content-con">
                <div className="item-con">
                    <Input
                        placeholder="请输入内容"
                        value={text}
                        onChange={handleIptChange}
                    />
                </div>
                <div>
                    <Button type="primary" block onClick={submit}>
                        Submit
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default MainModal
