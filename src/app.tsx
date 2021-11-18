import { IAppConfig, runApp } from 'ice';
import { Spin } from 'antd';
import { autoFixContext } from 'react-activation';
import JSXDevRunTime from 'react/jsx-dev-runtime';
import JSXRunTime from 'react/jsx-runtime';

import AppProvider from '@/components/appProvider';
import { KeepAliveWrapper } from '@/components/pageTabs';
import { getLocale, mapTree } from '@/utils';
import requestConfig from '../configs/request';
import { mainRoutesConfig } from '../configs/routes';

const locale = getLocale();

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    addProvider: ({ children }) => <AppProvider locale={locale}>{children}</AppProvider>,
    getInitialData: async () => {
      return {
        routes: mainRoutesConfig,
      };
    },
  },
  request: requestConfig,
  router: {
    type: 'browser',
    fallback: (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Spin spinning />
      </div>
    ),
    modifyRoutes: (routes) => {
      return mapTree(routes, (node) => {
        const newNode = { ...node };
        newNode.pageConfig = newNode.pageConfig || {};
        if (node.pageConfig?.title && node.path && node.component) {
          newNode.wrappers = [KeepAliveWrapper];
        }
        return newNode;
      });
    },
  },
};

autoFixContext(
  // eslint-disable-next-line global-require
  [JSXRunTime, 'jsx', 'jsxs', 'jsxDEV'],
  // eslint-disable-next-line global-require
  // @ts-ignore
  [JSXDevRunTime, 'jsx', 'jsxs', 'jsxDEV'],
);

runApp(appConfig);
