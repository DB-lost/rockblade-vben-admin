import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { OperateLogPageResponse } from '#/api';

import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'traceId',
      label: $t('infra.operateLog.traceId'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'userId',
      label: $t('infra.operateLog.userId'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'userType',
      label: $t('infra.operateLog.userType'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'type',
      label: $t('infra.operateLog.logType'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'subType',
      label: $t('infra.operateLog.logSubType'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'bizId',
      label: $t('infra.operateLog.bizId'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Textarea',
      fieldName: 'action',
      label: $t('infra.operateLog.action'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Textarea',
      fieldName: 'extra',
      label: $t('infra.operateLog.extra'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'requestMethod',
      label: $t('infra.operateLog.requestMethod'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Textarea',
      fieldName: 'requestUrl',
      label: $t('infra.operateLog.requestUrl'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Textarea',
      fieldName: 'userIp',
      label: $t('infra.operateLog.userIp'),
      componentProps: {
        disabled: true,
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'traceId',
      label: $t('infra.operateLog.traceId'),
    },
    {
      component: 'Input',
      fieldName: 'userId',
      label: $t('infra.operateLog.userId'),
    },
  ];
}

export function useColumns<T = OperateLogPageResponse>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridColumns {
  return [
    {
      field: 'traceId',
      title: $t('infra.operateLog.traceId'),
      width: 300,
    },
    {
      field: 'userId',
      title: $t('infra.operateLog.userId'),
      width: 200,
    },
    {
      field: 'nickname',
      title: $t('infra.operateLog.nickname'),
      width: 200,
    },
    {
      field: 'type',
      title: $t('infra.operateLog.logType'),
      width: 200,
    },
    {
      field: 'subType',
      title: $t('infra.operateLog.logSubType'),
      width: 200,
    },
    {
      field: 'action',
      title: $t('infra.operateLog.action'),
      width: 200,
    },
    {
      field: 'createTime',
      title: $t('infra.operateLog.createTime'),
      minWidth: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('infra.operateLog.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            text: $t('ui.actionTitle.view'),
            type: 'link',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('infra.operateLog.operation'),
      width: 150,
    },
  ];
}
