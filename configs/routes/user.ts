import { lazy } from 'react';
import { ICustomRouterConfig } from './typing';

const routesConfig: ICustomRouterConfig[] = [
  {
    path: '/user',
    redirect: '/user/center',
    children: [
      {
        path: 'center',
        exact: true,
        component: lazy(() => import('@/pages/user/userCenter')),
        pageConfig: {
          title: '个人中心',
          hideInMenu: true,
          icon: 'icon-FunctionsIconForWork_Nav_User',
          keepAlive: false,
        },
      },
    ],
  },
];

export default routesConfig;
