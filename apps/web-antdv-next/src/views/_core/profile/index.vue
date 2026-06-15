<script setup lang="ts">
import { ref } from 'vue';

import { Profile } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { message } from 'antdv-next';

import { fileUploadApi } from '#/api/core/common';
import { updateUser } from '#/api/system/user';
import { $t } from '#/locales';

import ProfileBase from './base-setting.vue';
import ProfileNotificationSetting from './notification-setting.vue';
import ProfilePasswordSetting from './password-setting.vue';
import ProfileSecuritySetting from './security-setting.vue';

const userStore = useUserStore();

const tabsValue = ref<string>('basic');
const fileInputRef = ref<HTMLInputElement>();

const tabs = ref([
  {
    label: $t('profile.updateBasicProfile'),
    value: 'basic',
  },
  {
    label: $t('profile.updatePassword'),
    value: 'password',
  },
  // {
  //   label: '安全设置',
  //   value: 'security',
  // },
  // {
  //   label: '新消息提醒',
  //   value: 'notice',
  // },
]);

function handleAvatarClick() {
  fileInputRef.value?.click();
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // 校验文件类型
  if (!file.type.startsWith('image/')) {
    message.error('请选择图片文件');
    return;
  }

  // 校验文件大小 (最大 5MB)
  if (file.size > 5 * 1024 * 1024) {
    message.error('图片大小不能超过5MB');
    return;
  }

  const hideLoading = message.loading('正在上传...', 0);

  try {
    const avatarUrl = await fileUploadApi(file, true);
    await updateUser({
      ...userStore.userInfo,
      avatar: avatarUrl,
      nickname: userStore.userInfo?.realName || userStore.userInfo?.username,
      id: userStore.userInfo?.userId,
    });
    if (userStore.userInfo) {
      userStore.setUserInfo({
        ...userStore.userInfo,
        avatar: avatarUrl,
      });
    }
    hideLoading();
    message.success('头像更新成功');
  } catch {
    hideLoading();
    message.error('头像上传失败');
  } finally {
    // 重置 input 以便重复选择同一文件时也能触发 change 事件
    input.value = '';
  }
}
</script>
<template>
  <Profile
    v-model:model-value="tabsValue"
    :title="$t('page.auth.profile')"
    :user-info="userStore.userInfo"
    :tabs="tabs"
    @avatar-click="handleAvatarClick"
  >
    <template #content>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
      <ProfileBase v-if="tabsValue === 'basic'" />
      <ProfileSecuritySetting v-if="tabsValue === 'security'" />
      <ProfilePasswordSetting v-if="tabsValue === 'password'" />
      <ProfileNotificationSetting v-if="tabsValue === 'notice'" />
    </template>
  </Profile>
</template>
