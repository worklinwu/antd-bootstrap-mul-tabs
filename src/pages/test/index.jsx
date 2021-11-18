import { memo, useContext, useEffect, useState } from 'react';
import { Link } from '@/components';
import { PageTabsContext, usePageEventListen } from '@/components/pageTabs';
import { Button, List } from 'antd';

const TestIndex = () => {
  const { action } = useContext(PageTabsContext);
  const [eventValue, setEventValue] = useState();
  usePageEventListen();
  // console.log('================>list');

  useEffect(() => {
    // console.log('================>mounted');
    if (action?.registerEvent) {
      // console.log('================>注册事件');
      action?.registerEvent(action?.getTabInstance?.(), 'test', (...params) => {
        // console.log('================>执行了事件, 参数是', params?.toString());
        setEventValue(params?.toString());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <List header={<strong>测试用例</strong>} bordered style={{ backgroundColor: '#fff' }}>
        <List.Item>
          <Link
            to={{
              pathname: '/test/detail',
              query: {
                id: 1,
              },
            }}
          >
            Link标签打开, 带 query: id=1 参数
          </Link>
        </List.Item>
        <List.Item>
          <Link
            to={{
              pathname: '/test/detail',
              query: {
                id: 1,
                type: 2,
              },
            }}
          >
            Link标签打开, 带 query: id=1,type=2 参数
          </Link>
        </List.Item>
        <List.Item>
          <Link
            to={{
              pathname: '/test/type/1',
            }}
          >
            Link标签打开 test/type/:id 页面, 验证 params
          </Link>
        </List.Item>
        <List.Item>
          <a
            onClick={() => {
              action?.openTab({
                pathname: '/test/detail',
                query: {
                  id: 1,
                },
              });
            }}
          >
            api 打开, 传入对象格式 query: id = 1
          </a>
        </List.Item>
        <List.Item>
          <a
            onClick={() => {
              action?.openTab({
                pathname: '/test/detail',
                query: {
                  id: 1,
                },
                state: {
                  force: true,
                  name: '我是 api 强制打开的页面',
                  closeTips: '自定义关闭提示文字',
                },
              });
            }}
          >
            api 打开, 传入对象格式, 强制打开新标签页, 并带关闭提示
          </a>
        </List.Item>
        <List.Item>
          <a
            onClick={() => {
              action?.openTab('/test/detail?id=123');
            }}
          >
            api 打开, 传入字符串格式
          </a>
        </List.Item>
        <List.Item>
          <a
            onClick={() => {
              action?.openTab({
                pathname: '/test/list',
                state: { force: true, name: '我是 api 强制打开的页面' },
              });
            }}
          >
            强制打开长列表页
          </a>
          &emsp;&emsp;&emsp;
          <a
            onClick={() => {
              action?.openTab({
                pathname: '/test/list',
                state: { force: true, keepAlive: false },
              });
            }}
          >
            强制打开长列表页(不缓存)
          </a>
        </List.Item>
        <List.Item>
          <a
            onClick={() => {
              action?.openTab({
                pathname: '/member/list',
                state: { force: true, name: '不缓存的页面', keepAlive: false },
              });
            }}
          >
            强制打开一个不缓存的页面
          </a>
        </List.Item>
        <List.Item>
          <a
            onClick={() => {
              action?.openTab({
                pathname: '/test/list',
                state: { force: true, keepAlive: false },
              });
            }}
          >
            打开没有缓存的列表页
          </a>
        </List.Item>
        <List.Item>
          <Button
            onClick={() => {
              action?.replaceTabTitle('修改标题测试');
            }}
          >
            改变页面标题
          </Button>
        </List.Item>
        <List.Item>
          <div>
            <Button
              onClick={() => {
                action?.closeOtherTab();
              }}
            >
              关闭其他标签页
            </Button>
            <Button
              onClick={() => {
                action?.closeLeftTab();
              }}
            >
              关闭左侧标签页
            </Button>
            <Button
              onClick={() => {
                action?.closeRightTab();
              }}
            >
              关闭右侧标签页
            </Button>
            <Button
              onClick={() => {
                action?.closeAllTab();
              }}
            >
              关闭所有页面
            </Button>
            <Button
              onClick={() => {
                action?.closeTab(null, {
                  force: true,
                  nextTab: '/',
                  refresh: true,
                });
              }}
            >
              关闭当前页跳转到首页并刷新
            </Button>
          </div>
        </List.Item>
        <List.Item>
          <div>事件测试(通过 action?.registerEvent 注册了个 test 的事件), 其他页面回调的值是: {eventValue}</div>
        </List.Item>
      </List>
      <br />
      <br />

      <br />
      <br />
      <br />
      <br />
    </>
  );
};

TestIndex.displayName = 'ListDemo';

export default memo(TestIndex);
