## 多选项卡风格的后台管理系统

## 使用

```bash
# 安装依赖
$ yarn install

# 启动服务
$ yarn start # visit http://localhost:3333
$ yarn run dev # 启用 mock serve
```

[More docs](https://ice.work/docs/guide/about).

## 指南

### 目录结构

```md
├── build/ # 构建产物
├── mock/ # 本地模拟数据
│ ├── index.[j,t]s
├── configs/ # 项目配置
│ └── routes 路由配置
├── public/
│ ├── index.html # 应用入口 HTML
│ └── favicon.png # Favicon
├── src/ # 源码路径
│ ├── assets/ # 静态资源
│ ├── components/ # 自定义业务组件
│ │ └── guide/
│ │  ├── index.[j,t]sx
│ │  ├── index.module.scss
│ ├── hooks/ # 自定义 Hooks
│ ├── layouts/ # 布局组件
│ ├── locales/ # 多语言配置
│ ├── models/ # 应用级数据状态
│ │ └── useUserModel.[j,t]s
│ ├── pages/ # 页面
│ │ └── home/ # home 页面，约定路由转成小写
│ │  ├── components/ # 页面级自定义业务组件
│ │  ├── useHomeModel.[j,t]sx # 页面级数据状态
│ │  ├── services.[j,t]sx # 页面级数据请求
│ │  ├── index.[j,t]sx # 页面入口
│ │  └── index.module.scss # 页面样式文件
│ ├── services/ # 应用级别的数据请求 
│ ├── utils/ # 工具库 
│ ├── styles/ # 应用级别样式定义, 及样式工具库 
│ ├── global.less # 全局样式
│ └── app.[j,t]s[x] # 应用入口脚本
├── build.config.json # 工程配置
├── README.md
├── package.json
├── .commitlintrc.js
├── .editorconfig
├── .eslintignore
├── .eslintrc.[j,t]s
├── .gitignore
├── .prettierignore
├── .prettierrc.js
├── .stylelintignore
├── .stylelintrc.[j,t]s
├── .gitignore
└── [j,t]sconfig.json
```

### 路由配置

基础配置参考 ice 的[路由配置](https://ice.work/docs/guide/basic/router).  
框架在这基础上做了扩展, 将侧边栏导航和选项卡的配置整合进 `pageConfig` 配置中.  


```ts
type ICustomRouterConfig = IRouterConfig & {
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
```

### 样式方案

基础方案参考 ice 的[路由配置](https://ice.work/docs/guide/basic/router).  
在此基础上, 覆写了 antd 的配置文件, 实现自定义样式, 配置文件在 `src/styles/theme.less` 这个目录.  

> module css 方案要注意, 文件名称需要加 `.module.[c|sa|le]ss` 的后缀, 和 umijs 的样式方案不同.  

> 我目前的版本是 2.1.1, 样式有坑, theme.less 的文件开发下会失效, 打包又是正常的. 所以, 自定义样式要改两个地方, 一个是 build.config.js 文件, 一个是 theme.less文件 

#### iconfont 图标

项目要使用非 antd 库的图标, 提供了组件 `Icon` 组件来使用 `iconfont` 字体图标. 在 `public.html` 页面注入 `iconfont` 的文件, 页面通过组件可以直接使用.  

### 数据请求

基础方案参考 ice 的[数据请求](https://ice.work/docs/guide/basic/request/).  
在此基础上封装了 ice 提供的 `useRequest` 方法. (不使用 ahooks 的 useRequest, 引包的时候需要注意路径).  

### 数据Mock

参考 ice 文档的 [数据Mock](https://ice.work/docs/guide/basic/request#mock-%E6%8E%A5%E5%8F%A3)

### 状态管理

放弃使用 ice 自带的 store 方案.  
本项目使用 `hox` 方案, 比较轻量一些, 使用方法参考[文档](https://github.com/umijs/hox/blob/master/README-cn.md).  

### Hooks

Hooks 基础引用 `ahooks@3.x`, 参考[文档](https://ahooks-next.surge.sh/zh-CN/hooks/).  
使用的时候统一引用 `import { xxx } from '@/hooks'`.  
提供的其他 hooks, 请参考对应 hooks 下的 README.md 文件, 或者文档注释.  

### 工具库

使用方式, `import { xxx } from '@/utils'`.  
具体说明参考工具函数的 README.md 文件, 或者文档注释.  

### 缓存管理

缓存集成 `store2`.  
使用方式, `import { storage } from '@/utils'`.  
具体使用方式参考 `src/utils/storage.ts` 的文档注释.  

### 静态资源处理

参考 ice 的[静态资源处理](https://ice.work/docs/guide/basic/assets).

### 多语言

基础方案使用 `react-intl`, 使用方法参考[文档](https://formatjs.io/docs/react-intl).  
设置全局语言方案和读取全局语言方案使用 `import { getLocale, setLocale } from '@/utils'`.  

### 多页签

使用方法参考 `src/components/pageTabs/README.md` 文档.  

### 环境配置

参考 ice 文档的 [环境配置](https://ice.work/docs/guide/basic/config)
