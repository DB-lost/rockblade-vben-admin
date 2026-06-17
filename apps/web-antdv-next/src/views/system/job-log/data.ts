import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { JobLogPageResponse } from '#/api';

import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'jobId',
      label: '任务ID',
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'jobHandlerName',
      label: '任务处理器名称',
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'jobHandlerParam',
      label: '任务参数',
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'executeIndex',
      label: '第几次执行',
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'beginTime',
      label: '开始时间',
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'endTime',
      label: '结束时间',
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'duration',
      label: '执行耗时(ms)',
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'success',
      label: '是否成功',
      disabled: true,
    },
    {
      component: 'Input',
      fieldName: 'result',
      label: '执行结果/异常信息',
      disabled: true,
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'jobId',
      label: '任务ID',
    },
    {
      component: 'Input',
      fieldName: 'jobHandlerName',
      label: '任务处理器名称',
    },
    {
      component: 'Input',
      fieldName: 'beginTime',
      label: '开始时间',
    },
    {
      component: 'Input',
      fieldName: 'endTime',
      label: '结束时间',
    },
    {
      component: 'Input',
      fieldName: 'success',
      label: '是否成功',
    },
  ];
}

export function useColumns<T = JobLogPageResponse>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridColumns {
  return [
    {
      field: 'jobId',
      title: '任务ID',
      width: 150,
    },
    {
      field: 'jobHandlerName',
      title: '任务处理器名称',
      width: 150,
    },
    {
      field: 'executeIndex',
      title: '第几次执行',
      width: 150,
    },
    {
      field: 'beginTime',
      title: '开始时间',
      width: 150,
    },
    {
      field: 'endTime',
      title: '结束时间',
      width: 150,
    },
    {
      field: 'duration',
      title: '执行耗时(ms)',
      width: 150,
    },
    {
      field: 'success',
      title: '是否成功',
      width: 150,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.jobLog.name'),
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
      title: $t('system.jobLog.operation'),
      width: 150,
    },
  ];
}
