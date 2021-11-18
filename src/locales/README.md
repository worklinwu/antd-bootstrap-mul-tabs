# 多语言使用方式

详细文档参考 https://formatjs.io/docs/react-intl

```jsx
import { useIntl } from 'react-intl';

export default () => {
  const intl = useIntl();

  return <>{intl.formatMessage({ id: 'xxxx' })}</>;
};
```

```jsx
import { FormattedMessage } from 'react-intl';

export default () => {
  const intl = useIntl();

  return (
    <>
      <FormattedMessage id="xxxxx">{(txt) => <h1>{txt}</h1>}</FormattedMessage>
    </>
  );
};
```
