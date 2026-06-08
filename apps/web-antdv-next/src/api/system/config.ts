import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
* 分页查询参数
*/
export interface ConfigPageRequest {
  /**
   * 参数主键
   */
  id?: string,
  /**
   * 参数名称
   */
  name?: string,
  /**
   * 参数键名
   */
  configKey?: string,
  /**
   * 参数值
   */
  configValue?: string,
  /**
   * 参数类型（string/boolean/integer/json）
   */
  configType?: string,
  /**
   * 状态（0停用 1启用）
   */
  status?: number,
  /**
   * 备注
   */
  remark?: string,
  /**
   * 是否删除
   */
  deleted?: boolean,
  pageNum?: number
  pageSize?: number
}

/**
* 接口响应参数
*/
export interface ConfigPageResponse {
  /**
   * 参数主键
   */
  id?: string,
  /**
   * 参数名称
   */
  name?: string,
  /**
   * 参数键名
   */
  configKey?: string,
  /**
   * 参数值
   */
  configValue?: string,
  /**
   * 参数类型（string/boolean/integer/json）
   */
  configType?: string,
  /**
   * 状态（0停用 1启用）
   */
  status?: number,
  /**
   * 备注
   */
  remark?: string,
  /**
   * 是否删除
   */
  deleted?: boolean,
}

/**
* 表单请求参数
*/
export interface ConfigRequest {
  /**
   * 参数主键
   */
  id?: string,
  /**
   * 参数名称
   */
  name?: string,
  /**
   * 参数键名
   */
  configKey?: string,
  /**
   * 参数值
   */
  configValue?: string,
  /**
   * 参数类型（string/boolean/integer/json）
   */
  configType?: string,
  /**
   * 状态（0停用 1启用）
   */
  status?: number,
  /**
   * 备注
   */
  remark?: string,
  /**
   * 是否删除
   */
  deleted?: boolean,
}

/**
* 响应实体
*/
export interface ConfigResponse {
  /**
   * 参数主键
   */
  id?: string,
  /**
   * 参数名称
   */
  name?: string,
  /**
   * 参数键名
   */
  configKey?: string,
  /**
   * 参数值
   */
  configValue?: string,
  /**
   * 参数类型（string/boolean/integer/json）
   */
  configType?: string,
  /**
   * 状态（0停用 1启用）
   */
  status?: number,
  /**
   * 备注
   */
  remark?: string,
  /**
   * 是否删除
   */
  deleted?: boolean,
}

/**
* 列表项
*/
export interface ConfigListResponse {
  /**
   * 参数主键
   */
  id?: string,
  /**
   * 参数名称
   */
  name?: string,
  /**
   * 参数键名
   */
  configKey?: string,
  /**
   * 参数值
   */
  configValue?: string,
  /**
   * 参数类型（string/boolean/integer/json）
   */
  configType?: string,
  /**
   * 状态（0停用 1启用）
   */
  status?: number,
  /**
   * 备注
   */
  remark?: string,
  /**
   * 是否删除
   */
  deleted?: boolean,
}

enum Api {
  Base = '/config',
  Page = '/config/page',
  QueryAll = '/config/queryAll',
  QueryById = '/config/queryById',
}

/**
* 分页查询系统参数配置表列表
*/
async function pageConfig(request: ConfigPageRequest) {
  return requestClient.get<ConfigPageResponse>(Api.Page, { params: request })
}

/**
* 根据ID获取系统参数配置表详情
*/
async function queryConfigById(id: string) {
  return requestClient.get<ConfigResponse>(`${Api.QueryById}/${id}`)
}

/**
* 查询所有系统参数配置表列表
*/
async function queryAllConfig() {
  return requestClient.get<ConfigListResponse[]>(Api.QueryAll)
}

/**
* 保存系统参数配置表
*/
async function saveConfig(request: Recordable<ConfigRequest>) {
  return requestClient.post<string>(Api.Base, request)
}

/**
* 更新系统参数配置表
*/
async function updateConfig(request: Recordable<ConfigRequest>) {
  return requestClient.put<string>(Api.Base, request)
}

/**
* 删除系统参数配置表
*/
async function deleteConfig(id: string | undefined) {
  return requestClient.delete(`${Api.Base}/${id}`)
}

export {
  deleteConfig,
  pageConfig,
  queryAllConfig,
  queryConfigById,
  saveConfig,
  updateConfig,
};
