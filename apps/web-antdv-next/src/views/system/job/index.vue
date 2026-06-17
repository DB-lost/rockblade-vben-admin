<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { JobResponse } from '#/api';

import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteJob, listJob, pauseJob, resumeJob, triggerJob } from '#/api';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_params, formValues) => {
          const data = await listJob();
          // 状态值映射：NORMAL → 1（开启），PAUSED → 0（关闭），适配 CellSwitch
          let records = data.map((item: JobResponse) => ({
            ...item,
            _rawStatus: item.status,
            status: item.status === 'NORMAL' ? 1 : 0,
          }));
          // 客户端过滤
          if (formValues.jobHandlerName) {
            const keyword = String(formValues.jobHandlerName).toLowerCase();
            records = records.filter((r) =>
              r.jobHandlerName?.toLowerCase().includes(keyword),
            );
          }
          if (formValues.status) {
            records = records.filter((r) => r._rawStatus === formValues.status);
          }
          return {
            records,
            totalRow: records.length,
          };
        },
      },
      response: {
        result: 'records',
        total: 'totalRow',
      },
    },
    rowConfig: {
      keyField: 'jobHandlerName',
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<JobResponse>,
});

/**
 * 通用确认弹窗（封装 antd Modal.confirm 为 Promise）
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
 * 按钮点击分发
 */
function onActionClick(e: OnActionClickParams<JobResponse>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'trigger': {
      onTrigger(e.row);
      break;
    }
  }
}

/**
 * 状态开关切换（暂停/恢复）
 */
async function onStatusChange(newStatus: number, row: JobResponse) {
  const statusLabel: Recordable<string> = {
    0: $t('system.job.paused'),
    1: $t('system.job.normal'),
  };
  const action =
    newStatus === 1
      ? {
          api: resumeJob,
          confirm: $t('system.job.resumeConfirm', [row.jobHandlerName]),
        }
      : {
          api: pauseJob,
          confirm: $t('system.job.pauseConfirm', [row.jobHandlerName]),
        };
  try {
    await confirm(
      action.confirm,
      `${$t('system.job.status')} → ${statusLabel[String(newStatus)]}`,
    );
    await action.api(row.jobHandlerName);
    return true;
  } catch {
    return false;
  }
}

function onCreate() {
  formDrawerApi.open();
}

function onEdit(row: JobResponse) {
  formDrawerApi.setData(row).open();
}

async function onTrigger(row: JobResponse) {
  try {
    await confirm(
      $t('system.job.triggerConfirm', [row.jobHandlerName]),
      $t('system.job.trigger'),
    );
    message.loading({
      content: $t('ui.actionMessage.operationSuccess'),
      duration: 0,
      key: 'action_process_msg',
    });
    await triggerJob(row.jobHandlerName);
    message.success({
      content: $t('ui.actionMessage.operationSuccess'),
      key: 'action_process_msg',
    });
  } catch {
    // 用户取消或操作失败
  }
}

function onDelete(row: JobResponse) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.jobHandlerName]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteJob(row.jobHandlerName)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.jobHandlerName]),
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
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid :table-title="$t('system.job.list')">
      <template #toolbar-tools>
        <VbenButton variant="default" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.job.name')]) }}
        </VbenButton>
      </template>
    </Grid>
  </Page>
</template>
