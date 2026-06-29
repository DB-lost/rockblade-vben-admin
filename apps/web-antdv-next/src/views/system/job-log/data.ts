import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { JobLogPageResponse } from '#/api';

import { $t } from '#/locales';

/**
 * 详情表单（只读查看）
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'jobId',
      label: $t('system.job-log.jobId'),
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'jobHandlerName',
      label: $t('system.job-log.jobHandlerName'),
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'jobHandlerParam',
      label: $t('system.job-log.jobHandlerParam'),
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'executeIndex',
      label: $t('system.job-log.executeIndex'),
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'beginTime',
      label: $t('system.job-log.beginTime'),
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'endTime',
      label: $t('system.job-log.endTime'),
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'duration',
      label: $t('system.job-log.duration'),
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'success',
      label: $t('system.job-log.success'),
      disabled: true,
    },
    {
      component: 'Textarea',
      fieldName: 'result',
      label: $t('system.job-log.result'),
      disabled: true,
      componentProps: {
        rows: 6,
      },
    },
  ];
}

/**
 * 搜索表单
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'jobId',
      label: $t('system.job-log.jobId'),
    },
    {
      component: 'Input',
      fieldName: 'jobHandlerName',
      label: $t('system.job-log.jobHandlerName'),
    },
    {
      component: 'DatePicker',
      fieldName: 'beginTime',
      label: $t('system.job-log.beginTime'),
      componentProps: {
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'endTime',
      label: $t('system.job-log.endTime'),
      componentProps: {
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      component: 'Select',
      fieldName: 'success',
      label: $t('system.job-log.success'),
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('common.yes'), value: true },
          { label: $t('common.no'), value: false },
        ],
      },
    },
  ];
}

/**
 * 表格列配置
 */
export function useColumns<T = JobLogPageResponse>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridColumns {
  return [
    {
      field: 'jobId',
      title: $t('system.job-log.jobId'),
      width: 100,
    },
    {
      field: 'jobHandlerName',
      title: $t('system.job-log.jobHandlerName'),
      minWidth: 160,
    },
    {
      field: 'executeIndex',
      title: $t('system.job-log.executeIndex'),
      width: 100,
    },
    {
      field: 'beginTime',
      title: $t('system.job-log.beginTime'),
      width: 180,
    },
    {
      field: 'endTime',
      title: $t('system.job-log.endTime'),
      width: 180,
    },
    {
      field: 'duration',
      title: $t('system.job-log.duration'),
      width: 120,
    },
    {
      field: 'success',
      title: $t('system.job-log.success'),
      minWidth: 100,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'jobHandlerName',
          nameTitle: $t('system.job-log.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'view',
            text: $t('ui.actionTitle.view'),
            type: 'link',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.job-log.operation'),
      width: 120,
    },
  ];
}
