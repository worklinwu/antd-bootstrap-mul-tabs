import { memo, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Input } from 'antd';
import { omit } from 'lodash-es';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useControllableValue } from 'ahooks';
import { Icon } from '@/components';
import { getVerificationImg } from '@/services/login';
import { getUuid } from '@/utils';
import styles from '../index.module.less';

/**
 * 基础模板
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const FormItemVerifyCode = forwardRef((props, ref) => {
  const otherProps = omit(props, ['value', 'onChange', 'verificationKey', 'onVerificationKeyChange']);
  const [value, onChange] = useControllableValue(props);
  const [verificationKey, onVerificationKeyChange] = useControllableValue(props, {
    defaultValuePropName: 'verificationDefaultKey',
    valuePropName: 'verificationKey',
    trigger: 'onVerificationKeyChange',
  });
  const [imgSrc, setImgSrc] = useState('');
  const intl = useIntl();

  // 获取验证码
  const handleRequestVerificationKey = () => {
    const key = getUuid(18);
    onVerificationKeyChange(key);
  };

  // 监听 verificationKey 变化
  useEffect(() => {
    if (verificationKey) {
      getVerificationImg(verificationKey).then(({ data }) => {
        setImgSrc(`data:image/png;base64,${data}`);
      });
    }
  }, [verificationKey]);

  // 暴露方法
  useImperativeHandle(ref, () => ({}));

  return (
    <div className={styles.formItemVerifyCode}>
      <Input
        value={value}
        onChange={onChange}
        // fieldProps={{
        //   size: 'large',
        //   prefix: <UserOutlined />,
        // }}
        prefix={<Icon size={16} icon="icon-signin_Code_default" />}
        allowClear
        placeholder={intl.formatMessage({ id: 'login.verifyCode.placeholder' })}
        className={styles.formItemVerifyCodeInput}
        {...otherProps}
      />
      <div x-if={!imgSrc} className={styles.formItemVerifyCodeImgPlaceholder} onClick={handleRequestVerificationKey} />
      <img x-else src={imgSrc} className={styles.formItemVerifyCodeImg} alt="" onClick={handleRequestVerificationKey} />
    </div>
  );
});

FormItemVerifyCode.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  verificationKey: PropTypes.string,
  onVerificationKeyChange: PropTypes.func,
  disabled: PropTypes.bool,
};
FormItemVerifyCode.defaultProps = {
  value: null,
  verificationKey: null,
  disabled: false,
};
FormItemVerifyCode.displayName = 'FormItemVerifyCode';

export default memo(FormItemVerifyCode);
