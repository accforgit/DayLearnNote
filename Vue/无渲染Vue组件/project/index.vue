<template>
  <div class="test1">
    <toggle>
      <div slot-scope="{ on, setOn, setOff, change }" class="container">
        <button @click="click(setOn)" class="button">Blue pill</button>
        <button @click="click(setOff)" class="button isRed">Red pill</button>
        <button @click="click(change)" class="button isDefault">toggle</button>
        <div v-if="buttonPressed" class="message">
          <span v-if="on">It's all a dream, go back to sleep.</span>
          <span v-else>I don't know how far the rabbit hole goes</span>
        </div>
      </div>
    </toggle>
  </div>
</template>

<script>
import toggle from './toggle';

export default {
  components: {
    toggle,
  },
  data() {
    return {
      buttonPressed: false,
    };
  },
  methods: {
    click(fn) {
      this.buttonPressed = true;
      fn();
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
}

.container {
  position: relative;
}

.button {
  border: none;
  padding: 1rem 2rem;
  border-radius: 2rem;
  cursor: pointer;
  background: blue;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  outline: none;
  box-shadow: 0 4px 2px 1px rgba(slategray, .2);
  &.isRed {
    background: red;
  }
  &.isDefault {
    background: yellow;
  }
}

.message {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 1rem;
  text-align: center;
  font-size: 1.25rem;
}
</style>

