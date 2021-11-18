import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import { isEmpty } from 'lodash-es';

const defaultEncryptKey = 'xxxxx';

// 获取解密后数据
export const getDecrypt = (params: any, secrets: string): any => {
  return JSON.parse(
    AES.decrypt(params, CryptoJS.enc.Utf8.parse(secrets), {
      iv: CryptoJS.enc.Utf8.parse(secrets),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8),
  );
};

// 生成Hash
export const getSign = (timestamp: number, apiKeys: string, params: any): string => {
  return MD5(`${timestamp}${apiKeys}${params}`).toString().toUpperCase();
};

// 加密数据
export const encrypt = (data: any, secrets: string = defaultEncryptKey): string => {
  return AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(secrets), {
    iv: CryptoJS.enc.Utf8.parse(secrets),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};

// 解密数据
export const decrypt = (params: any, secrets: string = defaultEncryptKey, encryption = true): any => {
  if (typeof params !== 'string' || encryption === false) return params;
  try {
    return params && !isEmpty(params) ? getDecrypt(params, secrets) : params;
  } catch (error) {
    console.error('解密失败--->', error);
    return params;
  }
};
