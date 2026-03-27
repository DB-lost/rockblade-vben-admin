<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { TableInfoResponse } from '#/api';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { codegenTablePage, saveCodegenTable } from '#/api';

import { useGridFormSchema, useTableColumns } from '../data';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useTableColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: async ({ page }, formValues) => {
          return await codegenTablePage({
            page: page.currentPage,
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
  } as VxeTableGridOptions<TableInfoResponse>,
});

const [Modal, modalApi] = useVbenModal({
  onConfirm() {
    modalApi.close();
  },
});

async function onImport(row: TableInfoResponse) {
  // 获取搜索表单中的 dataSourceKey
  const formValues = await gridApi.formApi.getValues();

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.importing', [row.tableName]),
    duration: 0,
    key: 'action_process_msg',
  });

  saveCodegenTable({
    tableName: row.tableName,
    dataSourceKey: formValues.dataSourceKey,
  } as any)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.importSuccess', [row.tableName]),
        key: 'action_process_msg',
      });
      modalApi.close();
    })
    .catch(() => {
      hideLoading();
    });
}

function onActionClick(e: OnActionClickParams<TableInfoResponse>) {
  switch (e.code) {
    case 'add': {
      onImport(e.row);
      break;
    }
  }
}
</script>
<template>
  <Modal>
    <Page auto-content-height>
      <Grid :table-title="$t('infra.codegen.list')" />
    </Page>
  </Modal>
</template>
<style lang="css" scoped>
:deep(.ant-tree-title) {
  .tree-actions {
    @apply ml-5 hidden;
  }
}

:deep(.ant-tree-title:hover) {
  .tree-actions {
    @apply ml-5 flex flex-auto justify-end;
  }
}
</style>
