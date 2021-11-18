import { useRequest as useRequestHook } from 'ice';
import type { CombineService, BaseOptions, BaseResult } from '@ahooksjs/use-request/es/types';
import { notification } from 'antd';

interface IResponse {
  code: number;
  data: any;
  msg: string;
}

interface IExpandOptions {
  captureError?: boolean;
  withFullResult?: boolean;
  formatResult?: (res: IResponse | any | null) => any;
}

type OmitBaseResult<R, P extends any[]> = Omit<BaseResult<R, P>, 'run'>;

interface IceBaseResult<R, P extends any[]> extends OmitBaseResult<R, P> {
  request: (...args: P) => Promise<R>;
}

/**
 * useRequest
 * 扩展 ahooks 中的 useRequest，集中处理后端返回的解析
 *   设置 captureError = true 可统一展示错误信息
 *   设置 withFullResult = true 可返回全部的 data 数据
 * @param {Function}service
 * @param {Object} options
 */
function useRequest<DataType = any, ParamsType extends any[] = any>(
  service: CombineService<DataType, ParamsType>,
  options?: BaseOptions<DataType, ParamsType> & IExpandOptions,
): IceBaseResult<DataType, ParamsType> {
  const originFormatResult = options?.formatResult;
  return useRequestHook(service, {
    throwOnError: true,
    ...options,
    formatResult: (res: IResponse) => {
      const { code, data, msg } = res;
      if (options?.withFullResult) {
        return originFormatResult ? originFormatResult(res) : res;
      } else if (code === 10000) {
        return originFormatResult ? originFormatResult(data) : data;
      } else {
        if (options?.captureError) {
          // message.error(msg);
          notification.error({
            message: '请求错误',
            description: msg,
          });
        }
        return originFormatResult ? originFormatResult(null) : null;
      }
    },
  } as any);
}

export default useRequest;
