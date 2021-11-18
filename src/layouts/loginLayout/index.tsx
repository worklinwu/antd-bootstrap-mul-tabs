import { ReactNode } from 'react';

import { Redirect } from 'ice';

import logo from '@/assets/images/logo_login.png';
import { getUserTokenFromCookie } from '@/utils';

import styles from './index.module.less';

const LoginLayout = ({ children }: { children: ReactNode }) => {
  const currentUserToken = getUserTokenFromCookie();
  if (currentUserToken?.token) {
    return <Redirect to={'/'} />;
  }
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.logo}>
            <img alt="logo" className={styles.logo} src={logo} />
          </div>
          <div className={styles.hr} />
          <div className={styles.main}>{children}</div>
        </div>
      </div>
      <div className={styles.copyright}>Copyright@ 2021 xxxxx</div>
    </div>
  );
};

LoginLayout.displayName = 'UserLayout';

export default LoginLayout;
