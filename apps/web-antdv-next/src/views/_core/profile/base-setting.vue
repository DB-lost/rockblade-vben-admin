<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';

import { computed, onMounted, ref } from 'vue';

import { ProfileBaseSetting } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { message } from 'antdv-next';

import { queryUserById, updateUser } from '#/api/system/user';
import { $t } from '#/locales';

const userStore = useUserStore();
const profileBaseSettingRef = ref();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'username',
      component: 'Input',
      label: $t('system.user.username'),
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'realName',
      component: 'Input',
      label: $t('system.user.nickname'),
    },
    {
      fieldName: 'email',
      component: 'Input',
      label: $t('system.user.email'),
    },
    {
      fieldName: 'phone',
      component: 'Input',
      label: $t('system.user.phone'),
    },
    {
      fieldName: 'desc',
      component: 'Textarea',
      componentProps: {
        rows: 3,
      },
      label: $t('system.user.remark'),
    },
  ];
});

async function handleSubmit(values: Record<string, any>) {
  try {
    await updateUser({
      id: userStore.userInfo?.userId,
      username: values.username,
      nickname: values.realName,
      email: values.email,
      phone: values.phone,
      // desc: values.desc,
    });
    message.success($t('ui.actionMessage.operationSuccess'));
  } catch {
    message.error($t('ui.actionMessage.operationFailed'));
  }
}

onMounted(async () => {
  const userId = userStore.userInfo?.userId;
  if (!userId) return;
  try {
    const info = await queryUserById(userId);
    profileBaseSettingRef.value.getFormApi().setValues({
      username: info.username,
      realName: info.nickname,
      email: info.email,
      phone: info.phone,
      //desc: info.desc,
    });
  } catch {
    // fallback to cached data
    const info = userStore.userInfo;
    if (info) {
      profileBaseSettingRef.value.getFormApi().setValues({
        username: info.username,
        realName: info.realName,
        email: info.email,
        phone: info.phone,
        desc: info.desc,
      });
    }
  }
});
</script>
<template>
  <ProfileBaseSetting
    ref="profileBaseSettingRef"
    :form-schema="formSchema"
    @submit="handleSubmit"
  />
</template>
