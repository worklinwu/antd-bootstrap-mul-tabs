import { memo } from 'react';
import { Spin } from 'antd';
import classnames from 'classnames';
import styles from './index.module.less';

const computedHeightValue = (height, containerPositionTop) => {
  if (height === true) {
    return `calc(100vh - ${Math.abs(containerPositionTop)}px)`;
  }
  if (typeof height === 'string') {
    return height;
  }
  if (typeof height === 'number') {
    return `${height}px`;
  }
  return 'auto';
};

const Header = ({ title, controls }) => {
  return (
    <>
      <div className={classnames('page-container-header', styles.header)}>
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>{controls}</div>
      </div>
    </>
  );
};

const Content = ({ children, ...otherProps }) => {
  return (
    <>
      <div className={classnames('page-container-content', styles.content)} {...otherProps}>
        {children}
      </div>
    </>
  );
};

/**
 * 页面内容布局组件
 * @param minHeight 最小高度, 如果是 true, 设置最小高度到底部. 如果是具体值使用具体值.
 * @param fixedHeight 固定高度, 规则同上
 * @param fixedHeader 是否固定头部
 * @param bgColor 设置背景设, 为 false 的时候不设置, 默认为 true
 * @param title 设置标题
 * @param controls 设置右侧的按钮栏
 * @param showFooter 是否显示页脚
 * @param loading 是否显示加载中
 * @param className 自定义样式
 * @param style 自定义样式
 * @param otherProps
 * @param children
 */
const PageContainer = ({
  minHeight = false,
  fixedHeight = false,
  fixedHeader = false,
  bgColor = true,
  title,
  controls,
  showFooter = false,
  loading = false,
  className,
  style,
  children,
  ...otherProps
}) => {
  const $pageTabsContent = document.querySelector('.page-tabs-content');
  const containerPositionTop = $pageTabsContent ? Number($pageTabsContent?.getBoundingClientRect().top) + 25 : null;

  const contentStyle = {
    // eslint-disable-next-line no-nested-ternary
    ...{ backgroundColor: bgColor ? (typeof bgColor === 'string' ? bgColor : '#ffffff') : 'transparent' },
    ...(fixedHeight || fixedHeader ? { flex: 1, overflow: 'auto' } : {}),
  };

  return (
    <Spin spinning={loading}>
      <div
        className={classnames('page-container', styles.pageContainer, className)}
        style={{
          height: computedHeightValue(fixedHeight, containerPositionTop),
          overflowY: fixedHeight ? 'auto' : 'inherit',
          minHeight: computedHeightValue(minHeight, containerPositionTop),
          display: fixedHeader ? 'flex' : 'block',
          boxShadow: bgColor ? '0 2px 4px 0 rgba(0, 0, 0, 0.05)' : 'none',
          ...contentStyle,
          ...style,
        }}
        {...otherProps}
      >
        {(title || controls) && <Header title={title} controls={controls} />}
        <Content style={contentStyle}>{children}</Content>
      </div>
      {!fixedHeight && showFooter && <div className={styles.footer}>Copyright@ 2021 xxxxx</div>}
    </Spin>
  );
};

PageContainer.Header = memo(Header);
PageContainer.Content = memo(Content);

PageContainer.displayName = 'PageContainer';
Header.displayName = 'PageContainerHeader';

export default PageContainer;
