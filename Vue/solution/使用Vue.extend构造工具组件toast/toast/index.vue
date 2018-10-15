<template>
  <transition name="toast-pop">
    <div class="toast" v-if="visible" :class="customClass">
      <span class="toast-text">{{message}}</span>
    </div>
  </transition>
</template>
<script>
  export default {
    props: {
      message: {
        type: String,
        default: ''
      },
      position: {
        type: String,
        default: 'bottom'
      }
    },
    data () {
      return {
        visible: false
      }
    },
    computed: {
      customClass () {
        switch (this.position) {
          case 'top':
            return ['is-top']
          case 'bottom':
            return ['is-bottom']
          case 'middle':
            return ['is-middle']
        }
      }
    }
  }
</script>
<style lang="scss">
  .toast-pop-enter-active, .toast-pop-leave-active {
    transition: opacity .3s linear;
  }
  .toast-pop-enter, .toast-pop-leave-to {
    opacity: 0;
  }
  .toast {
    position: fixed;
    max-width: 80%;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    z-index: 1000;
    padding: 10px;
    &-text {
      font-size: 14px;
      display: block;
      text-align: center;
    }
  }
  .is-top {
    top: 50px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .is-middle {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .is-bottom {
    bottom: 50px;
    left: 50%;
    transform: translate(-50%, 0);
  }
</style>
