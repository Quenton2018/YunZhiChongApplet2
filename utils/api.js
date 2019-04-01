var apiHost = "http://api.jx9n.com";
// var apiHost = "http://39.106.62.16:8181";
// var apiHost = "http://192.168.2.182:8181/";
// var apiHost = "http://192.168.2.102:8181/"
module.exports = {
  postJSON: function (url, data, success){
    wx.request({
      url:apiHost+url,
      data: data,
      method:"POST",
      header:{
        "content-type":"application/x-www-form-urlencoded"
      },
      success:function(res) {
        success(res.data)
      },
      fail:function(res){
        console.log(res)
        wx.showToast({
          title: "服务异常",
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  // 获取用户信息校验登录
  setLoginData: function (res){
    wx.setStorageSync('userinfo',res.data);
  },
  clearLogin:function(){
    wx.clearStorageSync("userinfo")
  },
  vaildeParam: function (param){
    if (typeof param == 'undefined') {
      return false;
    }
    if (undefined == param) {
      return false
    }
    if (null == param) {
      return false;
    }
    if (param.length == 0) {
      return false;
    }
    return true;
  },
  checkLogin: function (page){
    var userinfo = wx.getStorageInfoSync("userinfo");
    var uuid = wx.getStorageInfoSync("uuid");
    var loginDate = wx.getStorageInfoSync("login_date");
    if (!vaildeParam(userinfo) || !vaildeParam(uuid) || !vaildeParam(loginDate)) {
      if (vaildeParam(page)) {
        go(page)
      } else {
        go("../logs/logs")
      }
    }
  },
  layer:function(msg){
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 3000
    })
  },
  go:function(page){
    wx.navigateTo({
      url: page
    })
  },
  toDate: function (modifyDate) {
    var date = new Date(modifyDate);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hour = date.getHours() < 10 ? '0' + date.getHours() + ":" : date.getHours() + ":";
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() + ":" : date.getMinutes() + ":";
    var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    var modifyTime = Y + M + D + " " + hour + minute + second
    return modifyTime;
  },
  getTime: function (result) {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return result = h + ":" + m + ":" + s;
  },
  checkNetStatu:function(){
    var statu = true;
    wx.getNetworkType({
      success: function (res) {
        var networkType = res.networkType;
        if (networkType == "none") {
          wx.showModal({
            title: '提示',
            content: "没有网络连接,请检查您的网络设置",
            showCancel: false,
          })
          statu = false
        } else if (networkType == "unknown") {
          wx.showModal({
            title: '提示',
            content: '未知的网络类型,请检查您的网络设置',
            showCancel: false,
          })
          statu = false
        }
      }
    })
  },
  // 显示加载提示框
  showBusy: function () {
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading'
    })
  },
  // 关闭加载提示框
  hideBusy:function(){
    wx.hideToast({
      title: '加载中...',
      mask: true,
      icon: 'loading'
    })
  }
}