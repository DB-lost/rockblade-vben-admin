<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';

import { computed } from 'vue';

import { ProfilePasswordSetting, z } from '@vben/common-ui';

import { message } from 'antdv-next';

import { getPublicKeyApi } from '#/api/core/auth';
import { changePassword } from '#/api/system/user';
import { $t } from '#/locales';
import { cryptoUtil } from '#/utils/crypto';

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'oldPassword',
      label: $t('profile.oldPassword'),
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('profile.oldPasswordPlaceholder'),
      },
      rules: z
        .string()
        .min(1, { message: $t('profile.oldPasswordPlaceholder') }),
    },
    {
      fieldName: 'newPassword',
      label: $t('profile.newPassword'),
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('profile.newPasswordPlaceholder'),
      },
      rules: z
        .string()
        .min(1, { message: $t('profile.newPasswordPlaceholder') }),
      renderComponentContent() {
        return {
          strengthText: () => $t('authentication.passwordStrength'),
        };
      },
    },
    {
      fieldName: 'confirmPassword',
      label: $t('profile.confirmPassword'),
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('profile.confirmPasswordPlaceholder'),
      },
      dependencies: {
        rules(values) {
          const { newPassword } = values;
          return z
            .string({
              required_error: $t('profile.confirmPasswordPlaceholder'),
            })
            .min(1, { message: $t('profile.confirmPasswordPlaceholder') })
            .refine((value) => value === newPassword, {
              message: $t('profile.confirmPasswordMismatch'),
            });
        },
        triggerFields: ['newPassword'],
      },
    },
  ];
});

async function handleSubmit(values: Record<string, any>) {
  try {
    const { publicKey, nonce } = await getPublicKeyApi();
    cryptoUtil.setPublicKey(publicKey, nonce);
    const encryptedOldPassword = cryptoUtil.encryptWithRSA(values.oldPassword);
    const encryptedNewPassword = cryptoUtil.encryptWithRSA(values.newPassword);
    if (!encryptedOldPassword || !encryptedNewPassword) {
      message.error('密码加密失败，请稍后再试');
      return;
    }
    await changePassword({
      oldPassword: encryptedOldPassword,
      newPassword: encryptedNewPassword,
      nonce,
    });
    message.success($t('profile.changeSuccess'));
  } catch {
    message.error($t('profile.changeFailed'));
  }
}
</script>
<template>
  <ProfilePasswordSetting
    class="w-1/3"
    :form-schema="formSchema"
    @submit="handleSubmit"
  />
</template>
