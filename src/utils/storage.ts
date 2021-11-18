import type { StoreAPI } from 'store2';
import 'store2/src/store.deep';
import { decrypt, encrypt } from './encrypt';

type systemStorageAPI = StoreAPI & {
  user?: () => systemStorageAPI;
  url?: () => systemStorageAPI;
  encrypt?: () => systemStorageAPI;
};

export const SYSTEM_STORAGE_KEY = 'SYSTEM';

/**
 * 缓存系统
 *
 * @example
   import storage from '@/utils/storage';

   // 基础用法
   // storage(key, data);                 // sets stringified data under key
   // storage(key);                       // gets and parses data stored under key
   // storage(key, fn[, alt]);            // run transaction function on/with data stored under key
   // storage({key: data, key2: data2});  // sets all key/data pairs in the object
   // storage();                          // gets all stored key/data pairs as an object
   // storage((key, data)=>{ });          // calls function for each key/data in storage, return false to exit
   // storage(false);                     // clears all items from storage
   // 建议使用下面的api
   storage.set(key, data[, overwrite]); // === store(key, data);
   storage.setAll(data[, overwrite]);   // === store({key: data, key2: data});
   storage.get(key[, alt]);             // === store(key);
   storage.getAll([fillObj]);           // === store();
   storage.transact(key, fn[, alt]);    // === store(key, fn[, alt]);
   storage.clear();                     // === store(false);
   storage.has(key);                    // returns true or false
   storage.remove(key[, alt]);          // removes key and its data, then returns the data or alt, if none
   storage.each(fn[, fill]);            // === store(fn); optional call arg will be 3rd fn arg (e.g. for gathering values)
   storage.add(key, data);              // concat, merges, or adds new value into existing one
   storage.keys([fillList]);            // returns array of keys
   storage.size();                      // number of keys, not length of data
   storage.clearAll();                  // clears *ALL* areas (but still namespace sensitive)

   storage.get('foo.bar') 或者 storage('foo.bar') // 支持 dot 的写法

   // 默认存在 localStorage, 可以选择存到 sessionStorage
   storage.session.get()

   // 如果这个缓存很短暂, 浏览器只要刷新就销毁的话, 可以使用这个:
   storage.page.set()

   // 与当前登录用户绑定, 只允许指定用户访问的数据
   storage.user().set('test', 123);
   // 与当前访问的 URL 绑定
   storage.page().set('article', { id: 'test' });
   // 可以组合使用
   storage.user().page().set(...)

   // 数据需要加密的话
   storage.encrypt().get()  // .set .setAll .getAll .add

   // 更多 api 参考 https://github.com/nbubna/store
 */
const storage: systemStorageAPI =
  // @ts-ignore
  window.store.namespace(SYSTEM_STORAGE_KEY);
storage.user = () => {
  return storage.namespace(`user-${storage.get('currentUser.id') || 'unknown'}`);
};
storage.url = () => {
  return storage.namespace(window.location.pathname + window.location.search);
};
storage.encrypt = () => {
  const storageNew = { ...storage };
  storageNew.set = (key, data, overwrite) => {
    return storage.set(key, encrypt(data), overwrite);
  };
  storageNew.get = (key, alt) => {
    return decrypt(storage.get(key, alt));
  };
  storageNew.getAll = () => {
    const encryptDataList = storage.getAll();
    const result = {};
    Object.keys(encryptDataList).forEach((key) => {
      result[key] = decrypt(encryptDataList[key]);
    });
    return result;
  };
  storageNew.add = (key, data) => {
    let newData: any;
    if (data instanceof Array) {
      newData = data.map((value) => {
        return encrypt(value);
      });
    }
    if (data && data instanceof Object) {
      newData = {};
      Object.keys(data).forEach((keyStr) => {
        newData[keyStr] = encrypt(data[keyStr]);
      });
    }
    return storage.add(key, newData);
  };
  return storageNew;
};

export default storage;
