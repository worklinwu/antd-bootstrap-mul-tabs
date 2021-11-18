import { cloneElement } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import styles from './index.module.less';
import PropTypes from 'prop-types';

/**
 * 图标组件
 * @param title 鼠标经过时候的 tooltips 提示
 * @param getPopupContainer title有值时候有效, 自定义 tooltips 组件的挂载位置
 * @param link 变成链接的样式, 鼠标经过的时候会有高亮色
 * @param disabled 禁用, 会禁用 click 事件
 * @param iconfont iconfont className
 * @param icon 自定义图标, 如果是字符串, 使用 iconfont 字体图标, 如果是组件, 直接使用组件
 * @param size 图标大小
 * @param className 自定义 className
 * @param onClick click 事件
 * @param otherProps
 */
const Icon = ({
  getPopupContainer,
  title,
  link,
  disabled,
  iconfont = 'iconfont',
  icon,
  size = 20,
  className,
  onClick,
  ...otherProps
}) => {
  const isIconFont = typeof icon === 'string';
  const iconComponent = (
    <span
      className={classnames(className, styles.iconWrapper, { [styles.link]: link })}
      onClick={disabled ? () => {} : onClick}
    >
      {!isIconFont ? (
        cloneElement(icon, {
          style: { fontSize: `${size}px`, lineHeight: `${size}px`, cursor: onClick ? 'pointer' : '' },
          className: classnames({ [styles.disabled]: disabled, [styles.icon]: !link }),
          ...otherProps,
        })
      ) : (
        <i
          style={{ fontSize: `${size}px`, lineHeight: `${size}px`, cursor: onClick ? 'pointer' : '' }}
          className={classnames(iconfont, icon, { [styles.disabled]: !!disabled, [styles.icon]: !link })}
          {...otherProps}
        />
      )}
    </span>
  );

  if (!title) {
    return iconComponent;
  }

  return (
    <Tooltip title={title} arrowPointAtCenter getPopupContainer={getPopupContainer || (() => document.body)}>
      {iconComponent}
    </Tooltip>
  );
};

Icon.displayName = 'Icon';

Icon.propTypes = {
  title: PropTypes.string,
  getPopupContainer: PropTypes.func,
  link: PropTypes.bool,
  disabled: PropTypes.bool,
  iconfont: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  size: PropTypes.number,
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  size: 20,
  disabled: false,
  link: false,
  iconfont: 'iconfont',
};

export default Icon;
