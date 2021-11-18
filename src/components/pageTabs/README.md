# PageTabs

React 中后台项目的多选项卡页面的解决方案

## 功能支持

[x] 默认打开选项卡
[x] 支持缓存页面
[x] 根据不同规则(路径字符串/history.push 对象/id/选项卡对象)等方式打开标签页
[x] 符合**匹配规则**的标签页会自动跳转, 而不是新开标签页
[x] 强制打开选项卡
[x] 支持打开/切换同路径的选项卡
[x] 支持刷新页面
[x] 支持选项卡级别的后退
[x] 支持不同方式的关闭选项卡
[x] 支持关闭选项卡跳转指定页签
[x] 选项卡关闭提示, 支持自定义文字, 或者自定义交互内容
[x] 支持 事件 注册与执行, 事情支持传参
[x] 支持选项卡跳转(replace 操作)
[x] 支持动态修改选项卡标题
[x] 支持动态注入一些特性, 例如关闭提示的功能
[x] 支持默认打开选项卡
[x] 支持设置标签不可关闭
[x] 没有任何选项卡时候, 默认跳转 '/'

### Export

PageTabs 共到处四个东西: usePageTabsContext, usePageEventListen, PageTabsProvider, PageTabs, KeepAliveWrapper

- usePageTabsContext: 获取选项卡状态, 调用 api 等操作
  `const { state, action } = usePageTabsContext()`
- usePageEventListen: 当需要使用事件的时候使用它
- PageTabsProvider: 这个组件需要放在一个不会轻易被销毁的外层位置, 通常是 Router 组件外层
- PageTabs: 选项卡主组件, 通常是 Router 组件外层
- KeepAliveWrapper: 每个路由都需要使用这个高阶组件包裹才能实现缓存效果

## API

```jsx
import { usePageTabsContext } from '@/components/PageTabs';
const { action } = usePageTabsContext();
```

### `getTabInstance` 获取选项卡实例

参数可以是:

- id
  action.getTabInstance("tab-/test/list-2231437-92523418")
- history.push 的对应参数
  action.getTabInstance({ pathname: '/test/list', query: { keyword: 1 } })
- 选项卡实例
  action.getTabInstance({ $isTab: true, ... })
- 路径字符串
  action.getTabInstance('/test/list?keyword=1')
- 为空表示当前选项卡
  action.getTabInstance() // 使用的时候一般用 action.getCurrentTab

### `getTabs` 获取所有选项卡

### `getCurrentTab` 获取当前高亮的选项卡

### `updateTabInstance` 更新选项卡实例

第一个参数可以是与 action.getTabInstance 一致的参数可是, 为空表示获取当前高亮选项卡, 如果没有找到, 后续的操作不会执行 (后面的接口基本类似, 不赘述)

```js
action.updateTabInstance(null, { closeTips: '动态添加的关闭提示' });
action.updateTabInstance('/test/list', { icon: 'xxx' });
```

目前可替换的字段有: name, fixed, icon, closeTips

### `addTab` 静默添加选项卡

通常用于打开默认标签页使用, 区别于 `openTab`, 这个 `api` 只是新增选项卡, 但是具体的页面还没有加载

### `openTab` 打开选项卡

打开标签页, 第二个参数, 或者 `target.state.force` 为 `true`, 会强制打开新的标签页, 忽略匹配规则

```js
action.openTab('/test/list') // 如果已经存在这个页签了, 会切换到这个选项卡
action.openTab('/test/list', { force: true }) // 即使存在这个页签了, 依然会打开一个新的标签页
action.openTab({ pathname: '/test/list', state: { force: false } }, true) // force 为 false
action.openTab({ $isTab: true, ... }, { force: true }) // 如果是选项卡对象, 会忽略第二个参数
```

### `replaceTab` 替换选项卡

只能替换当前高亮的选项卡.  
参数不能是 选项卡 id, 和选项卡对象.

通过 api 的方式替换当前页, 浏览器是会生成记录的, 可以使用后退来回到上个页面.  
如果使用了 `history.replace` 来替换页面, 选项卡内容页会替换, 但是不会生成历史记录, 是回退不了的.

替换前的页面依然会在缓存中, 在关闭选项卡后会把所有的历史选项卡缓存都进行删除.

```js
action.replaceTab('/test/list', true);
action.replaceTab({ pathname: '/test/list', state: { force: true } });
```

### `replaceTabTitle` 替换选项卡标题

### `enableBackPrevTab` 判断该选项卡是否可后退

配合 `backPrevTab` 使用, 一般只有 `action.replaceTab` 替换后的页面才会有后退的操作

### `backPrevTab` 当前选项卡后退到上个页面

后退前的页面会被缓存, 浏览器的前进会恢复页面

### `refreshTab` 刷新选项卡

选项卡的刷新, 会重新创建这个选项卡的内容.
只能刷新当前选项卡.

### `registerEvent` 注册事件

当你需要跨页面传递数据, 会通知执行某个函数时候, 可以用到这个.

```js
usePageEventListen(); // 必须添这个, 实际就是在 useActivate 生命周期里, 执行其他页面发送过来的事件
useEffect(() => {
  action.registerEvent({ ... }, 'testEvent', (msg) => { console.log('其他页面传递过来的参数:', msg) })
  action.registerEvent({ ... }, 'testEvent', (msg) => { console.log('同一个事件允许存在多个函数, 都会被执行') })
}, []);
```

### `unregisterEvent` 取消事件注册

页面被卸载的时候所有注册的事件会被删除.

```js
action.unregisterEvent({ ... }) // 取消这个页面的所有事件
action.unregisterEvent({ ... }, 'testEvent') // 取消指定的事件
action.unregisterEvent({ ... }, 'testEvent', someFn) // 取消该事件的指定方法
```

### `triggerEvent`

因为在触发其他页面注册的事件时候, 那个页面还在缓存中, 是不会执行事件的, 所以这个操作实际是往一个"事件池"里添加记录, 等到目标页面加载后, 就会执行对应的事件.  
事件可以传递参数.

```js
action.triggerEvent({ ... }, 'testEvent', 'param1'); // 'param1' 会被转换成 ['param1']
action.triggerEvent({ ... }, 'testEvent', ['param1', 'param2']);
action.triggerEvent({ ... }, 'testEvent', ['param1', 'param2']); // 如果是相同的事件, 会被忽略
```

### `execEvent` 执行事件池里的事件

通常不会主动调用这个接口, 这个接口会在 usePageEventListen 中被调用.  
如果需要在执行事件前做一些操作, 可以自己改造.

### `closeTab` 关闭选项卡

```js
action.closeTab(); // 关闭当前选项卡, 会自动定位右侧选项卡, 没有则定位列表最后一个选项卡
action.closeTab(null, { force: true }); // 忽略关闭提示
action.closeTab(null, { nextTab: '/', refresh: true }); // 关闭当前页面, 跳转目标页面并刷新
action.closeTab('/test/list'); // 如果匹配的选项卡不是当前选项卡, 就直接关闭, 并销毁实例
```

如果关闭的是当前的选项卡

### 关闭其他方式

选项卡上点击右键, 可以唤出菜单进行操作

- `closeOtherTab`
- `closeAllTab`
- `closeLeftTab`
- `closeRightTab`

## 注意事项

- 为了防止页面务必要的刷新, 导出页面组件的时候, 尽量加上 `React.memo`
