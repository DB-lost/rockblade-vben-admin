import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { JobResponse } from '#/api';

import { $t } from '#/locales';

/**
 * 新增/编辑表单
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'jobHandlerName',
      label: $t('system.job.jobHandlerName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'cronExpression',
      label: $t('system.job.cronExpression'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'jobHandlerParam',
      label: $t('system.job.jobHandlerParam'),
    },
    {
      component: 'InputNumber',
      fieldName: 'retryCount',
      label: $t('system.job.retryCount'),
      defaultValue: 0,
      componentProps: {
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'retryInterval',
      label: $t('system.job.retryInterval'),
      defaultValue: 0,
      componentProps: {
        min: 0,
      },
    },
  ];
}

/**
 * 搜索表单（客户端过滤）
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'jobHandlerName',
      label: $t('system.job.jobHandlerName'),
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: $t('system.job.status'),
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('system.job.normal'), value: 'NORMAL' },
          { label: $t('system.job.paused'), value: 'PAUSED' },
        ],
      },
    },
  ];
}

/**
 * 表格列配置
 */
export function useColumns<T = JobResponse>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (
    newStatus: number,
    row: T,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridColumns {
  return [
    {
      field: 'jobHandlerName',
      title: $t('system.job.jobHandlerName'),
      minWidth: 160,
    },
    {
      field: 'cronExpression',
      title: $t('system.job.cronExpression'),
      minWidth: 140,
    },
    {
      field: 'jobHandlerParam',
      title: $t('system.job.jobHandlerParam'),
      minWidth: 120,
    },
    {
      field: 'retryCount',
      title: $t('system.job.retryCount'),
      width: 100,
    },
    {
      field: 'retryInterval',
      title: $t('system.job.retryInterval'),
      width: 130,
    },
    {
      field: 'nextFireTime',
      title: $t('system.job.nextFireTime'),
      width: 180,
    },
    {
      field: 'previousFireTime',
      title: $t('system.job.previousFireTime'),
      width: 180,
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('system.job.status'),
      width: 100,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'jobHandlerName',
          nameTitle: $t('system.job.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'trigger',
            text: $t('system.job.trigger'),
            type: 'link',
          },
          {
            code: 'edit',
            text: $t('ui.actionTitle.edit'),
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
      title: $t('system.job.operation'),
      width: 200,
    },
  ];
}
