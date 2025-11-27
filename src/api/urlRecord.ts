import { getJson, postJson } from './http'

export interface UrlRecord {
  id: number
  originalUrl: string
  shortUrl: string
  urlCode: string
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
 * @returns 后端返回的消息与数据
 */
export async function createUrlRecord(
  originalUrl: string,
  urlCode?: string
): Promise<ApiResponse<UrlRecord>> {
  return postJson<ApiResponse<UrlRecord>>('/urlRecord', {
    originalUrl,
    urlCode,
  })
}

/**
 * 根据短码获取原始链接
 * @param urlCode 短码
 * @returns 原始链接字符串
 */
export async function getOriginUrl(urlCode: string): Promise<ApiResponse<string>> {
  return getJson<ApiResponse<string>>(`/${encodeURIComponent(urlCode)}`)
}
