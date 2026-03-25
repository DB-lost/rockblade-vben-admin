<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref, useTemplateRef } from 'vue';

import { AuthenticationForgetPassword, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, notification } from 'antdv-next';

import {
  AuthServiceEnums,
  getPublicKeyApi,
  resetPasswordApi,
  sendVerificationCodeApi,
  UseMethod,
  VerificationMethod,
} from '#/api';
import { router } from '#/router';
import { cryptoUtil } from '#/utils/crypto';

defineOptions({ name: 'ForgetPassword' });

const loading = ref(false);
const CODE_LENGTH = 6;
const forgetPasswordRef =
  useTemplateRef<InstanceType<typeof AuthenticationForgetPassword>>(
    'forgetPasswordRef',
  );
const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: 'example@example.com',
      },
      fieldName: 'email',
      label: $t('authentication.email'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.emailTip') })
        .email($t('authentication.emailValidErrorTip')),
    },
    {
      component: 'VbenPinInput',
      componentProps: {
        codeLength: CODE_LENGTH,
        createText: (countdown: number) => {
          const text =
            countdown > 0
              ? $t('authentication.sendText', [countdown])
              : $t('authentication.sendCode');
          return text;
        },
        handleSendCode: async () => {
          const formApi = forgetPasswordRef.value?.getFormApi();
          if (!formApi) {
            throw new Error('formApi is not ready');
          }
          await formApi.validateField('email');
          const isEmailReady = await formApi.isFieldValid('email');
          if (!isEmailReady) {
            throw new Error($t('authentication.emailValidErrorTip'));
          }
          const { email } = await formApi.getValues();

          message.loading({
            content: 'Sending code...',
            duration: 0,
            key: 'sending-code',
          });
          //  发送验证码 API
          await sendVerificationCodeApi({
            account: email,
            authServiceEnums: AuthServiceEnums.Base,
            useMethod: UseMethod.Reset,
            verificationMethod: VerificationMethod.Email,
          })
            .then(() => {
              message.success({
                content: `Code sent to ${email}`,
                duration: 3,
                key: 'sending-code',
              });
            })
            .catch(() => {
              message.destroy('sending-code');
            });
        },
        placeholder: $t('authentication.code'),
      },
      fieldName: 'code',
      label: $t('authentication.code'),
      rules: z.string().length(CODE_LENGTH, {
        message: $t('authentication.codeTip', [CODE_LENGTH]),
      }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      renderComponentContent() {
        return {
          strengthText: () => $t('authentication.passwordStrength'),
        };
      },
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.confirmPassword'),
      },
      dependencies: {
        rules(values) {
          const { password } = values;
          return z
            .string({ required_error: $t('authentication.passwordTip') })
            .min(1, { message: $t('authentication.passwordTip') })
            .refine((value) => value === password, {
              message: $t('authentication.confirmPasswordTip'),
            });
        },
        triggerFields: ['password'],
      },
      fieldName: 'confirmPassword',
      label: $t('authentication.confirmPassword'),
    },
  ];
});

async function handleSubmit(value: Recordable<any>) {
  // 获取公钥
  const { publicKey, nonce } = await getPublicKeyApi();
  // 存储公钥和随机字符串到加密工具
  cryptoUtil.setPublicKey(publicKey, nonce);
  // 使用公钥加密密码
  const encryptedPassword = cryptoUtil.encryptWithRSA(value.password);
  if (!encryptedPassword) {
    notification.error({
      description: '密码加密失败，请稍后再试',
    });
    return;
  }

  await resetPasswordApi({
    authServiceEnums: AuthServiceEnums.Base,
    useMethod: UseMethod.Reset,
    verificationMethod: VerificationMethod.Email,
    account: value.email,
    newPassword: encryptedPassword,
    nonce: nonce,
    voucher: value.code,
  }).then(async () => {
    notification.success({
      description: '重置成功，请登录',
    });
    await router.push('/auth/login');
  });
}
</script>

<template>
  <AuthenticationForgetPassword
    ref="forgetPasswordRef"
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
