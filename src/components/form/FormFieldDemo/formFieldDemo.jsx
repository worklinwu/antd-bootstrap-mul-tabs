import React, { useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ProForm } from '@/components/form';
import { Input } from 'antd';
import styles from './index.module.less';

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const FormFieldDemo = React.forwardRef((props, ref) => {
  const { value, onChange, disabled, placeholder, fieldProps, ...otherProps } = props;

  // 监听 value 变化
  useEffect(() => {}, [value]);

  // change 事件
  const handleChange = (val) => {
    onChange(val);
  };

  // 暴露方法
  useImperativeHandle(ref, () => ({}));

  return (
    <div>
      <ProForm.Item className={classNames(styles.wrapper, disabled && styles.disabled)} {...otherProps}>
        <Input placeholder={placeholder} {...fieldProps} onChange={handleChange} />
      </ProForm.Item>
    </div>
  );
});

FormFieldDemo.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
FormFieldDemo.defaultProps = {
  disabled: false,
};
FormFieldDemo.displayName = 'FormFieldDemo';

export default FormFieldDemo;
