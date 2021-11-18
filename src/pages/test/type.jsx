import { memo, useEffect, useState } from 'react';
import { useParams, history } from 'ice';
import { Button, List, Modal } from 'antd';
import { usePageTabsContext } from '@/components/pageTabs';

const Detail2Demo = () => {
  const params = useParams();
  const [count, setCount] = useState(0);
  // console.log('================>Type');
  // console.log('================>type:location', location);
  // console.log('================>type:params', params);
  const { action } = usePageTabsContext();
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    // console.log('================>mounted');
  }, []);

  return (
    <>
      <List header={<strong>测试用例</strong>} bordered style={{ backgroundColor: '#fff', margin: 20 }}>
        <List.Item>param: type={params?.type}</List.Item>
        <List.Item>
          <Button
            onClick={() => {
              setCount(count + 1);
            }}
          >
            Click me {count}
          </Button>
        </List.Item>
        <List.Item>
          <div>
            <Button
              onClick={() => {
                action?.replaceTab({
                  pathname: '/test/type/2',
                  state: { name: 'replace 打开的页面' },
                });
              }}
            >
              api.replace 当前页面: type=2
            </Button>
            <Button
              onClick={() => {
                action?.replaceTab({
                  pathname: '/test/type/3',
                  state: { name: 'replace 打开的页面' },
                });
              }}
            >
              api.replace 当前页面: type=3
            </Button>
          </div>
        </List.Item>
        <List.Item>
          <Button
            onClick={() => {
              history.replace({
                pathname: '/test/type/2',
                state: { name: 'replace 打开的页面' },
              });
            }}
          >
            history.replace 当前页面
          </Button>
        </List.Item>
        <List.Item>
          <Button
            onClick={() => {
              action?.triggerEvent('/test/list', 'test', count);
            }}
          >
            往列表页注册事件
          </Button>
        </List.Item>
        <List.Item>
          <Button
            disabled={!action?.enableBackPrevTab?.()}
            onClick={() => {
              action.backPrevTab();
            }}
          >
            选项卡后退
          </Button>
        </List.Item>
        <List.Item>
          <Button
            onClick={() => {
              action?.updateTabInstance(null, {
                closeTips: (callback) => {
                  modal.confirm({
                    content: '确定要关闭当前页面?',
                    onOk: () => {
                      callback();
                    },
                  });
                },
              });
            }}
          >
            为当前页添加自定义关闭提示
          </Button>
          {contextHolder}
        </List.Item>
      </List>
    </>
  );
};

Detail2Demo.displayName = 'Detail2Demo';

export default memo(Detail2Demo);
