import { lazy } from 'react';
import { ICustomRouterConfig } from './typing';

import NotFound from '@/components/notFound';
import BasicLayout from '@/layouts/basicLayout';
import BlankLayout from '@/layouts/blankLayout';
import LoginLayout from '@/layouts/loginLayout';

import userRoutesConfig from './user';
import testRoutesConfig from './test';

/*
 对 pageConfig 做了扩展, 使其兼容 proLayout menus 的配置和 PageTabs 组件 . 侧边栏菜单的配置基于 mainRoutesConfig 生成
 */

/** 主要的路由 */
export const mainRoutesConfig: ICustomRouterConfig[] = [
  {
    path: '/',
    exact: true,
    component: lazy(() => import('@/pages/home')),
    pageConfig: {
      title: '首页',
      icon: 'icon-FunctionsIconForWork_Nav_Home',
      fixed: true,
    },
  },
  ...userRoutesConfig,
  ...testRoutesConfig,
];

const routerConfig: ICustomRouterConfig[] = [
  {
    path: '/',
    component: BlankLayout,
    children: [
      {
        path: '/login',
        component: LoginLayout,
        children: [
          {
            exact: true,
            path: '/',
            component: lazy(() => import('@/pages/login')),
          },
        ],
      },
      {
        path: '/',
        component: BasicLayout,
        children: mainRoutesConfig,
      },
      {
        component: NotFound,
        pageConfig: {
          title: '404',
        },
      },
    ],
  },
];

export default routerConfig;
