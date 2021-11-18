import { useLocation } from 'ice';
import { KeepAlive } from 'react-activation';
import { usePageTabsContext } from '@/components/pageTabs';

const keepAliveWhenParam = [true, true];

const KeepAliveWrapper = (WrappedComponent) => {
  const Wrapped = (props) => {
    const { state } = usePageTabsContext();
    const location = useLocation();

    if (state.currentTab?.keepAlive === false) {
      return props.children;
    } else {
      // 只有存在 currentTab, 且 currentTab 的 location.pathname 与当前的 location.pathname 相同 才允许创建页面
      // 或者会存在创建多个实例的问题
      const isShow =
        window.PAGETABS_PAGE_TABS_CHANGE_COMPLETE &&
        state.currentTab &&
        state.currentTab.location.pathname === location.pathname;
      return isShow ? (
        <KeepAlive
          id={state.currentTab.keepaliveId}
          name={state.currentTab.keepaliveId}
          when={keepAliveWhenParam}
          saveScrollPosition=".page-tabs-content"
        >
          <WrappedComponent {...props} />
        </KeepAlive>
      ) : (
        <></>
      );
    }
  };

  return Wrapped;
};

export default KeepAliveWrapper;
