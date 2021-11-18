import { useRef, useState } from 'react';
import { Form, message, Spin } from 'antd';
import { history } from 'ice';
import { useIntl } from 'react-intl';

import { useRequest } from '@/hooks';
import { login } from '@/services/login';
import { Icon } from '@/components';
import { filterUsefulRequestParams, getPageQuery } from '@/utils/params';
import ProForm, { ProFormDependency, ProFormText } from '@ant-design/pro-form';
import { getUuid, setUserTokenToCookie } from '@/utils';
import FormItemVerifyCode from '@/pages/login/components/formItemVerifyCode';
import styles from './index.module.less';

const Login = () => {
  const intl = useIntl();
  const formRef = useRef();
  const [verifyCodeVisible, setVerifyCodeVisible] = useState(false);
  const [errorCount, setErrorCount] = useState(0); // 密码错误次数

  const { request, loading } = useRequest((params) => login(params), {
    manual: true,
    throwOnError: true,
    withFullResult: true,
    onSuccess: (res) => {
      const { code, data, msg } = res || {};
      if (code === 10000) {
        const { token, tokenType, expiresIn, refreshToken, userCode } = data;
        setUserTokenToCookie({ token, tokenType, expiresIn, refreshToken, userCode });

        message.success('登录成功！');
        // 判断调转的目标url
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect || '');

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          }
        }
        history.replace(redirect || '/');
      } else if (res.code === 20010 || res.code === 20100) {
        setVerifyCodeVisible(true);
        formRef.current?.setFieldsValue({
          verificationKey: getUuid(18),
        });
        message.error(msg);
      } else if (res.code === 10201) {
        formRef.current?.setFieldsValue({
          verificationKey: getUuid(18),
        });
        message.error(msg);
      } else {
        message.error(msg || 'Request Error!');
      }
    },
    onError: (error) => {
      message.error(error.message);
      const currentErrorCount = errorCount + 1;
      setErrorCount(currentErrorCount);
    },
  });

  const onFinish = (formValue) => {
    const submitData = {
      username: formValue.username?.trim(),
      password: formValue.password?.trim(),
      verificationKey: formValue.verificationKey,
      verificationValue: formValue.verificationValue,
    };
    request(filterUsefulRequestParams(submitData));
  };

  const handleVerificationKeyChange = (verificationKey) => {
    formRef.current?.setFieldsValue({
      verificationKey,
    });
  };

  return (
    <Spin spinning={loading}>
      <ProForm
        formRef={formRef}
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: intl.formatMessage({ id: 'login.btn.login' }),
          },
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        isKeyPressSubmit
        className={styles.loginForm}
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <Icon size={16} icon="icon-signin_user_default" />,
          }}
          placeholder={intl.formatMessage({ id: 'login.username.placeholder' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'login.username.required' }),
            },
            {
              pattern: /^[a-zA-Z0-9-_.@]+$/,
              message: intl.formatMessage({ id: 'login.username.format' }),
            },
            {
              min: 8,
              max: 120,
              message: intl.formatMessage({ id: 'login.username.length' }),
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <Icon size={16} icon="icon-signin_password_default" />,
          }}
          placeholder={intl.formatMessage({ id: 'login.password.placeholder' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'login.password.required' }),
            },
            {
              pattern: /^[a-zA-Z0-9]+$/,
              message: intl.formatMessage({ id: 'login.password.format' }),
            },
            {
              min: 8,
              max: 20,
              message: intl.formatMessage({ id: 'login.password.length' }),
            },
          ]}
        />
        <Form.Item name="verificationKey" noStyle x-if={verifyCodeVisible}>
          <input type="hidden" />
        </Form.Item>
        <ProFormDependency name={['verificationKey']}>
          {({ verificationKey }) => {
            return (
              <Form.Item
                name="verificationValue"
                x-if={verifyCodeVisible}
                shouldUpdate
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'login.verifyCode.required' }),
                  },
                  {
                    len: 5,
                    message: intl.formatMessage({ id: 'login.verifyCode.length' }),
                  },
                ]}
              >
                <FormItemVerifyCode
                  verificationKey={verificationKey}
                  onVerificationKeyChange={handleVerificationKeyChange}
                />
              </Form.Item>
            );
          }}
        </ProFormDependency>
      </ProForm>
    </Spin>
  );
};

export default Login;
