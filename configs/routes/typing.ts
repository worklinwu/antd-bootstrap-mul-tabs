import { ReactElement } from 'react';
import { IRouterConfig } from 'ice';

export type ICustomRouterConfig = IRouterConfig & {
  pageConfig?: {
    title?: string; // 标题
    scrollToTop?: boolean; // 配置页面准入权限角色列表
    auth?: string[]; // 配置页面准入权限角色列表
    errorBoundary?: boolean; // 默认 false，进入页面时是否要滚动到顶部
    icon?: string | ReactElement; // 图标. 侧边栏和选项卡都会用到
    fixed?: boolean; // 是否固定选项卡. PageTabs 组件配置参数
    keepAlive?: boolean; // 是否缓存页面. PageTabs 组件配置参数
    closeTips?: boolean | ((callbackFn: () => boolean) => void); // 是否需要关闭提示. PageTabs 组件配置参数
    locale?: string; // 自定义菜单的国际化 key
    hideInMenu?: boolean; // 在菜单中隐藏自己和子节点
    hideInBreadcrumb?: boolean; // 在面包屑中隐藏
    hideChildrenInMenu?: boolean; // 会把这个路由的子节点在 menu 中隐藏
    flatMenu?: boolean; // 隐藏自己，并且将子节点提升到与自己平级
    target?: string; // 指定外链打开形式，同a标签
    [key: string]: any;
  };
};
