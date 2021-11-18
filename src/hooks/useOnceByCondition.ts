import { useState } from 'react';

/**
 * 当条件符合时才执行, 且执行一次函数, 函数返回的值当做结果缓存下来
 * @param fn
 * @param condition
 * @returns {*[]}
 */
export default function useOnceByCondition<T>(fn: (...arg: any[]) => T, condition: Function | boolean): T | null {
  const [data, setData] = useState<T | null>(null);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  if (!isChanged) {
    if (condition instanceof Function ? condition() : condition) {
      setData(fn());
      setIsChanged(true);
    }
  }

  return data;
}
