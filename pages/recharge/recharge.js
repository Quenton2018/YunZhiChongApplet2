const app = getApp()
// var apiHost = "http://192.168.2.182:8181";
var apiHost = "http://39.106.62.16:8181";
Page({
  data: {
    radioItems: [
      { name: '微信', value: '0', src: "http://image.jx9n.com/EBwe4MKs7iDhYkHd862z_1552300973542.png", checked: true},
      // { name: '支付宝', value: '1', src: "https://qiniuyun.quenton.cn/yunzhichongApplet/recharge/zhifubao.png", checked: true }
    ],
    recharge:null,
    index:null,
    seq:null,
    money:""
  },
  onLoad: function (options) {
    this.setData({
      index:0,
      seq:0
    })
    this.getMoneyList()
  },
  onShow:function(){
    var openid = wx.getStorageSync('user').openid == undefined ? wx.getStorageSync('user1').openid : wx.getStorageSync('user').openid
    console.log(openid)
  },
  radioChange: function (e) {
    console.log( e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
  },
  getMoneyList:function(){
    var that = this;
    app.api.postJSON("/api/recharge/getRechargeConfigurationList", { "code": "top_up" }, function (res) {
      if ("0" == res.code) {
        var data = res.data;
        var money = res.data[0].money;
        data.forEach(function (item) {
          if (item.showText == "支付宝充值优惠"){
            item.showText = ""
          }
          item.text = item.showText;
          if (!app.api.vaildeParam(item.showText)){
            item.showText = true;
          }
          that.setData({
            active: true,
            money: money
          })
        })
        that.setData({
          recharge: data
        })
      }
    })
  },
  selPrice:function(e){
    var that = this;
    var money = e.currentTarget.dataset.money;
    var index = e.currentTarget.dataset.index;
      that.setData({
        seq: index,
        money:money
      })
  },
  clickPay:function(){
    var uuid = app.globalData.userInfo.uuid;
    var money = this.data.money;
    console.log(money)
    var openid = wx.getStorageSync('user').openid == undefined ? wx.getStorageSync('user1').openid : wx.getStorageSync('user').openid
    if (!app.api.vaildeParam(openid)){
      wx.navigateTo({
        url: '../tologin/tologin',
      })
      return false;
    }
    var data = {
      "uuid": uuid,
      "money": money,
      // "openId": "o7xzy5Jcqo_1-AdR8pUNb8GKors8"
      // "openId": "owlIb0XcDEEz-aIOCWJ53KzsKdQ0"
      "openId": openid
    }
    wx.request({
      url: apiHost + '/api/pay/wxAppPay',
      data: data,
      method:"GET",
      success: function (res) {
        var data = res.data.data; 
        console.log(data);
        wx.requestPayment(
          {
            "timeStamp": data.timestamp,
            "nonceStr": data.nonceStr,
            "package": data.package,
            "signType":"MD5",
            "paySign": data.paySign,
            "success":function(res){
              console.log(res)
            },
            "fail":function(res){
              console.log(res)
            }
          }
        )
      },
    })
  }
})