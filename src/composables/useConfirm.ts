import { ref } from 'vue'

interface ConfirmState {
  show: boolean
  title: string
  message: string
  resolve: ((value: boolean) => void) | null
}

const confirmState = ref<ConfirmState>({
  show: false,
  title: '',
  message: '',
  resolve: null,
})

export function useConfirm() {
  const showConfirm = (message: string, title: string = '确认操作') => {
    return new Promise<boolean>((resolve) => {
      confirmState.value = {
        show: true,
        title,
        message,
        resolve,
      }
    })
  }

  const handleConfirm = () => {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(true)
    }
    closeConfirm()
  }

  const handleCancel = () => {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(false)
    }
    closeConfirm()
  }

  const closeConfirm = () => {
    confirmState.value.show = false
    // Reset state after animation roughly finishes
    setTimeout(() => {
      confirmState.value = {
        show: false,
        title: '',
        message: '',
        resolve: null,
      }
    }, 300)
  }

  return {
    confirmState,
    showConfirm,
    handleConfirm,
    handleCancel,
  }
}
