import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from 'antd'
import { apiReqs } from '@/api'
import imgLogo from './logo.png'
import './login.styl'

function Login() {
    // 路由跳转钩子
    const navigate = useNavigate()

    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')

    // 登录
    const onLogin = () => {
        navigate('/home')
        apiReqs.signIn({
            // 如果上传文件，则设置formData为true，这里暂时不用。
            // formData: true,
            data: {
                account,
                password,
            },
            success: (res) => {
                console.log(res)
                navigate('/home')
            },
            fail: (res) => {
                alert(res)
            },
        })
    }
    return (
        <div className="P-login">
            <img src={imgLogo} alt="" className="logo" />
            <div className="ipt-con">
                <Input placeholder="账号" value={account} onChange={(e)=>{setAccount(e.target.value)}} />
            </div>
            <div className="ipt-con">
                <Input.Password placeholder="密码" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <div className="ipt-con">
                <Button type="primary" block={true} onClick={onLogin}>
                    登录
                </Button>
            </div>
        </div>
    )
}

export default Login
