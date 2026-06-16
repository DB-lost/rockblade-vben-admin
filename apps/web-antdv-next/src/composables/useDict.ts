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
 * 独立函数：根据字典类型编码获取选项列表（带缓存和并发去重）
 * 可在 composable 外部直接调用（如 data.ts 配置文件中）
 *
 * @param dictType 字典类型编码
 * @param forceReload 是否强制重新加载，默认 false（使用缓存）
 */
export async function loadDictOptions(
  dictType: string,
  forceReload = false,
): Promise<DictOption[]> {
  if (forceReload) {
    cacheMap.delete(dictType);
    pendingMap.delete(dictType);
  }

  if (cacheMap.has(dictType)) {
    return cacheMap.get(dictType) as DictOption[];
  }

  if (pendingMap.has(dictType)) {
    return pendingMap.get(dictType) as Promise<DictOption[]>;
  }

  const promise = queryByTypeApi(dictType)
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
    });

  pendingMap.set(dictType, promise);
  return promise;
}

/**
 * 清除缓存
 */
export function clearDictCache(dictType?: string): void {
  if (dictType) {
    cacheMap.delete(dictType);
  } else {
    cacheMap.clear();
  }
}

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

  async function getDictOptions(dictType: string): Promise<DictOption[]> {
    loading.value = true;
    try {
      return await loadDictOptions(dictType);
    } finally {
      loading.value = false;
    }
  }

  async function getDictLabel(
    dictType: string,
    value: string,
  ): Promise<string> {
    const options = await getDictOptions(dictType);
    const item = options.find((o) => o.value === value);
    return item?.label ?? value;
  }

  function clearCache(dictType?: string): void {
    clearDictCache(dictType);
  }

  return { getDictOptions, getDictLabel, clearCache, loading };
}
