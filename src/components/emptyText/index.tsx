/** 空文本使用其他字符替换 */
const EmptyText = ({ children, replaceText = '--' }) => (
  <>{[null, undefined, false, ''].includes(children) ? replaceText : children}</>
);

EmptyText.displayName = 'EmptyText';

export default EmptyText;
