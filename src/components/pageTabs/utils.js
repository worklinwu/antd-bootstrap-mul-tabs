/**
 * 获取uuid
 */
export const getTabId = () => {
  return Math.floor(Math.random() * 10000000);
};

/** 深度便利扁平化所有路由 */
export const deepFlattenRoutes = (routes, parentPath = '/') => {
  return [].concat(
    ...routes.map((r) => {
      const absolutePathRegex = /^\//;
      const isAbsolutePath = absolutePathRegex.exec(r.path);
      const path = isAbsolutePath ? r.path : `${parentPath}/${r.path}`;

      const temp = { ...r, path };
      delete temp.children;

      if (Array.isArray(r.children)) {
        return [temp].concat(deepFlattenRoutes(r.children, path));
      } else {
        return [temp];
      }
    }),
  );
};

/** 根据location 生成 path */
export const generateRoutePath = (location) => {
  if (typeof location === 'string') {
    return location;
  }
  if (!location.pathname) {
    return '/';
  }
  // eslint-disable-next-line no-nested-ternary
  const search = location.search
    ? location.search
    : location.query
    ? Object.keys(location.query)
        .map((key) => `${key}=${location.query[key]}`)
        .join('&')
    : '';
  return `${location.pathname}${search ? `${search.indexOf('?') > -1 ? '' : '?'}${search}` : ''}${
    location.hash ? `#${location.hash}` : ''
  }`;
};

export const isEqualLocation = (a, b) => {
  if (JSON.stringify(a) === JSON.stringify(b)) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  if (a.pathname === b.pathname) {
    if (Object.keys(a.query || {}).length === Object.keys(b.query || {}).length) {
      if (Object.keys(a.query || {}).every((key) => a.query[key] === b.query[key])) {
        return true;
      }
    }
  }
  return false;
};

export const createTabId = (location) => {
  return `tab-${location.pathname}-${getTabId()}`;
};

/**
 * 创建一个新的页签
 */
export const createNewTab = (location, routeConfig) => {
  const { icon, title, fixed } = routeConfig?.pageConfig || {};
  const state = location?.state || {};
  const routePath = generateRoutePath(location);
  const id = createTabId(location);

  return {
    $isTab: true, // 用来判断是否是选项卡对象
    id,
    keepaliveId: `${id}-${getTabId()}`,
    location,
    icon: state?.icon || icon || '',
    name: title,
    fixed,
    ...routeConfig,
    ...state,
    // force: false, // 避免后退操作的时候新开一个标签页
    routePath,
  };
};

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export const parseQuery = function (query) {
  const reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
  const obj = {};
  while (reg.exec(query)) {
    obj[RegExp.$1] = RegExp.$2;
  }
  return obj;
};

export const parsePath = (path) => {
  const index = path.indexOf('?');
  const pathname = index > -1 ? path.substring(0, path.indexOf('?')) : path;
  const search = index > -1 ? path.substring(path.indexOf('?') + 1) : '';
  const query = parseQuery(search);
  return {
    pathname,
    search,
    query,
  };
};

export const isValidTabParam = (param) => {
  if (param) {
    if (typeof param === 'string' && param.indexOf('/') === 0) {
      return true;
    } else if (isObject(param) && param.pathname) {
      return true;
    }
  }
  return false;
};
