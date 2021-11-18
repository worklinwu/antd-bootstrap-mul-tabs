import { parse } from 'querystring';
import { cloneDeep } from 'lodash';

/**
 * 返回url参考的对象格式
 */
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 将Object值中的null转换为undefined
 */
export const nullTransformationToUndefined = (value: any): any => {
  const cloneObj = cloneDeep(value);
  const transformationFunc = (obj: any): void => {
    if (obj instanceof Object) {
      const ary = Array.isArray(obj) ? obj : Object.keys(obj);
      ary.forEach((it, index) => {
        const key = Array.isArray(obj) ? index : it;
        if (obj[key] === null) {
          // eslint-disable-next-line no-param-reassign
          obj[key] = undefined;
        } else if (obj[key] instanceof Object) {
          transformationFunc(obj[key]);
        }
      });
    }
  };

  transformationFunc(cloneObj);

  return cloneObj;
};

/**
 * 过滤请求参数, 去掉空值/null/undefined
 * @param params
 * @returns params
 */
export function filterUsefulRequestParams(params) {
  const result = {};
  if (!params) {
    return null;
  }
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== '' && value !== undefined && value !== null) {
      // 是否要判断空数组?  !(value instanceof Array && value.length === 0)
      result[key] = value;
    }
  });
  return result;
}
