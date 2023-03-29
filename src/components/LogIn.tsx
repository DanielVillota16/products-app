import { Button, Checkbox, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const LogIn = () => {

  const navigate = useNavigate();

  const onFinish = (values: any) => {
    navigate('/products');
    console.log('Success:', values);
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Typography.Title style={{ textAlign: 'center' }} >Log in</Typography.Title>
      <div style={{
        textAlign: 'center', 
        marginTop: '50px',
        display: 'flex',
        justifyContent: 'center',
      }} >

        <Form
          name="normal_login"
          style={{ maxWidth: '500px', }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
            <p>Or <a href="signup">register now!</a></p>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default LogIn;