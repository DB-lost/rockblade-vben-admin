import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { UserPageResponse } from '#/api';

import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      label: '主键ID',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '昵称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'password',
      label: '密码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'avatar',
      label: '头像',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'userType',
      label: '用户类型',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'status',
      label: '用户状态（0:禁用；1：启用）',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'deleted',
      label: '是否删除',
      rules: 'required',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      label: '主键ID',
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '昵称',
    },
    {
      component: 'Input',
      fieldName: 'password',
      label: '密码',
    },
    {
      component: 'Input',
      fieldName: 'avatar',
      label: '头像',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
    },
    {
      component: 'Input',
      fieldName: 'userType',
      label: '用户类型',
    },
    {
      component: 'Input',
      fieldName: 'status',
      label: '用户状态（0:禁用；1：启用）',
    },
    {
      component: 'Input',
      fieldName: 'deleted',
      label: '是否删除',
    },
  ];
}

export function useColumns<T = UserPageResponse>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridColumns {
  return [
    {
      field: 'id',
      title: '主键ID',
      width: 200,
    },
    {
      field: 'username',
      title: '用户名',
      width: 200,
    },
    {
      field: 'nickname',
      title: '昵称',
      width: 200,
    },
    {
      field: 'password',
      title: '密码',
      width: 200,
    },
    {
      field: 'avatar',
      title: '头像',
      width: 200,
    },
    {
      field: 'phone',
      title: '手机号',
      width: 200,
    },
    {
      field: 'email',
      title: '邮箱',
      width: 200,
    },
    {
      field: 'userType',
      title: '用户类型',
      width: 200,
    },
    {
      field: 'status',
      title: '用户状态（0:禁用；1：启用）',
      width: 200,
    },
    {
      field: 'deleted',
      title: '是否删除',
      width: 200,
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
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      //width: 130,
    },
  ];
}
