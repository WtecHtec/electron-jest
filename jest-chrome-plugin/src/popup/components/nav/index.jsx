import { useNavigate } from 'react-router-dom'
import { Button, Tabs } from 'antd'
import './nav.styl'

function Nav(props) {
    // 通过当前路由的location来匹配Tab的激活态
    const { location } = props

    // 路由跳转钩子
    const navigate = useNavigate()

    const items = [
        {
            key: '/home',
            label: 'Home',
        },
        {
            key: '/account',
            label: 'Account',
        },
    ]

    // Tab组件控制路由跳转
    const onTabChange = (key) => {
        navigate(key)
    }

    // 退出到Login页面
    const onExit = () => {
        navigate('/login')
    }

    return (
        <div className="M-nav">
            <Tabs
                activeKey={location.pathname}
                items={items}
                onChange={onTabChange}
                centered
            />
            <Button className="btn-exit" type="primary" onClick={onExit}>
                退出
            </Button>
        </div>
    )
}

export default Nav