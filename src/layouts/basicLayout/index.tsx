import { history, Link, getInitialData } from 'ice';

import { Avatar, Dropdown, Menu } from 'antd';
import ProLayout, { MenuDataItem } from '@ant-design/pro-layout';
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Icon } from '@/components';
import { useRequest } from '@/hooks';
import { PageTabs, PageTabsProvider } from '@/components/pageTabs';
import { mapTree, clearUserTokenToCookie, storage } from '@/utils';
import useUserModel from '@/models/useUserModel';
import SecurityLayout from '@/layouts/securityLayout';
import logo from '@/assets/images/logo.png';
import { logout } from '@/services/login';
import styles from './index.module.less';

const handleMenuDataRender = () => {
  const { routes } = getInitialData();
  return mapTree(routes, ({ path, pageConfig, children }) => {
    const { title: name, hideInMenu = false, locale, authority, icon, hideChildrenInMenu } = pageConfig || {};
    return {
      path,
      // @ts-ignore
      icon: <Icon icon={icon || 'icon-tag'} size={16} className={styles.sideMenuIcon} />,
      name,
      hideInMenu,
      hideChildrenInMenu,
      locale,
      authority,
      children,
    };
  });
};

const RightContent = () => {
  const { currentUser, userNameInitials } = useUserModel();
  const { request: logoutRequest } = useRequest(logout, {
    manual: true,
  });

  const avatar = (
    <Avatar shape="circle" size={24} style={{ backgroundColor: '#ffa22d', verticalAlign: -7, marginRight: 8 }} gap={6}>
      {userNameInitials}
    </Avatar>
  );

  // 退出操作
  const handleExit = () => {
    logoutRequest().then((res) => {
      if (res) {
        // 清楚掉缓存信息
        storage.set('currentUser', null);
        clearUserTokenToCookie();
        // 跳转登录页
        history?.replace('/login');
      }
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="userInfo">
        {avatar}
        {currentUser?.username}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="center" icon={<UserOutlined />}>
        <Link to="/user/center">个人中心</Link>
      </Menu.Item>
      <Menu.Item key="exit" icon={<LogoutOutlined />}>
        <a onClick={handleExit}>退出账户</a>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu}>
      <div style={{ color: '#fff', cursor: 'pointer' }}>
        {avatar}
        {currentUser?.username}
        <DownOutlined style={{ fontSize: 12, marginLeft: 8 }} />
      </div>
    </Dropdown>
  );
};

const BasicLayout = (props) => {
  const { children } = props;
  return (
    <SecurityLayout>
      <PageTabsProvider defaultTabs={['/']}>
        <ProLayout
          logo={logo}
          title="NoName"
          layout="mix"
          contentWidth="Fluid"
          fixedHeader
          fixSiderbar
          navTheme="light"
          menuDataRender={() => handleMenuDataRender() as MenuDataItem[]}
          menuItemRender={(item, defaultDom) => {
            if (!item.path) {
              return defaultDom;
            }
            return <Link to={item.path}>{defaultDom}</Link>;
          }}
          rightContentRender={RightContent}
          footerRender={false}
          {...props}
        >
          <PageTabs>{children}</PageTabs>
        </ProLayout>
      </PageTabsProvider>
    </SecurityLayout>
  );
};

BasicLayout.displayName = 'BasicLayout';

export default BasicLayout;
