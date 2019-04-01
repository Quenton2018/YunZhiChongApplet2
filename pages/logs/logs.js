const app = getApp()
var interval = null //倒计时函数
Page({
  data: {
    logoImg:"http://image.jx9n.com/CzFatSxrH4WPGH2TjP2d_1552300214701.png",
    telImg:"http://image.jx9n.com/7wMXHtTkAtCtGxYcjkMK_1552300246543.png",
    checkImg:"http://image.jx9n.com/FEAaErtkFMAcHKr54rMk_1552300272266.png",
    psdImg:"http://image.jx9n.com/XjRnJP6YSkPAffaFiYRH_1552300300503.png",
    psdOrnews:"密码登录", 
    checkHid: true,
    psdHid:false,
    phoneVul:"",
    psdVul:"",
    codeVul:"",
    time: "发送验证码", //倒计时  
    currentTime: 61,
    disabled:false,
    tel:""
  },
  onLoad:function(options){
    var that = this;
    var tel = options.tel || "";
    this.setData({
      tel: tel
    })
    if(app.api.vaildeParam(tel)){
      that.setData({
        phoneVul: tel
      })
    }
  },
  psdWay:function(){
    this.setData({
      checkHid: false,
      psdHid: true,
      psdOrnews: "手机快捷登录"
    })
  },
  checkWay: function () {
    this.setData({
      checkHid: true,
      psdHid: false,
      psdOrnews: "密码登录"
    })
  },
  setPhone:function(e){
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
  forgetpass:function(){
    wx.navigateTo({
      url: '../forgetpass/forgetpass'
    });
  },
  register: function () {
    wx.navigateTo({
      url: '../register/register'
    });
  },
  // 登录
  loginCode: function (params) {
    var mobile = this.data.phoneVul;
    var password = this.data.psdVul;
    var code = this.data.codeVul;
    var flag = this.data.checkHid;
    if (!app.api.vaildeParam(mobile)) {
      app.api.layer("手机号不能为空");
      return
    }
    var myreg = /^[1][0-9]{10}$/;
    if (!myreg.test(mobile)) {
      app.api.layer("手机格式不正确");
      return;
    }
    if (flag){
      if (!app.api.vaildeParam(password)) {
        app.api.layer("密码不能为空");
        return
      }
      var clientInfo = null;
      var params = {
        "clientInfo": clientInfo,
        "mobile": mobile,
        "password": password
      }
      app.api.postJSON("/api/member/login", params, function (res) {
        if ("0" == res.code) {
          app.api.layer("登录成功，正在跳转...");
          // 缓存本地
          app.api.setLoginData(res);
          app.globalData.userInfo = res.data;
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index'
            });
          }, 2000)
        }else{
          app.api.layer(res.msg);
        }
      })
    }else{
      if (!app.api.vaildeParam(code)) {
        app.api.layer("验证码不能为空");
        return
      }
      var clientInfo = null;
      var params = {
        "clientInfo": clientInfo,
        "mobile": mobile,
        "code": code
      }
      app.api.postJSON("/api/member/quickLogin", params, function (res) {
        if ("0" == res.code) {
          app.api.layer("登录成功，正在跳转...");
          app.api.setLoginData(res);
          app.globalData.userInfo = res.data;
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index'
            });
          }, 2000)
        }else{
          app.api.layer(res.msg);
        }
      })
    }
  },
  // 发送验证码
  getCode: function (options) {
    var currentTime = this.data.currentTime;
    var mobile = this.data.phoneVul;
    console.log(mobile, currentTime);
    if (!app.api.vaildeParam(mobile)) {
      app.api.layer("手机号不能为空");
      return
    }
    var myreg = /^[1][0-9]{10}$/;
    if (!myreg.test(mobile)) {
      app.api.layer("手机格式不正确");
      return;
    }
    var that = this;
    app.api.postJSON("/api/sms/sendCode", { "mobile": mobile }, function (res) {
      if ("0" == res.code) {
        interval = setInterval(function () {
          currentTime--;
          that.setData({
            time: currentTime + '秒',
            disabled: true
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              time: '重新发送',
              currentTime: 61,
              disabled: false
            })
          }
        }, 1000)
        app.api.layer("发送成功")
      } else {
        app.api.layer(res.msg)
      }
    })
  }
})