<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DictTypePageResponse } from '#/api';

import { ref } from 'vue';

import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDictType,
  pageDictType,
  refreshCacheApi,
  updateDictType,
} from '#/api';
import { useDict } from '#/composables/useDict';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import DictDataView from './data.vue';
import Form from './modules/type-form.vue';

const selectedType = ref<DictTypePageResponse | null>(null);
const { clearCache } = useDict();

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
          return await pageDictType({
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
  } as VxeTableGridOptions<DictTypePageResponse>,
});

function onActionClick(e: OnActionClickParams<DictTypePageResponse>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'manageData': {
      onManageData(e.row);
      break;
    }
  }
}

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

async function onStatusChange(newStatus: number, row: DictTypePageResponse) {
  const statusMap: Record<number, string> = {
    0: $t('common.disabled'),
    1: $t('common.enabled'),
  };
  try {
    await confirm(
      `你要将${row.name}的状态切换为 【${statusMap[newStatus]}】 吗？`,
      `切换状态`,
    );
    await updateDictType({
      id: row.id,
      name: row.name ?? '',
      code: row.code ?? '',
      status: newStatus,
    } as any);
    return true;
  } catch {
    return false;
  }
}

function onEdit(row: DictTypePageResponse) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: DictTypePageResponse) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteDictType(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
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
  formDrawerApi.setData({}).open();
}

function onRefreshCache() {
  const hideLoading = message.loading({
    content: $t('system.dict.type.refreshCache'),
    duration: 0,
    key: 'action_process_msg',
  });
  refreshCacheApi()
    .then(() => {
      clearCache();
      message.success({
        content: $t('ui.actionMessage.operationSuccess'),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onManageData(row: DictTypePageResponse) {
  selectedType.value = row;
}

function onBackToTypes() {
  selectedType.value = null;
  onRefresh();
}
</script>
<template>
  <div class="contents">
    <Page v-if="!selectedType" auto-content-height>
      <FormDrawer @success="onRefresh" />
      <!-- DictType 列表视图 -->
      <Grid>
        <template #toolbar-tools>
          <VbenButton variant="default" @click="onCreate">
            <Plus class="size-5" />
            {{ $t('ui.actionTitle.create', [$t('system.dict.type.name')]) }}
          </VbenButton>
          <VbenButton class="ml-2" variant="default" @click="onRefreshCache">
            {{ $t('system.dict.type.refreshCache') }}
          </VbenButton>
        </template>
      </Grid>
    </Page>
    <!-- DictData 子视图 -->
    <DictDataView v-if="selectedType" :selected-type="selectedType" @back="onBackToTypes" />
  </div>
</template>
