<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm'

const { confirmState, handleConfirm, handleCancel } = useConfirm()
</script>

<template>
  <!-- 使用 DaisyUI 的 Modal 组件结构 -->
  <dialog class="modal" :class="{ 'modal-open': confirmState.show }">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ confirmState.title }}</h3>
      <p class="py-4">{{ confirmState.message }}</p>
      <div class="modal-action">
        <button class="btn" @click="handleCancel">取消</button>
        <button class="btn btn-error" @click="handleConfirm">确定删除</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="handleCancel">close</button>
    </form>
  </dialog>
</template>
