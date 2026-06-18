import { requestClient } from '#/api/request';

/**
 * JobResponse，定时任务响应
 */
export interface JobResponse {
  /**
   * CRON 表达式
   */
  cronExpression?: string;
  /**
   * 任务处理器名称
   */
  jobHandlerName: string;
  /**
   * 任务参数
   */
  jobHandlerParam?: string;
  /**
   * 下次执行时间
   */
  nextFireTime?: string;
  /**
   * 上次执行时间
   */
  previousFireTime?: string;
  /**
   * 重试次数
   */
  retryCount?: number;
  /**
   * 重试间隔(ms)
   */
  retryInterval?: number;
  /**
   * 任务状态：NORMAL / PAUSED
   */
  status?: string;
}

/**
 * JobRequest，定时任务请求
 */
export interface JobRequest {
  /**
   * CRON 表达式
   */
  cronExpression: string;
  /**
   * 任务处理器名称（Spring Bean 名）
   */
  jobHandlerName: string;
  /**
   * 任务参数（JSON 格式）
   */
  jobHandlerParam?: string;
  /**
   * 重试次数
   */
  retryCount?: number;
  /**
   * 重试间隔(ms)
   */
  retryInterval?: number;
}

enum Api {
  Base = '/jobs',
  List = '/jobs/list',
}

/**
 * 查询任务执行日志列表
 */
async function listJob() {
  return requestClient.get<JobResponse[]>(Api.List);
}

/**
 * 新增定时任务
 */
async function saveJob(request: JobRequest) {
  return requestClient.post(Api.Base, { data: request });
}

/**
 * 手动执行一次
 */
async function triggerJob(handlerName: string | undefined) {
  return requestClient.post(`${Api.Base}/${handlerName}/trigger`);
}

/**
 * 恢复定时任务
 */
async function resumeJob(handlerName: string | undefined) {
  return requestClient.post(`${Api.Base}/${handlerName}/resume`);
}

/**
 * 暂停定时任务
 */
async function pauseJob(handlerName: string | undefined) {
  return requestClient.post(`${Api.Base}/${handlerName}/pause`);
}

/**
 * 删除定时任务
 */
async function deleteJob(handlerName: string | undefined) {
  return requestClient.delete(`${Api.Base}/${handlerName}`);
}

/**
 * 更新定时任务
 */
async function updateJob(request: JobRequest) {
  return requestClient.put(Api.Base, { data: request });
}

export {
  deleteJob,
  listJob,
  pauseJob,
  resumeJob,
  saveJob,
  triggerJob,
  updateJob,
};
