<template>
	<mu-button flat color="primary" :disabled="disabled">{{ codeText }}</mu-button>
</template>
<script>
import Bus from "@/assets/javascripts/bus";
// 建立一个事件bus，用于父组件触发子组件的自定义事件
// ********bus.js*********
// import Vue from "vue";
// const Bus = new Vue();
// export default Bus;
import { mapActions } from "vuex";

export default {
  data() {
    return {
      codeText: "获取验证码",
      disabled: false,
      timer: -1
    };
  },
  mounted() {
    let _this = this;
    // 注册服务
    Bus.$on("verifyCode", params => {
      /**
       * @param {Object} params phone、type(登录0/注册1/找回密码2...)
       */
      this.fetchVerifyCode(params).then(() => {
        _this.$toast.success("短信已发送，请注意查收");
      });
      this.timeCountDown();
    });
    Bus.$on("cancelTimer", () => {
      clearInterval(this.timer);
      this.disabled = false;
      let t = setTimeout(() => {
        clearTimeout(t);
        _this.codeText = "获取验证码";
      }, 0);
    });
  },
  methods: {
    ...mapActions("common", ["fetchVerifyCode"]),
    // 倒计时
    timeCountDown() {
      let sec = 60;
      this.disabled = true;
      this.timer = setInterval(() => {
        if (sec <= 0) {
          Bus.$emit("cancelTimer");
        }
        this.codeText = sec;
        sec -= 1;
      }, 1000);
    }
  }
};
</script>
