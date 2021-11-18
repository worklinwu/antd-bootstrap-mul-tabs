import { Avatar, Form, Tabs } from 'antd';
import { EmptyText, PageContainer } from '@/components';
import useUserModel from '@/models/useUserModel';

const UserCenterPage = () => {
  const { currentUser, userNameInitials } = useUserModel();

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基本信息" key="1">
          <Form layout="vertical" style={{ margin: '20px 0' }} className="form-vertical--preview">
            <Form.Item>
              <Avatar shape="circle" size={72} style={{ backgroundColor: '#ffa22d' }}>
                {userNameInitials}
              </Avatar>
            </Form.Item>
            <Form.Item label="姓名">
              <EmptyText>{currentUser?.username}</EmptyText>
            </Form.Item>
            <Form.Item label="邮箱">
              <EmptyText>{currentUser?.email}</EmptyText>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="其他信息" key="2">
          <Form layout="vertical" style={{ margin: '20px 0' }} className="form-vertical--preview">
            <Form.Item label="注册时间">
              <EmptyText>{currentUser?.createTime}</EmptyText>
            </Form.Item>
            <Form.Item label="状态">
              <EmptyText>{['正常', '冻结'][Number(currentUser?.status || -1)]}</EmptyText>
            </Form.Item>
            <Form.Item label="绑定手机">
              <EmptyText>{currentUser?.mobile}</EmptyText>
            </Form.Item>
            <Form.Item label="绑定邮箱">
              <EmptyText>{currentUser?.email}</EmptyText>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </PageContainer>
  );
};

UserCenterPage.displayName = 'UserCenterPage';

export default UserCenterPage;
