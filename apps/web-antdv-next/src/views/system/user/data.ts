import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { UserPageResponse } from '#/api';

import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'password',
      label: $t('system.user.password'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'avatar',
      label: $t('system.user.avatar'),
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('system.user.phone'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('system.user.enable'), value: 1 },
          { label: $t('system.user.disable'), value: 0 },
        ],
      },
      fieldName: 'status',
      label: $t('system.user.status'),
      rules: 'required',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('system.user.enable'), value: 1 },
          { label: $t('system.user.disable'), value: 0 },
        ],
      },
      fieldName: 'status',
      label: $t('system.user.status'),
    },
  ];
}

export function useColumns<T = UserPageResponse>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridColumns {
  return [
    {
      field: 'username',
      title: $t('system.user.username'),
      width: 200,
    },
    {
      field: 'nickname',
      title: $t('system.user.nickname'),
      width: 150,
    },
    {
      field: 'avatar',
      title: $t('system.user.avatar'),
      width: 200,
    },
    {
      field: 'phone',
      title: $t('system.user.phone'),
      width: 150,
    },
    {
      field: 'email',
      title: $t('system.user.email'),
      width: 200,
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('system.user.status'),
      width: 150,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.user.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'resetPassword',
            text: $t('common.resetPassword'),
            type: 'link',
          },
          {
            code: 'delete',
            danger: true,
            text: $t('common.delete'),
            type: 'link',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      //width: 130,
    },
  ];
}
