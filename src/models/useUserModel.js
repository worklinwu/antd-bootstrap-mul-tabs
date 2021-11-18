import { useCallback, useMemo } from 'react';
import { createModel } from 'hox';

import { useRequest } from '@/hooks';
import { getUserBasicInfo } from '@/services/user';
import { getFirstCapitalizedLetter, storage } from '@/utils';

const useUserModel = createModel(() => {
  const {
    data: currentUser = storage.get('currentUser'),
    loading: getCurrentUserLoading,
    request: getCurrentUser,
    mutate: mutateCurrentUser,
  } = useRequest(getUserBasicInfo, {
    manual: true,
    onSuccess(res) {
      if (res) {
        storage.set('currentUser', res);
      }
    },
  });

  const userNameInitials = useMemo(() => {
    if (currentUser?.username) {
      return getFirstCapitalizedLetter(currentUser.username);
    }
    return '';
  }, [currentUser?.username]);

  const changeNotifyCount = useCallback(
    (params) => {
      mutateCurrentUser({
        ...currentUser,
        notifyCount: params.totalCount,
        unreadCount: params.unreadCount,
      });
    },
    [currentUser, mutateCurrentUser],
  );

  return {
    currentUser,
    getCurrentUser,
    getCurrentUserLoading,
    mutateCurrentUser,
    changeNotifyCount,
    userNameInitials,
  };
});

export default useUserModel;
