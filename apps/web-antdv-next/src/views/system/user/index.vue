<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { UserPageResponse } from '#/api';

import { onMounted, ref } from 'vue';

import {
  Page,
  useVbenDrawer,
  useVbenModal,
  VbenButton,
  VbenInputPassword,
} from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteUser,
  pageUser,
  ResetPasswordEnums,
  resetUserPassword,
  updateUser,
} from '#/api';
import { getPublicKeyApi } from '#/api/core/auth';
import { $t } from '#/locales';
import { cryptoUtil } from '#/utils/crypto';

import {
  reloadDictData,
  roleOptions,
  useColumns,
  useGridFormSchema,
} from './data';
import Form from './modules/form.vue';

onMounted(async () => {
  await reloadDictData();
});

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
    columns: useColumns(onActionClick, onStatusChange, onRoleChange),
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
async function onStatusChange(newStatus: number, row: UserPageResponse) {
  const statusText: Recordable<string> = {
    0: $t('system.user.disable'),
    1: $t('system.user.enable'),
  };
  try {
    await confirm(
      `你要将 ${row.username} 的状态切换为【${statusText[String(newStatus)]}】吗？`,
      '切换状态',
    );
    await updateUser({ ...row, status: newStatus } as any);
    return true;
  } catch {
    return false;
  }
}

/**
 * 角色切换确认
 */
async function onRoleChange(newRoleId: string, row: UserPageResponse) {
  const roleName =
    roleOptions.find((r: any) => String(r.value) === String(newRoleId))
      ?.label ?? newRoleId;
  try {
    await confirm(
      `你要将 ${row.username} 的角色切换为【${roleName}】吗？`,
      '切换角色',
    );
    await updateUser({ ...row, roleId: newRoleId } as any);
    return true;
  } catch {
    return false;
  }
}

const resetPasswordValue = ref('');

const [ResetPasswordModal, resetPasswordModalApi] = useVbenModal({
  title: '',
  confirmText: '确定',
  onConfirm: async () => {
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
      await resetUserPassword({
        id: resetPasswordModalApi.getData().id,
        newPassword: encrypted,
        nonce,
        resetPasswordEnums: ResetPasswordEnums.Reset,
      });
      message.success('密码重置成功');
      resetPasswordModalApi.close();
      onRefresh();
    } catch {
      message.error('密码重置失败');
    }
  },
  onOpenChange: (isOpen) => {
    if (!isOpen) {
      resetPasswordValue.value = '';
    }
  },
});

function openResetPassword(row: UserPageResponse) {
  resetPasswordValue.value = '';
  resetPasswordModalApi
    .setData({ id: row.id })
    .setState({ title: `重置密码 - ${row.username}` })
    .open();
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

    <ResetPasswordModal>
      <VbenInputPassword
        v-model:model-value="resetPasswordValue"
        placeholder="请输入新密码"
        class="w-full"
      />
    </ResetPasswordModal>
  </Page>
</template>
