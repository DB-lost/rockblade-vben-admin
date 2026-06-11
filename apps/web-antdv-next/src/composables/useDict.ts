import { ref } from 'vue';

import { queryByTypeApi } from '#/api';

/**
 * 字典选项
 */
export interface DictOption {
  label: string;
  value: string;
}

/**
 * 模块级缓存，所有 useDict() 调用共享同一份缓存
 */
const cacheMap = new Map<string, DictOption[]>();
const pendingMap = new Map<string, Promise<DictOption[]>>();

/**
 * 按需加载字典数据的 composable
 *
 * @example
 * ```ts
 * const { getDictOptions, getDictLabel, loading } = useDict();
 * const genderOptions = await getDictOptions('sys_user_sex');
 * const label = await getDictLabel('sys_user_sex', '0');
 * ```
 */
export function useDict() {
  const loading = ref(false);

  /**
   * 根据字典类型编码获取选项列表（带缓存和并发去重）
   * @param dictType - 字典类型编码，如 'sys_user_sex'
   */
  async function getDictOptions(dictType: string): Promise<DictOption[]> {
    // 命中缓存直接返回
    if (cacheMap.has(dictType)) {
      return cacheMap.get(dictType) as DictOption[];
    }

    if (pendingMap.has(dictType)) {
      return pendingMap.get(dictType) as Promise<DictOption[]>;
    }

    loading.value = true;
    const promise = queryByTypeApi({ dictType })
      .then((res) => {
        const options: DictOption[] = (res ?? []).map((item) => ({
          label: item.label ?? '',
          value: item.value ?? '',
        }));
        cacheMap.set(dictType, options);
        return options;
      })
      .finally(() => {
        pendingMap.delete(dictType);
        loading.value = false;
      });

    pendingMap.set(dictType, promise);
    return promise;
  }

  /**
   * 根据字典类型编码和值获取标签文本
   * @param dictType - 字典类型编码
   * @param value - 字典值
   * @returns 标签文本，未找到时返回原值
   */
  async function getDictLabel(
    dictType: string,
    value: string,
  ): Promise<string> {
    const options = await getDictOptions(dictType);
    const item = options.find((o) => o.value === value);
    return item?.label ?? value;
  }

  /**
   * 清除缓存
   * @param dictType - 不传则清除所有缓存
   */
  function clearCache(dictType?: string): void {
    if (dictType) {
      cacheMap.delete(dictType);
    } else {
      cacheMap.clear();
    }
  }

  return {
    getDictOptions,
    getDictLabel,
    clearCache,
    loading,
  };
}
