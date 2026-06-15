import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { FileDedupPageResponse } from '#/api';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'fileName',
      label: $t('infra.fileDedup.fileName'),
    },
    {
      component: 'Input',
      fieldName: 'mimeType',
      label: $t('infra.fileDedup.mimeType'),
    },
  ];
}

export function useColumns<T = FileDedupPageResponse>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridColumns {
  return [
    {
      field: 'fileName',
      title: $t('infra.fileDedup.fileName'),
      width: 250,
    },
    {
      field: 'ossPath',
      title: $t('infra.fileDedup.ossPath'),
    },
    {
      field: 'fileSize',
      title: $t('infra.fileDedup.fileSize'),
      width: 150,
    },
    {
      field: 'mimeType',
      title: $t('infra.fileDedup.fileMimeType'),
      width: 150,
    },
    {
      field: 'refCount',
      title: $t('infra.fileDedup.refCount'),
      width: 150,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'getFile',
            text: $t('infra.fileDedup.getFile'),
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
      title: $t('infra.fileDedup.operation'),
      width: 150,
    },
  ];
}
