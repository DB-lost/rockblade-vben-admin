import * as CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const PHONE_REGEX = /(\d{3})\d{4}(\d{4})/;
const ID_CARD_REGEX = /(\d{6})\d{8}(\d{4})/;
const BANK_CARD_REGEX = /(\d{4})\d+(\d{4})/;

/**
 * 数据加密工具类
 */
export class CryptoUtil {
  private static instance: CryptoUtil;
  private encryptor: JSEncrypt | null = null;
  private nonce: string = ''; // 存储随机字符串
  private publicKey: string = '';

  private constructor() {
    this.encryptor = new JSEncrypt();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): CryptoUtil {
    if (!CryptoUtil.instance) {
      CryptoUtil.instance = new CryptoUtil();
    }
    return CryptoUtil.instance;
  }

  /**
   * AES解密数据
   * @param encryptedData 加密的数据，格式为 iv:encrypted
   * @param key 密钥
   * @returns 解密后的数据
   */
  public decryptWithAES(encryptedData: string, key: string): string {
    const [ivHex, cipherText] = encryptedData.split(':');
    if (!ivHex || !cipherText) return '';

    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
      mode: CryptoJS.mode.CBC,
      iv,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * AES加密数据
   * @param data 要加密的数据
   * @param key 密钥
   * @returns 加密后的数据，格式为 iv:encrypted
   */
  public encryptWithAES(data: string, key: string): string {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      mode: CryptoJS.mode.CBC,
      iv,
      padding: CryptoJS.pad.Pkcs7,
    });
    return `${iv.toString(CryptoJS.enc.Hex)}:${encrypted.toString()}`;
  }

  /**
   * RSA加密
   * @param data 要加密的数据
   * @returns 加密后的数据，如果加密失败则返回null
   */
  /**
   * RSA加密数据
   */
  public encryptWithRSA(data: string): null | string {
    if (!this.encryptor || !this.publicKey || !this.nonce) {
      return null;
    }
    const result = this.encryptor.encrypt(data);
    return result === false ? null : result;
  }

  /**
   * 生成密钥
   * @param length 密钥长度
   * @returns 生成的密钥
   */
  public generateKey(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      '',
    );
  }

  /**
   * 获取随机字符串
   */
  public getNonce(): string {
    return this.nonce;
  }

  /**
   * 获取当前公钥
   */
  public getPublicKey(): string {
    return this.publicKey;
  }

  /**
   * 检查是否已设置公钥
   */
  public hasPublicKey(): boolean {
    return !!this.publicKey;
  }

  /**
   * 设置公钥和随机字符串
   * @param publicKey RSA公钥
   * @param nonce 随机字符串
   */
  public setPublicKey(publicKey: string, nonce: string): void {
    this.publicKey = publicKey;
    this.nonce = nonce;
    if (this.encryptor) {
      this.encryptor.setPublicKey(publicKey);
    }
  }
}

// 导出单例实例
export const cryptoUtil = CryptoUtil.getInstance();

/**
 * 密码加密
 * @param password 原始密码
 * @returns 加密后的密码
 */
export function encryptPassword(password: string): null | string {
  return cryptoUtil.encryptWithRSA(password);
}

/**
 * 数据脱敏
 */
export const dataMasking = {
  /**
   * 手机号脱敏
   * @param phone 手机号
   * @returns 脱敏后的手机号
   */
  phone(phone: string): string {
    return phone.replace(PHONE_REGEX, '$1****$2');
  },

  /**
   * 邮箱脱敏
   * @param email 邮箱
   * @returns 脱敏后的邮箱
   */
  email(email: string): string {
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
    return `${maskedUsername}@${domain}`;
  },

  /**
   * 身份证号脱敏
   * @param idCard 身份证号
   * @returns 脱敏后的身份证号
   */
  idCard(idCard: string): string {
    return idCard.replace(ID_CARD_REGEX, '$1********$2');
  },

  /**
   * 银行卡号脱敏
   * @param cardNo 银行卡号
   * @returns 脱敏后的银行卡号
   */
  bankCard(cardNo: string): string {
    return cardNo.replace(BANK_CARD_REGEX, '$1 **** **** $2');
  },

  /**
   * 姓名脱敏
   * @param name 姓名
   * @returns 脱敏后的姓名
   */
  name(name: string): string {
    if (name.length <= 2) {
      return `${name.charAt(0)}*`;
    }
    return `${name.charAt(0)}${'*'.repeat(name.length - 2)}${name.charAt(name.length - 1)}`;
  },
};
