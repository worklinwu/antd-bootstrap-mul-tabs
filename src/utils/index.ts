// const isProd = process.env.ENV === 'production';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

/**
 * 判断是否是有效的 URL
 * @param path
 */
export const isUrl = (path: string): boolean => reg.test(path);

export const getUuid = (length) => Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);

/**
 * 是否是开发模式
 */
export const isDev = (): boolean => {
  const { NODE_ENV } = process.env;
  return NODE_ENV === 'development';
};

export * from './params';
export * from './string';
export * from './tree';
export * from './locale';
export * from './user';
export * from './encrypt';
export { default as storage } from './storage';
