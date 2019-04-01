const app = getApp()

Page({
  data: {
    logoImg: "https://qiniuyun.quenton.cn/yunzhichongApplet/logs/logo_big.png",
    telImg: "https://qiniuyun.quenton.cn/yunzhichongApplet/logs/phone.png",
    checkImg: "https://qiniuyun.quenton.cn/yunzhichongApplet/logs/code.png",
    psdImg: "https://qiniuyun.quenton.cn/yunzhichongApplet/logs/password.png",
    phoneVul: "",
    psdVul: "",
    codeVul:""
  },
  setPhone: function (e) {
    this.setData({
      phoneVul: e.detail.value
    });
  },
  setPsd: function (e) {
    this.setData({
      psdVul: e.detail.value
    });
  },
  setCode: function (e) {
    this.setData({
      codeVul: e.detail.value
    });
  },
  // 重置密码
  loginCode: function (params) {
    var uuid = app.globalData.userInfo.uuid;
    var tel = wx.getStorageSync("userinfo").mobile;
    console.log(tel)
    var mobile = this.data.phoneVul;
    var password = this.data.psdVul;
    var code = this.data.codeVul;
    var flag = this.data.checkHid;
    if (!app.api.vaildeParam(mobile)) {
      app.api.layer("当前密码不能为空");
      return
    }
    if (!app.api.vaildeParam(password)) {
      app.api.layer("新密码不能为空");
      return
    }
    if (password.length < 6) {
      app.api.layer("新密码长度不少于6位");
      return
    }
    if (code.length < 6) {
      app.api.layer("确认密码长度不少于6位");
      return
    }
    if (!app.api.vaildeParam(code)) {
      app.api.layer("确认密码不能为空");
      return
    }
    if (code != password) {
      app.api.layer("两次密码输入不一致");
      return
    }
    var postData = {
      "oldePassword": mobile,
      "newPassword": password,
      "uuid": uuid
    }
    app.api.postJSON("/api/member/modifyPassword", postData, function (res) {
      if ("0" == res.code) {
        app.api.layer("修改成功，正在跳转...")
        app.api.setLoginData(res);
        wx.reLaunch({
          url: '../logs/logs?tel='+tel
        })
      }else{
        app.api.layer(res.msg)
      }
    })
  }
})