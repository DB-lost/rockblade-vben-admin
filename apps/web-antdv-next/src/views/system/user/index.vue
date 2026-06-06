<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { UserPageResponse } from '#/api';

import { ref } from 'vue';

import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Input, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteUser, pageUser, resetUserPassword, updateUser } from '#/api';
import { getPublicKeyApi } from '#/api/core/auth';
import { $t } from '#/locales';
import { cryptoUtil } from '#/utils/crypto';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await pageUser({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
      response: {
        result: 'records',
        total: 'totalRow',
      },
    },
    rowConfig: {
      keyField: 'id',
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<UserPageResponse>,
});

function onActionClick(e: OnActionClickParams<UserPageResponse>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'resetPassword': {
      openResetPassword(e.row);
      break;
    }
  }
}

/**
 * 将 Antd 的 Modal.confirm 封装为 promise
 */
function confirm(content: string, title: string) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('已取消'));
      },
      onOk() {
        resolve(true);
      },
      title,
    });
  });
}

/**
 * 状态切换确认
 */
async function onStatusChange(
  newStatus: number,
  row: UserPageResponse,
) {
  const statusText: Recordable<string> = {
    0: $t('system.user.disable'),
    1: $t('system.user.enable'),
  };
  try {
    await confirm(
      `你要将 ${row.username} 的状态切换为【${statusText[String(newStatus)]}】吗？`,
      '切换状态',
    );
    await updateUser({
      id: row.id,
      username: row.username,
      nickname: row.nickname,
      status: newStatus,
    } as any);
    return true;
  } catch {
    return false;
  }
}

const resetPasswordVisible = ref(false);
const resetPasswordUsername = ref('');
const resetPasswordValue = ref('');
const resetPasswordUserId = ref('');

function openResetPassword(row: UserPageResponse) {
  resetPasswordUsername.value = row.username ?? '';
  resetPasswordUserId.value = row.id ?? '';
  resetPasswordValue.value = '';
  resetPasswordVisible.value = true;
}

async function handleResetPassword() {
  if (!resetPasswordValue.value) {
    message.warning('请输入新密码');
    return;
  }
  try {
    const { publicKey, nonce } = await getPublicKeyApi();
    cryptoUtil.setPublicKey(publicKey, nonce);
    const encrypted = cryptoUtil.encryptWithRSA(resetPasswordValue.value);
    if (!encrypted) {
      message.error('密码加密失败');
      return;
    }
    await resetUserPassword(resetPasswordUserId.value, {
      newPassword: encrypted,
      nonce,
    });
    message.success('密码重置成功');
    resetPasswordVisible.value = false;
    onRefresh();
  } catch {
    message.error('密码重置失败');
  }
}

function onDelete(row: UserPageResponse) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.username]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteUser(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.username]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.open();
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid :table-title="$t('system.user.title')">
      <template #toolbar-tools>
        <VbenButton type="default" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.user.name')]) }}
        </VbenButton>
      </template>
    </Grid>

    <Modal
      v-model:open="resetPasswordVisible"
      :title="`重置密码 - ${resetPasswordUsername}`"
      @ok="handleResetPassword"
    >
      <Input.Password
        v-model:value="resetPasswordValue"
        placeholder="请输入新密码"
        style="width: 100%"
      />
    </Modal>
  </Page>
</template>
