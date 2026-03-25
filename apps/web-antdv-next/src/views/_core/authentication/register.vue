<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref, useTemplateRef } from 'vue';

import { AuthenticationRegister, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, notification } from 'antdv-next';

import {
  AuthServiceEnums,
  getPublicKeyApi,
  registerApi,
  RegisterEnums,
  sendVerificationCodeApi,
  UseMethod,
  VerificationMethod,
} from '#/api';
import { router } from '#/router';
import { cryptoUtil } from '#/utils/crypto';

defineOptions({ name: 'Register' });

const loading = ref(false);
const CODE_LENGTH = 6;
const registerRef =
  useTemplateRef<InstanceType<typeof AuthenticationRegister>>('registerRef');

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
          const formApi = registerRef.value?.getFormApi();
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
            useMethod: UseMethod.Register,
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
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.mobileTip'),
      },
      fieldName: 'phone',
      label: $t('authentication.mobile'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.mobileTip') })
        .refine((v) => /^\d{11}$/.test(v), {
          message: $t('authentication.mobileErrortip'),
        }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.nicknameTip'),
      },
      fieldName: 'nickname',
      label: $t('authentication.nickname'),
      rules: z.string().min(1, { message: $t('authentication.nicknameTip') }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
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
    // {
    //   component: 'VbenCheckbox',
    //   fieldName: 'agreePolicy',
    //   renderComponentContent: () => ({
    //     default: () =>
    //       h('span', [
    //         $t('authentication.agree'),
    //         h(
    //           'a',
    //           {
    //             class: 'vben-link ml-1 ',
    //             href: '',
    //           },
    //           `${$t('authentication.privacyPolicy')} & ${$t('authentication.terms')}`,
    //         ),
    //       ]),
    //   }),
    //   rules: z.boolean().refine((value) => !!value, {
    //     message: $t('authentication.agreeTip'),
    //   }),
    // },
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

  await registerApi({
    authServiceEnums: AuthServiceEnums.Base,
    registerEnums: RegisterEnums.Username,
    password: encryptedPassword,
    phone: value.phone,
    email: value.email,
    nickname: value.nickname,
    nonce: nonce,
    voucher: value.code,
    username: value.username,
  }).then(async () => {
    notification.success({
      description: '注册成功，请登录',
    });
    await router.push('/auth/login');
  });
}
</script>

<template>
  <AuthenticationRegister
    ref="registerRef"
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
