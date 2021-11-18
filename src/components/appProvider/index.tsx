import { Children, ReactElement, ReactNode } from 'react';

import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
// 引入 ice 組件之語言包
import zhCN from 'antd/lib/locale/zh_CN';
import { AliveScope } from 'react-activation';
import { IntlProvider } from 'react-intl';

import localeEnUS from '@/locales/en-US';
// 引入 locale 語言包
import localeZhCN from '@/locales/zh-CN';

interface Props {
  locale: string;
  children: ReactElement | ReactNode;
}

const appLocales = {
  'zh-CN': {
    intl: 'zh',
    next: zhCN,
    messages: localeZhCN,
  },
  'en-US': {
    intl: 'en',
    next: enUS,
    messages: localeEnUS,
  },
};

(() => {
  const throttle = (type: string, name: string, obj: Window = window) => {
    let running = false;

    const func = () => {
      if (running) return;

      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  if (typeof window !== 'undefined') {
    throttle('resize', 'optimizedResize');
  }
})();

function AppConfigProvider(props: Props) {
  const { locale, children } = props;

  const userLocale = appLocales[locale] ? appLocales[locale] : appLocales['zh-CN'];

  return (
    /* keep-alive 必要组件 */
    <AliveScope>
      {/* 多语言 */}
      <IntlProvider locale={userLocale.intl} messages={userLocale.messages} key={locale}>
        {/* antdUI库的全局配置 */}
        <ConfigProvider locale={userLocale.next}>{Children.only(children)}</ConfigProvider>
      </IntlProvider>
    </AliveScope>
  );
}

export default AppConfigProvider;
