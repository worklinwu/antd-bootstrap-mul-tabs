import cookie from 'js-cookie';

/**
 * 获取LocalStorage中的用户信息
 */
export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user') || '';
    const result = JSON.parse(user);
    return result;
  } catch (error) {
    return null;
  }
};

/**
 * 设置用户信息到LocalStorage
 * @param user
 */
export const setUserToStorage = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * 清除LocalStorage中的用户信息
 */
export const cleanUserToStorage = () => {
  localStorage.removeItem('user');
};

/**
 * 获取用户Token
 */
export const getUserTokenFromCookie = () => {
  const userToken = cookie.get('Authorization');
  return userToken ? JSON.parse(userToken) : null;
};

/**
 * 设置用户Token
 * @param token
 */
export const setUserTokenToCookie = (token: Record<string, string> | null) => {
  cookie.set('Authorization', token ? JSON.stringify(token) : null, {
    expires: 30,
  });
};
/**
 * 清除用户Token
 */
export const clearUserTokenToCookie = () => {
  cookie.remove('Authorization');
};
