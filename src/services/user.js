import { request } from 'ice';

/**
 * 获取用户基础信息
 */
export async function getUserBasicInfo() {
  return request.post('/api/getUserIfo');
}
