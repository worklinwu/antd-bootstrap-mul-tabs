import { useCallback, useState } from 'react';
import { createModel } from 'hox';
import useUserModel from './useUserModel';

const useGlobalModel = createModel(() => {
  const [collapsed, setCollapsed] = useState(false);
  const [notices, setNotices] = useState([]);
  const { changeNotifyCount } = useUserModel((model) => ({ changeNotifyCount: model.changeNotifyCount }));

  // const { loading: getNoticesLoading, request: getNotices } = useRequest((params) => queryNotices(params), {
  //   manual: true,
  //   onSuccess: (res) => {
  //     setNotices(res);
  //     // 更新状态相关数据
  //     changeNotifyCount({ totalCount: res.length, unreadCount: notices.filter((item) => !item.read).length });
  //   },
  // });

  // 清除相关选项卡下面的信息
  const clearNotices = useCallback(
    (type) => {
      setCollapsed(false);
      setNotices(notices.filter((item) => item.type !== type));
    },
    [notices],
  );

  // 改变消息的已读状态
  const changeNoticeReadState = useCallback(
    (id) => {
      const currentNotices = notices.map((item) => {
        const notice = { ...item };

        if (notice.id === id) {
          notice.read = true;
        }

        return notice;
      });
      setNotices(currentNotices);
      changeNotifyCount({
        totalCount: currentNotices.length,
        unreadCount: notices.filter((item) => !item.read).length,
      });
    },
    [notices, changeNotifyCount],
  );

  return {
    // getNotices,
    // getNoticesLoading,
    clearNotices,
    collapsed,
    setCollapsed,
    changeNoticeReadState,
  };
});

export default useGlobalModel;
