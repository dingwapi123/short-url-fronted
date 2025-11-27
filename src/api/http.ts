const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1'

/**
 * 发送 HTTP 请求并返回 JSON 结果
 * @param path 请求路径（以 `/` 开头，相对于 `API_BASE_URL`）
 * @param init `fetch` 的初始化参数
 * @returns 解析后的 JSON 数据
 */
export async function request<T>(path: string, init: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    ...init,
  })

  const isJson = (res.headers.get('content-type') || '').includes('application/json')
  const data = isJson ? await res.json() : undefined

  if (!res.ok) {
    const msg = (data && (data.message as string)) || res.statusText
    throw new Error(msg)
  }

  return (data as T) as T
}

/**
 * 发送 POST JSON 请求
 * @param path 请求路径
 * @param body 请求体对象，将被序列化为 JSON
 * @returns 解析后的 JSON 数据
 */
export async function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body ?? {}),
  })
}

/**
 * 发送 GET 请求
 * @param path 请求路径
 * @returns 解析后的 JSON 数据
 */
export async function getJson<T>(path: string): Promise<T> {
  return request<T>(path, {
    method: 'GET',
  })
}
