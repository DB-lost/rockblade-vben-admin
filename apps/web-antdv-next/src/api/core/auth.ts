import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    /**
     * 账户(用户名/手机号/邮箱)
     */
    account: string;
    /**
     * 账户凭证
     */
    accountVoucher: string;
    /**
     * 认证策略
     */
    authServiceEnums: AuthServiceEnums;
    /**
     * 身份验证方法(用户名:USERNAME;手机号:PHONE;邮箱:EMAIL)
     */
    queryEnums: QueryEnums;
    /**
     * 随机字符串
     */
    nonce?: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }

  /** 获取公钥接口返回值 */
  export interface GetPublicKeyResponse {
    /** 随机字符串 */
    nonce: string;
    /** 公钥 */
    publicKey: string;
  }
}

/**
 * 认证服务
 */
export enum AuthServiceEnums {
  Base = 'BASE',
}

/**
 * 使用用途(注册:REGISTER/重置:RESET/登陆:LOGIN)
 */
export enum UseMethod {
  Login = 'LOGIN',
  Register = 'REGISTER',
  Reset = 'RESET',
}

/**
 * 校验方式(手机号:PHONE/邮箱:EMAIL)
 */
export enum VerificationMethod {
  Email = 'EMAIL',
  Phone = 'PHONE',
}

/**
 * 身份验证方法(用户名:USERNAME;手机号:PHONE;邮箱:EMAIL)
 */
export enum QueryEnums {
  Email = 'EMAIL',
  Phone = 'PHONE',
  Username = 'USERNAME',
}

/**
 * @description: 获取公钥
 */
export async function getPublicKeyApi() {
  return requestClient.get<AuthApi.GetPublicKeyResponse>('/auth/getPublicKey');
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<string>('/auth/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
