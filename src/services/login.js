import { request } from 'ice';
import { filterUsefulRequestParams } from '@/utils';

export async function fakeAccountLogin(params) {
  return request.post('/api/login/account', params);
}

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 * @param verificationKey 验证码的key （必要时上送）
 * @param verificationValue 验证码值 （需要时上送）
 * @param auth_type mobile:表示手机验证码登录方式, 默认不传即可
 * @param internationalCode 国际冠码
 */
export async function login({ username, password, verificationKey, verificationValue, auth_type, internationalCode }) {
  return request.post(
    '/api/login',
    filterUsefulRequestParams({
      username,
      password,
      verificationKey,
      verificationValue,
      auth_type,
      internationalCode,
    }),
  );
}

/**
 * 登出
 */
export async function logout() {
  return request.post('/api/logout');
}

/**
 * 发送验证码接口
 * @param key 验证码的key，前端自行生成，对应于登录时的verificationKey参数，建议使用时间戳，保证每次生成不一样
 */
export async function getVerificationImg(key) {
  return request(`/api/verification/send?key=${key}`);
}
