import { useState } from 'react';

import { Redirect } from 'ice';
import { stringify } from 'querystring';

import { useMount } from '@/hooks';
import useUserModel from '@/models/useUserModel';
import { PageLoading } from '@ant-design/pro-layout';

const SecurityLayout = (props) => {
  const { currentUser, getCurrentUser, getCurrentUserLoading } = useUserModel();
  const { children } = props;
  const [isReady, setIsReady] = useState(false);

  useMount(() => {
    if (!currentUser) {
      getCurrentUser().then(() => {
        setIsReady(true);
      });
    } else {
      setIsReady(true);
    }
  });

  // You can replace it to your authentication rule (such as check token exists)
  // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
  const isLogin = currentUser;
  const queryString = stringify({
    redirect: window.location.href,
  });

  if ((!isLogin && getCurrentUserLoading) || !isReady) {
    return <PageLoading />;
  }

  if (!isLogin && window.location.pathname !== '/login') {
    return <Redirect to={`/login?${queryString}`} />;
  }

  return children;
};

export default SecurityLayout;
