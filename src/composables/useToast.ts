import { ref } from 'vue'

// 定义 Toast 类型
export type ToastType = 'info' | 'success' | 'error'

interface ToastState {
  show: boolean
  message: string
  type: ToastType
}

// 全局响应式状态
const toastState = ref<ToastState>({
  show: false,
  message: '',
  type: 'info',
})

let toastTimer: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  /**
   * 显示 Toast
   * @param message 提示消息
   * @param type 类型 (info, success, error)，默认为 info
   * @param duration 持续时间 (毫秒)，默认为 3000
   */
  function showToast(message: string, type: ToastType = 'info', duration = 3000) {
    toastState.value = {
      show: true,
      message,
      type,
    }

    if (toastTimer) {
      clearTimeout(toastTimer)
    }

    toastTimer = setTimeout(() => {
      toastState.value.show = false
    }, duration)
  }

  /**
   * 手动隐藏 Toast
   */
  function hideToast() {
    toastState.value.show = false
    if (toastTimer) {
      clearTimeout(toastTimer)
      toastTimer = null
    }
  }

  return {
    toastState,
    showToast,
    hideToast,
  }
}
