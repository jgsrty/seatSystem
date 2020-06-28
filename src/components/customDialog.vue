<template>
  <transition name="fade">
    <div class="content" v-show="visible" @click.self="clickModel">
      <div class="dialog" :style="{width: width}">
        <div class="header" v-show="headerVisible">
          <slot name="header">
            <div class="title">{{header}}</div>
            <div class="close_icon" v-if="iconVisible" @click="closeDialog">
              <i class="el-icon-close"></i>
            </div>
          </slot>
        </div>
        <div class="body">
          <slot></slot>
        </div>
        <div class="footer-pop">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    // 显示弹窗
    visible: {
      type: Boolean,
      default: true
    },
    // 显示header
    headerVisible: {
      type: Boolean,
      default: true
    },
    // 自定义header内容
    header: {
      type: String,
      default: '新增收货地址'
    },
    // 自定义宽度
    width: {
      type: String,
      default: '600px'
    },
    // 是否加载关闭图标
    iconVisible: {
      type: Boolean,
      default: true
    },
    // 点击空白关闭
    clickEmpty: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false);
    },
    clickModel() {
      if (this.clickEmpty) {
        this.closeDialog();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.content {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  .dialog {
    background: #fff;
    box-sizing: border-box;
    font-size: 14px;
    color: #333;
    border-radius: 4px;
    .header {
      padding: 10px 20px;
      border-bottom: 1px solid #dedede;
      font-weight: bold;
      display: flex;
      .title {
        flex: 1;
      }
      .close_icon {
        cursor: pointer;
        width: 16px;
        i {
          font-size: 16px;
        }
      }
    }
    .body{
      padding: 20px 40px 0 40px;
    }
    .footer-pop {
      padding: 20px 40px;
    }
  }
}
</style>
