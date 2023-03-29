import { Badge, Descriptions } from 'antd';

const Account = () => {

  return (
    <Descriptions labelStyle={{ fontWeight: 'bold' }} size="middle" column={2} title="User Info" bordered>
      <Descriptions.Item label="Name">username</Descriptions.Item >
      <Descriptions.Item label="Email">user@mail.com</Descriptions.Item >
      <Descriptions.Item label="Phone number">+57 3002223333</Descriptions.Item >
      <Descriptions.Item label="Status">
        <Badge status="success" text="Active" />
      </Descriptions.Item >
    </Descriptions>
  )
}

export default Account;