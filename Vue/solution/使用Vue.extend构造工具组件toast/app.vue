<template>
  <div class="app" @click="showToast">app</div>
</template>
<script>
// 导入 toast组件
import toast from './toast'

export default {
  methods: {
    showToast() {
      // 使用
      toast('我是toast')
    }
  }
}
</script>
