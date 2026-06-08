import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 分页查询参数
 */
export interface DictTypePageRequest {
  /**
   * 字典主键
   */
  id?: string;
  /**
   * 字典名称
   */
  name?: string;
  /**
   * 字典编码
   */
  code?: string;
  /**
   * 状态（0停用 1启用）
   */
  status?: number;
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
export interface DictTypePageResponse {
  /**
   * 字典主键
   */
  id?: string;
  /**
   * 字典名称
   */
  name?: string;
  /**
   * 字典编码
   */
  code?: string;
  /**
   * 状态（0停用 1启用）
   */
  status?: number;
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
export interface DictTypeRequest {
  /**
   * 字典主键
   */
  id?: string;
  /**
   * 字典名称
   */
  name?: string;
  /**
   * 字典编码
   */
  code?: string;
  /**
   * 状态（0停用 1启用）
   */
  status?: number;
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
export interface DictTypeResponse {
  /**
   * 字典主键
   */
  id?: string;
  /**
   * 字典名称
   */
  name?: string;
  /**
   * 字典编码
   */
  code?: string;
  /**
   * 状态（0停用 1启用）
   */
  status?: number;
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
export interface DictTypeListResponse {
  /**
   * 字典主键
   */
  id?: string;
  /**
   * 字典名称
   */
  name?: string;
  /**
   * 字典编码
   */
  code?: string;
  /**
   * 状态（0停用 1启用）
   */
  status?: number;
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
  Base = '/dictType',
  Page = '/dictType/page',
  QueryAll = '/dictType/queryAll',
  QueryById = '/dictType/queryById',
}

/**
 * 分页查询字典类型表列表
 */
async function pageDictType(request: DictTypePageRequest) {
  return requestClient.get<DictTypePageResponse>(Api.Page, { params: request });
}

/**
 * 根据ID获取字典类型表详情
 */
async function queryDictTypeById(id: string) {
  return requestClient.get<DictTypeResponse>(`${Api.QueryById}/${id}`);
}

/**
 * 查询所有字典类型表列表
 */
async function queryAllDictType() {
  return requestClient.get<DictTypeListResponse[]>(Api.QueryAll);
}

/**
 * 保存字典类型表
 */
async function saveDictType(request: Recordable<DictTypeRequest>) {
  return requestClient.post<string>(Api.Base, request);
}

/**
 * 更新字典类型表
 */
async function updateDictType(request: Recordable<DictTypeRequest>) {
  return requestClient.put<string>(Api.Base, request);
}

/**
 * 删除字典类型表
 */
async function deleteDictType(id: string | undefined) {
  return requestClient.delete(`${Api.Base}/${id}`);
}

export {
  deleteDictType,
  pageDictType,
  queryAllDictType,
  queryDictTypeById,
  saveDictType,
  updateDictType,
};
