import { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { logger } from 'ice';
import classnames from 'classnames';
import { Icon } from '@/components';
import { usePageTabsContext } from '@/components/pageTabs';
import { CloseOutlined, LeftOutlined, ReloadOutlined, RightOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { debounce } from 'lodash-es';
import './index.less';

const TABS_BAR_PADDING = 48;
// let initSwiper;
const PageTabs = (props) => {
  const { children } = props;
  const context = usePageTabsContext();
  const { state, action } = context || {};

  useEffect(() => {
    if (!context) {
      logger.error('warning: The PageTabs component must be under the PageTabsContext component');
    }
  }, [context]);

  const [isShowNavControls, setIsShowNavControls] = useState(false);
  const [scrollX, setScrollX] = useState(0);

  // 设置滚动条便宜量, 增加边缘值判断
  const handleSetScroll = (x) => {
    if (isShowNavControls) {
      const $nav = document.querySelector('.page-tabs-bar-nav');
      const $navInner = document.querySelector('.page-tabs-bar-nav-inner');
      const maxScroll = -(
        $navInner.getBoundingClientRect().width +
        TABS_BAR_PADDING -
        $nav.getBoundingClientRect().width
      );
      if (x >= 0) {
        setScrollX(0);
      } else if (x <= maxScroll) {
        setScrollX(maxScroll);
      } else {
        setScrollX(x);
      }
    } else {
      setScrollX(0);
    }
  };

  const handleCurrentTabChange = useCallback(() => {
    if (state.currentTab) {
      const $nav = document.querySelector('.page-tabs-bar-nav');
      const $activeTabItem = document.querySelector('.page-tabs .tab-item.active');
      const navRect = $nav.getBoundingClientRect();
      const activeTabItemRect = $activeTabItem.getBoundingClientRect();
      if (navRect.left > activeTabItemRect.left - TABS_BAR_PADDING) {
        // 高亮的部分在左侧隐藏部分
        const x = activeTabItemRect.left - scrollX - TABS_BAR_PADDING * 2 - navRect.left;
        handleSetScroll(-x);
      } else if (activeTabItemRect.width + activeTabItemRect.left + TABS_BAR_PADDING > navRect.width + navRect.left) {
        // 高亮的部分在右侧隐藏部分
        const x =
          activeTabItemRect.left +
          activeTabItemRect.width -
          scrollX +
          TABS_BAR_PADDING * 2 -
          (navRect.width + navRect.left);
        handleSetScroll(-x);
      } else {
        // 在可视区域, 但有可能 tabs 的长度有变化, 要重新计算
        handleSetScroll(scrollX);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollX, state.currentTab]);

  const autoAdjust = useCallback(
    debounce((checkCurrentTab = true) => {
      const $nav = document.querySelector('.page-tabs-bar-nav');
      const $navInner = document.querySelector('.page-tabs-bar-nav-inner');
      if (
        $navInner?.getBoundingClientRect().width >=
        $nav?.getBoundingClientRect().width - (isShowNavControls ? TABS_BAR_PADDING : 0)
      ) {
        setIsShowNavControls(true);
      } else {
        setIsShowNavControls(false);
        setScrollX(0);
      }
      if (checkCurrentTab) {
        handleCurrentTabChange();
      }
    }, 500),
    [isShowNavControls],
  );

  useLayoutEffect(() => {
    autoAdjust(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tabs]);

  useEffect(() => {
    window.addEventListener('resize', autoAdjust);
    return () => {
      window.removeEventListener('resize', autoAdjust);
    };
  }, [autoAdjust]);

  useLayoutEffect(() => {
    handleCurrentTabChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentTab]);

  const handleClick = (tab) => {
    action.openTab(tab);
  };

  const handleClose = (e, tab) => {
    e.stopPropagation();
    e.preventDefault();
    action.closeTab(tab);
  };

  const handleTabItemMenuClick = (e, tab) => {
    const { key } = e;
    switch (key) {
      case 'refresh': {
        action.refreshTab(tab);
        break;
      }
      case 'closeCurrent': {
        action.closeTab(tab);
        break;
      }
      case 'closeOther': {
        action.closeOtherTab();
        break;
      }
      case 'closeRight': {
        action.closeRightTab();
        break;
      }
      case 'closeLeft': {
        action.closeLeftTab();
        break;
      }
      default:
        break;
    }
  };

  const getTabItemMenu = (tab, index) => {
    return (
      <Menu onClick={(e) => handleTabItemMenuClick(e, tab)}>
        <Menu.Item key="refresh">刷新</Menu.Item>
        <Menu.Item disabled={index === 0} key="closeCurrent">
          关闭
        </Menu.Item>
        <Menu.Item disabled={state.tabs.length === 1} key="closeOther">
          关闭其他
        </Menu.Item>
        <Menu.Item disabled={state.tabs.length === index + 1} key="closeRight">
          关闭右侧
        </Menu.Item>
        <Menu.Item disabled={index === 0} key="closeLeft">
          关闭左侧
        </Menu.Item>
      </Menu>
    );
  };

  const handleBack = () => {
    if (state.currentTab?.prevTab) {
      action.backPrevTab();
    }
  };

  const handleRefresh = () => {
    action.refreshTab();
  };

  return (
    <div className="page-tabs">
      <div className="page-tabs-bar">
        <div className="page-tabs-bar-controls">
          <a className={classnames(!state?.currentTab?.prevTab && 'disabled')}>
            <LeftOutlined disabled={!state?.currentTab?.prevTab} onClick={handleBack} />
          </a>
          <a>
            <ReloadOutlined onClick={handleRefresh} />
          </a>
        </div>
        <div className={classnames('page-tabs-bar-nav', isShowNavControls && 'show-controls')}>
          {isShowNavControls && (
            <a className="page-tabs-bar-nav-left" onClick={() => handleSetScroll(scrollX + 200)}>
              <LeftOutlined />
            </a>
          )}
          {isShowNavControls && (
            <a className="page-tabs-bar-nav-right" onClick={() => handleSetScroll(scrollX - 200)}>
              <RightOutlined />
            </a>
          )}
          <ul className="page-tabs-bar-nav-inner" style={{ transform: `translateX(${scrollX}px)` }}>
            {state.tabs.map((tab, index) => {
              return (
                <li
                  key={tab.id}
                  onClick={() => handleClick(tab)}
                  onContextMenu={(e) => e.preventDefault()}
                  className={classnames('tab-item', {
                    active: tab.id === state.currentTab?.id,
                  })}
                >
                  <Dropdown overlay={getTabItemMenu(tab, index)} trigger={['contextMenu']}>
                    <div className="tab-item-inner">
                      <Icon x-if={tab.icon} icon={tab.icon} size={16} className="tab-item-icon" />
                      <span className="tab-item-name" title={tab.name}>
                        {tab.name}
                      </span>
                      {!tab.fixed && (
                        <span className="tab-item-close" onClick={(e) => handleClose(e, tab)}>
                          <CloseOutlined />
                        </span>
                      )}
                    </div>
                  </Dropdown>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="page-tabs-content">{children}</div>
    </div>
  );
};

PageTabs.propTypes = {};

PageTabs.defaultProps = {};

PageTabs.displayName = 'PageTabs';

export default memo(PageTabs);
