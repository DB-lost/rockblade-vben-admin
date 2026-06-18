import { requestClient } from '#/api/request';

/**
 * 分页查询参数
 */
export interface JobLogPageRequest {
  /**
   * 任务ID
   */
  jobId?: number;
  /**
   * 任务处理器名称
   */
  jobHandlerName?: string;
  /**
   * 开始时间
   */
  beginTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 是否成功
   */
  success?: boolean;
  pageNum?: number;
  pageSize?: number;
}

/**
 * 接口响应参数
 */
export interface JobLogPageResponse {
  /**
   * 日志主键
   */
  id?: string;
  /**
   * 任务ID
   */
  jobId?: number;
  /**
   * 任务处理器名称
   */
  jobHandlerName?: string;
  /**
   * 第几次执行
   */
  executeIndex?: number;
  /**
   * 开始时间
   */
  beginTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 执行耗时(ms)
   */
  duration?: number;
  /**
   * 是否成功
   */
  success?: boolean;
}

/**
 * 响应实体
 */
export interface JobLogResponse {
  /**
   * 日志主键
   */
  id?: string;
  /**
   * 任务ID
   */
  jobId?: number;
  /**
   * 任务处理器名称
   */
  jobHandlerName?: string;
  /**
   * 任务参数
   */
  jobHandlerParam?: string;
  /**
   * 第几次执行
   */
  executeIndex?: number;
  /**
   * 开始时间
   */
  beginTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 执行耗时(ms)
   */
  duration?: number;
  /**
   * 是否成功
   */
  success?: boolean;
  /**
   * 执行结果/异常信息
   */
  result?: string;
}

enum Api {
  Base = '/jobLog',
  Page = '/jobLog/page',
  QueryById = '/jobLog/queryById',
}

/**
 * 分页查询任务执行日志列表
 */
async function pageJobLog(request: JobLogPageRequest) {
  return requestClient.get<JobLogPageResponse>(Api.Page, { params: request });
}

/**
 * 根据ID获取任务执行日志详情
 */
async function queryJobLogById(id: string) {
  return requestClient.get<JobLogResponse>(`${Api.QueryById}/${id}`);
}

export { pageJobLog, queryJobLogById };
