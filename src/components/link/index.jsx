import { Link as IceLink } from 'ice';
import * as queryString from 'query-string';

/**
 * 继承自 ice 的 Link, 增加对参数 query (对象格式的 search 参数) 的解析
 */
const Link = ({ to, children, ...otherProps }) => {
  if (typeof to === 'string') {
    return <IceLink to={to} {...otherProps} />;
  }
  return (
    <IceLink
      to={{
        ...to,
        search: to.query ? `?${queryString.stringify(to.query)}` : to.search,
      }}
      {...otherProps}
    >
      {children}
    </IceLink>
  );
};

Link.displayName = 'Link';

export default Link;
