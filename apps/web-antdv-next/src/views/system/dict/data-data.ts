import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { DictDataPageResponse } from '#/api';

import { $t } from '#/locales';

/**
 * 字典数据表单配置（新增/编辑）
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'label',
      label: $t('system.dict.data.label'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'value',
      label: $t('system.dict.data.value'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
      fieldName: 'order',
      label: $t('system.dict.data.order'),
    },
    {
      component: 'Select',
      fieldName: 'cssClass',
      label: $t('system.dict.data.cssClass'),
      componentProps: {
        allowClear: true,
        placeholder: $t('ui.placeholder.select'),
        options: [
          { label: 'primary', value: 'primary' },
          { label: 'success', value: 'success' },
          { label: 'warning', value: 'warning' },
          { label: 'danger', value: 'danger' },
          { label: 'info', value: 'info' },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'listClass',
      label: $t('system.dict.data.listClass'),
      componentProps: {
        allowClear: true,
        placeholder: $t('ui.placeholder.select'),
        options: [
          { label: 'default', value: 'default' },
          { label: 'primary', value: 'primary' },
          { label: 'success', value: 'success' },
          { label: 'warning', value: 'warning' },
          { label: 'danger', value: 'danger' },
          { label: 'info', value: 'info' },
        ],
      },
    },
    {
      component: 'Switch',
      defaultValue: false,
      fieldName: 'isDefault',
      label: $t('system.dict.data.isDefault'),
    },
    {
      component: 'RadioGroup',
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.dict.data.status'),
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
      },
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.dict.data.remark'),
    },
  ];
}

/**
 * 字典数据搜索表单配置
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'label',
      label: $t('system.dict.data.label'),
    },
    {
      component: 'Input',
      fieldName: 'value',
      label: $t('system.dict.data.value'),
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: $t('system.dict.data.status'),
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
      },
    },
  ];
}

/**
 * 字典数据表格列配置
 * @param onActionClick 操作按钮点击回调
 */
export function useColumns<T = DictDataPageResponse>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridColumns {
  return [
    {
      field: 'label',
      title: $t('system.dict.data.label'),
      width: 150,
    },
    {
      field: 'value',
      title: $t('system.dict.data.value'),
      width: 120,
    },
    {
      field: 'order',
      title: $t('system.dict.data.order'),
      width: 80,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'cssClass',
      title: $t('system.dict.data.cssClass'),
      width: 100,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'listClass',
      title: $t('system.dict.data.listClass'),
      width: 120,
    },
    {
      cellRender: {
        attrs: {
          options: [
            { color: 'success', label: $t('common.yes'), value: true },
            { color: 'default', label: $t('common.no'), value: false },
          ],
        },
        name: 'CellTag',
      },
      field: 'isDefault',
      title: $t('system.dict.data.isDefault'),
      width: 80,
    },
    {
      cellRender: { name: 'CellSwitch' },
      field: 'status',
      title: $t('system.dict.data.status'),
      width: 80,
    },
    {
      field: 'remark',
      minWidth: 100,
      title: $t('system.dict.data.remark'),
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'label',
          nameTitle: $t('system.dict.data.label'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.dict.data.operation'),
      width: 150,
    },
  ];
}
