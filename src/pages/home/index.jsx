import { memo } from 'react';
import { Avatar } from 'antd';
import { PageContainer } from '@/components';
import useUserModel from '@/models/useUserModel';
import styles from './index.module.less';

const getGreeting = () => {
  const now = new Date();
  const times = now.getHours();
  if (times >= 6 && times < 12) return '早上好';
  if (times >= 12 && times < 18) return '下午好';
  if ((times >= 18 && times < 24) || (times <= 24 && times < 6)) return '晚上好';
};

const HomePage = () => {
  const { currentUser, userNameInitials } = useUserModel();
  return (
    <PageContainer showFooter bgColor={false}>
      <div className={styles.container}>
        <div className={styles.greet}>
          <Avatar size={40} className={styles.avatar} src={currentUser?.avatar}>
            {userNameInitials}
          </Avatar>
          <span>
            {getGreeting()}，{currentUser?.username}，祝你开心每一天！
          </span>
        </div>
        <div className={styles.content}>
          <div className={styles.welcome}>
            <div className={styles.welcomeTxt}>Welcome</div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

HomePage.displayName = 'HomePage';

export default memo(HomePage);
