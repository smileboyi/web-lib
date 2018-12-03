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
    // 注销服务
    Bus.$off("verifyCode");
    Bus.$off("cancelTimer");
    // 注册服务
    Bus.$on("verifyCode", params => {
      /**
       * @param {Object} params phone、type(登录0/注册1/找回密码2...)
       */
      this.fetchVerifyCode(params)
        .then(() => {
          _this.$toast.success("短信已发送，请注意查收");
        })
        .catch(err => {
          _this.$toast.error(err.data.message);
          Bus.$emit("cancelTimer");
        });
      this.timeCountDown();
    });
    Bus.$on("cancelTimer", () => {
      clearInterval(this.timer);
      this.disabled = false;
      // 需要配合定时器，不然不会转变回来
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
      let _this = this;
      this.disabled = true;
      this.timer = setInterval(() => {
        if (sec <= 0) {
          Bus.$emit("cancelTimer");
        }
        _this.codeText = sec;
        sec -= 1;
      }, 1000);
    }
  }
};
</script>

<script>
// ********store common.js*********
// store action 部分
import { decryptJsHandle } from "@/assets/javascripts/common";
export default {
  actions: {
    async fetchVerifyCode({ commit, state, dispatch }, params) {
      // 第一步 获取随机的解密js方法
      let res1, res2;
      try {
        res1 = await http({
          method: "get",
          url: "/api/edge/captcha/key/js"
        });
      } catch (error) {
        throw error;
      }
      let decryptJs = res1.data.decryptJs;
      // 解析出来有一个jsDecrypt方法
      decryptJsHandle(decryptJs);
      // 第二步 通过密匙获取混淆验证码
      try {
        res2 = await http({
          method: "get",
          url: "/api/edge/captcha/key",
          params: {
            length: 8,
            type: params.type,
            phone: params.phone,
            decryptJs: decryptJs
          }
        });
      } catch (error) {
        throw error;
      }
      // 获得校验码
      const preCode = jsDecrypt(8, res2.data.accessKey);
      // 第三步 获取验证码
      return http({
        method: "get",
        url: "/api/edge/sms/code",
        params: {
          preCode,
          type: params.type,
          phone: params.phone
        }
      });
    }
  }
}
</script>
