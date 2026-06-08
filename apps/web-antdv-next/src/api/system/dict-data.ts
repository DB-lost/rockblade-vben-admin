import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 分页查询参数
 */
export interface DictDataPageRequest {
  /**
   * 字典数据主键
   */
  id?: string;
  /**
   * 字典类型ID
   */
  dictTypeId?: string;
  /**
   * 字典标签
   */
  label?: string;
  /**
   * 字典值
   */
  value?: string;
  /**
   * 排序
   */
  order?: number;
  /**
   * 状态（0停用 1启用）
   */
  status?: number;
  /**
   * 样式（如 primary/danger）
   */
  cssClass?: string;
  /**
   * 表格回显样式（如 default/warning）
   */
  listClass?: string;
  /**
   * 是否默认
   */
  isDefault?: boolean;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 是否删除
   */
  deleted?: boolean;
  pageNum?: number;
  pageSize?: number;
}

/**
 * 接口响应参数
 */
export interface DictDataPageResponse {
  /**
   * 字典数据主键
   */
  id?: string;
  /**
   * 字典类型ID
   */
  dictTypeId?: string;
  /**
   * 字典标签
   */
  label?: string;
  /**
   * 字典值
   */
  value?: string;
  /**
   * 排序
   */
  order?: number;
  /**
   * 状态（0停用 1启用）
   */
  status?: number;
  /**
   * 样式（如 primary/danger）
   */
  cssClass?: string;
  /**
   * 表格回显样式（如 default/warning）
   */
  listClass?: string;
  /**
   * 是否默认
   */
  isDefault?: boolean;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 是否删除
   */
  deleted?: boolean;
}

/**
 * 表单请求参数
 */
export interface DictDataRequest {
  /**
   * 字典数据主键
   */
  id?: string;
  /**
   * 字典类型ID
   */
  dictTypeId?: string;
  /**
   * 字典标签
   */
  label?: string;
  /**
   * 字典值
   */
  value?: string;
  /**
   * 排序
   */
  order?: number;
  /**
   * 状态（0停用 1启用）
   */
  status?: number;
  /**
   * 样式（如 primary/danger）
   */
  cssClass?: string;
  /**
   * 表格回显样式（如 default/warning）
   */
  listClass?: string;
  /**
   * 是否默认
   */
  isDefault?: boolean;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 是否删除
   */
  deleted?: boolean;
}

/**
 * 响应实体
 */
export interface DictDataResponse {
  /**
   * 字典数据主键
   */
  id?: string;
  /**
   * 字典类型ID
   */
  dictTypeId?: string;
  /**
   * 字典标签
   */
  label?: string;
  /**
   * 字典值
   */
  value?: string;
  /**
   * 排序
   */
  order?: number;
  /**
   * 状态（0停用 1启用）
   */
  status?: number;
  /**
   * 样式（如 primary/danger）
   */
  cssClass?: string;
  /**
   * 表格回显样式（如 default/warning）
   */
  listClass?: string;
  /**
   * 是否默认
   */
  isDefault?: boolean;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 是否删除
   */
  deleted?: boolean;
}

/**
 * 列表项
 */
export interface DictDataListResponse {
  /**
   * 字典数据主键
   */
  id?: string;
  /**
   * 字典类型ID
   */
  dictTypeId?: string;
  /**
   * 字典标签
   */
  label?: string;
  /**
   * 字典值
   */
  value?: string;
  /**
   * 排序
   */
  order?: number;
  /**
   * 状态（0停用 1启用）
   */
  status?: number;
  /**
   * 样式（如 primary/danger）
   */
  cssClass?: string;
  /**
   * 表格回显样式（如 default/warning）
   */
  listClass?: string;
  /**
   * 是否默认
   */
  isDefault?: boolean;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 是否删除
   */
  deleted?: boolean;
}

enum Api {
  Base = '/dictData',
  Page = '/dictData/page',
  QueryAll = '/dictData/queryAll',
  QueryById = '/dictData/queryById',
}

/**
 * 分页查询字典数据表列表
 */
async function pageDictData(request: DictDataPageRequest) {
  return requestClient.get<DictDataPageResponse>(Api.Page, { params: request });
}

/**
 * 根据ID获取字典数据表详情
 */
async function queryDictDataById(id: string) {
  return requestClient.get<DictDataResponse>(`${Api.QueryById}/${id}`);
}

/**
 * 查询所有字典数据表列表
 */
async function queryAllDictData() {
  return requestClient.get<DictDataListResponse[]>(Api.QueryAll);
}

/**
 * 保存字典数据表
 */
async function saveDictData(request: Recordable<DictDataRequest>) {
  return requestClient.post<string>(Api.Base, request);
}

/**
 * 更新字典数据表
 */
async function updateDictData(request: Recordable<DictDataRequest>) {
  return requestClient.put<string>(Api.Base, request);
}

/**
 * 删除字典数据表
 */
async function deleteDictData(id: string | undefined) {
  return requestClient.delete(`${Api.Base}/${id}`);
}

export {
  deleteDictData,
  pageDictData,
  queryAllDictData,
  queryDictDataById,
  saveDictData,
  updateDictData,
};
