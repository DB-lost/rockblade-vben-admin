import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { SystemMenuApi } from '#/api/system/menu';

import { $t } from '#/locales';

export function getMenuTypeOptions() {
  return [
    {
      color: 'processing',
      label: $t('system.menu.typeCatalog'),
      value: 'CATALOG',
    },
    { color: 'default', label: $t('system.menu.typeMenu'), value: 'MENU' },
    { color: 'error', label: $t('system.menu.typeButton'), value: 'BUTTON' },
    {
      color: 'success',
      label: $t('system.menu.typeEmbedded'),
      value: 'EMBEDDED',
    },
    { color: 'warning', label: $t('system.menu.typeLink'), value: 'LINK' },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<SystemMenuApi.SystemMenu>,
): VxeTableGridColumns<SystemMenuApi.SystemMenu> {
  return [
    {
      field: 'meta.title',
      fixed: 'left',
      slots: { default: 'title' },
      title: $t('system.menu.menuTitle'),
      treeNode: true,
      width: 250,
    },
    {
      align: 'center',
      cellRender: { name: 'CellTag', options: getMenuTypeOptions() },
      field: 'type',
      title: $t('system.menu.type'),
      width: 100,
    },
    {
      field: 'authCode',
      title: $t('system.menu.authCode'),
      width: 200,
    },
    {
      field: 'path',
      title: $t('system.menu.path'),
      width: 200,
    },

    {
      field: 'component',
      formatter: ({ row }) => {
        switch (row.type) {
          case 'CATALOG':
          case 'MENU': {
            return row.component ?? '';
          }
          case 'EMBEDDED': {
            return row.meta?.iframeSrc ?? '';
          }
          case 'LINK': {
            return row.meta?.link ?? '';
          }
        }
        return '';
      },
      minWidth: 200,
      title: $t('system.menu.component'),
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('system.menu.status'),
      width: 100,
    },

    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'append',
            text: '新增下级',
          },
          'edit', // 默认的编辑按钮
          'delete', // 默认的删除按钮
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.menu.operation'),
      width: 200,
    },
  ];
}
