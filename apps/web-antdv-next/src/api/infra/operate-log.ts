
import { requestClient } from '#/api/request';

/**
* 分页查询参数
*/
export interface OperateLogPageRequest {
  /**
   * 追踪ID
   */
  traceId?: string,
  /**
   * 用户id
   */
  userId?: string,
  pageNum?: number
  pageSize?: number
}

/**
* 接口响应参数
*/
export interface OperateLogPageResponse {
  /**
   * ID
   */
  id?: string,
  /**
   * 追踪ID
   */
  traceId?: string,
  /**
   * 用户id
   */
  userId?: string,
  /**
   * 昵称
   */
  nickname?: string,
  /**
   * 日志类型
   */
  type?: string,
  /**
   * 日志子类型
   */
  subType?: string,
  /**
   * 行为
   */
  action?: string,
}

/**
* 响应实体
*/
export interface OperateLogResponse {
  /**
   * ID
   */
  id?: string,
  /**
   * 追踪ID
   */
  traceId?: string,
  /**
   * 用户id
   */
  userId?: string,
  /**
   * 昵称
   */
  nickname?: string,
  /**
   * 用户类型
   */
  userType?: string,
  /**
   * 日志类型
   */
  type?: string,
  /**
   * 日志子类型
   */
  subType?: string,
  /**
   * 业务id
   */
  bizId?: string,
  /**
   * 行为
   */
  action?: string,
  /**
   * 拓展信息
   */
  extra?: string,
  /**
   * 请求方法
   */
  requestMethod?: string,
  /**
   * 请求路径
   */
  requestUrl?: string,
  /**
   * 用户地址
   */
  userIp?: string,
}

enum Api {
  Base = '/operateLog',
  Page = '/operateLog/page',
  QueryAll = '/operateLog/queryAll',
  QueryById = '/operateLog/queryById',
}

/**
* 分页查询操作日志列表
*/
async function pageOperateLog(request: OperateLogPageRequest) {
  return requestClient.get<OperateLogPageResponse>(Api.Page, { params: request })
}

/**
* 根据ID获取操作日志详情
*/
async function queryOperateLogById(id: string) {
  return requestClient.get<OperateLogResponse>(`${Api.QueryById}/${id}`)
}

export {
  pageOperateLog,
  queryOperateLogById,
};
