import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';

import { $t } from '#/locales';

const LEVEL_OPTIONS = [
  { label: '普通', value: 'NORMAL' },
  { label: '重要', value: 'IMPORTANT' },
  { label: '紧急', value: 'URGENT' },
];

const TYPE_OPTIONS = [
  { label: '系统', value: 'SYSTEM' },
  { label: '业务', value: 'BUSINESS' },
  { label: '警告', value: 'WARNING' },
];

const READ_STATUS_OPTIONS = [
  { label: $t('common.yes'), value: 1 },
  { label: $t('common.no'), value: 0 },
];

/**
 * 搜索表单
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('system.notification.title'),
    },
    {
      component: 'Select',
      fieldName: 'type',
      label: '消息类型',
      componentProps: {
        allowClear: true,
        options: TYPE_OPTIONS,
      },
    },
    {
      component: 'Select',
      fieldName: 'level',
      label: '紧急程度',
      componentProps: {
        allowClear: true,
        options: LEVEL_OPTIONS,
      },
    },
    {
      component: 'Select',
      fieldName: 'readStatus',
      label: '阅读状态',
      componentProps: {
        allowClear: true,
        options: READ_STATUS_OPTIONS,
      },
    },
  ];
}

/**
 * 表格列配置
 */
export function useColumns<T = any>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridColumns {
  return [
    {
      field: 'title',
      title: $t('system.notification.title'),
      minWidth: 160,
    },
    {
      field: 'content',
      title: '消息内容',
      minWidth: 200,
    },
    {
      field: 'type',
      title: '消息类型',
      width: 100,
    },
    {
      field: 'level',
      title: '紧急程度',
      width: 100,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'readStatus',
      title: '阅读状态',
      width: 100,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('system.notification.title'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'markRead',
            show: (row: any) => row.readStatus !== 1,
            text: '标记已读',
            type: 'link',
          },
          {
            code: 'delete',
            text: $t('ui.actionTitle.delete'),
            type: 'link',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.notification.title'),
      width: 150,
    },
  ];
}
