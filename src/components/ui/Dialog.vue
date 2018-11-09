/**
 * @author: Evan Deng
 * @desc: 一个简单的Dialog组件
 * @Date: 2018-10-29 19:46:36
 */
<template>
  <div :class="['g-dialog-box', extraClass]">
    <div class="dialog-main">
      <div
        v-if="showHeader"
        class="header"
      >
        <div class="title">{{ title }}</div>
        <div
          v-if="showClose"
          class="btn-close"
          @click="closeDialog"
        />
      </div>
      <div class="content"><slot /></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    parentEl: {
      type: String,
      default: 'body'
    },
    extraClass: {
      type: String,
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Pemberitahuan'
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="less">
@images: '../../assets/images';
.g-dialog-box {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  .dialog-main {
    width: 312px;
    background: #fff;
    border-radius: 6px;
    color: #666;
  }
  .header {
    height: 48px;
    line-height: 48px;
    padding: 0 48px 0 12px;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px #e9e5e5 solid;
    position: relative;
  }
  .btn-close {
    position: absolute;
    width: 18px;
    height: 18px;
    top: 15px;
    right: 15px;
    background: url('@{images}/close.png');
    background-size: contain;
  }
  .content {
    padding: 16px;
    font-size: 16px;
    line-height: 20px;
  }
}
</style>
