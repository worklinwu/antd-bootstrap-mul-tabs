import { useEffect, useReducer, useRef } from 'react';

import { useHistory, useLocation } from 'ice';

import { usePageTabsApi } from './api';
import { useDeepCompareEffect } from './hooks';
import { initialState, reducer } from './reducer';
import PageTabsContext from './context';

const PageTabsProvider = ({ defaultTabs, children }) => {
  const history = useHistory();
  const location = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const api = usePageTabsApi(state, dispatch);
  const firstLoadFlag = useRef(false);

  useEffect(() => {
    if (state.tabs.length === 0) {
      api.addTab(defaultTabs || ['/']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!firstLoadFlag.current && state.tabs.length > 0) {
      // 首次进入页面, history.listen 还无法监听, 需要手动处理一次
      api.listenRouterChange(location);
      firstLoadFlag.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useDeepCompareEffect(() => {
    return history.listen(api.listenRouterChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.listen, state]);

  useEffect(() => {
    return history.block(api.beforeRouterChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, state]);

  return <PageTabsContext.Provider value={{ state, dispatch, action: api }}>{children}</PageTabsContext.Provider>;
};

PageTabsProvider.displayName = 'PageTabsProvider';

export default PageTabsProvider;
