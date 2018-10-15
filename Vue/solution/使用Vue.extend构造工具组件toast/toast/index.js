import Vue from 'vue'
import toast from './index.vue'

const ToastConstructor = Vue.extend(toast)
// 避免重复创建
let toastPool = []

// 获取 toast实例
const getAnInstance = () => {
  // 已经有存在的实例了，则隐藏然后重现用于当前最新的提示
  if (toastPool.length) {
    const instance = toastPool[0]
    toastPool.splice(0, 1)
    instance.visible = false
    return instance
  }
  const instance = new ToastConstructor({
    el: document.createElement('div')
  })
  toastPool.push(instance)
  return instance
}

const Toast = (options = {}) => {
  const instance = getAnInstance()
  clearTimeout(instance.timer)
  instance.message = typeof options !== 'string' ? options.message : options
  instance.position = options.position || 'bottom'
  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.visible = true
    instance.timer = setTimeout(() => {
      instance.visible = false
    }, options.duration || 2000)
  })
}
export default Toast
