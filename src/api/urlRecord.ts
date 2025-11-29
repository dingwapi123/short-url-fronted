import { getJson, postJson, putJson, deleteJson } from './http'

export interface UrlRecord {
  id: number
  originalUrl: string
  shortUrl: string
  urlCode: string
  title?: string
  description?: string
  category?: string
  visitCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  message: string
  data?: T
}

/**
 * 创建短链记录
 * @param originalUrl 原始长链接
 * @param urlCode 可选的自定义短码
 * @param title 可选标题
 * @param description 可选描述
 * @param category 可选分类
 */
export async function createUrlRecord(
  originalUrl: string,
  urlCode?: string,
  title?: string,
  description?: string,
  category?: string,
): Promise<ApiResponse<UrlRecord>> {
  return postJson<ApiResponse<UrlRecord>>('/urlRecord', {
    originalUrl,
    urlCode,
    title,
    description,
    category,
  })
}

/**
 * 根据短码获取原始链接
 * @param urlCode 短码
 */
export async function getOriginUrl(urlCode: string): Promise<ApiResponse<string>> {
  return getJson<ApiResponse<string>>(`/${encodeURIComponent(urlCode)}`)
}

/**
 * 获取所有短链记录
 */
export async function getAllUrlRecord(): Promise<ApiResponse<UrlRecord[]>> {
  return getJson<ApiResponse<UrlRecord[]>>('/urlRecord')
}

/**
 * 更新短链记录
 * @param id 记录ID
 * @param data 更新的数据
 */
export async function updateUrlRecord(
  id: number,
  data: Partial<UrlRecord>,
): Promise<ApiResponse<UrlRecord>> {
  return putJson<ApiResponse<UrlRecord>>(`/urlRecord/${id}`, data)
}

/**
 * 删除短链记录
 * @param id 记录ID
 */
export async function deleteUrlRecord(id: number): Promise<ApiResponse<void>> {
  return deleteJson<ApiResponse<void>>(`/urlRecord/${id}`)
}
