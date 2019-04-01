// pages/my/my.js
const app = getApp()

Page({
  data: {
    userImg:"http://image.jx9n.com/QdkftTjEGrGSMJaGBbKM_1552359805350.png",
    money:0,
    points:0,
    nickname:"默认昵称",
    sign:"签到",
    tell:15180172690,
    chargeImg:"http://image.jx9n.com/Yy7YNCcrpaiWnkWc5K4c_1552359838553.png",
    walletImg:"http://image.jx9n.com/zWknwszpCczWpF368Bx4_1552359858075.png",
    icImg:"http://image.jx9n.com/8Wjnsrx8N3Xsi6ji8YeZ_1552359885238.png",
    partnerImg:"http://image.jx9n.com/YPpQnFYfZfy8hQyT7zTB_1552359907291.png",
    friendImg:"http://image.jx9n.com/3DKxDnJp4R6BtGww6Fxd_1552359933695.png",
    serviceImg:"http://image.jx9n.com/NSriBDbXJDejpniYWD4W_1552359953469.png",
    setImg:"http://image.jx9n.com/f8da8phHaAKwF3nMP4AT_1552359973183.png",
    disable:false
  },
  onLoad: function () {
 
  },
  onShow:function(){
    var self = this;
    var uuid = app.globalData.userInfo.uuid;
    app.api.postJSON("/api/member/info", { "uuid": uuid }, function (res) {
      if ("0" == res.code) {
        var userinfo = res.data;
        app.api.setLoginData(res);
        self.updateuserinfo(userinfo);
      }
    })
    var userinfo = wx.getStorageSync("userinfo");
    this.updateuserinfo(userinfo);
    app.api.postJSON("/api/userSign/isSignToday", { "uuid": uuid }, function (res) {
      if (res.data == true) {
        self.setData({
          sign: "已签到",
          disable: true
        })
      }
    })
  },
  updateuserinfo: function (userinfo){
    var userImg = userinfo.headImage;
    var money = userinfo.money;
    var elePayIce = userinfo.elePayIce == null ? 0 : userinfo.elePayIce;
    var totalMoney = money + elePayIce;
    var points = userinfo.points;
    var nickname = userinfo.nickname;
    var mobile = userinfo.mobile;
    var tel = mobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2');
    if (nickname) {
      this.setData({
        nickname: nickname
      })
    }
    if (userImg) {
      this.setData({
        userImg: userImg
      })
    }
    if (totalMoney) {
      this.setData({
        money: totalMoney
      })
    }
    if (tel) {
      this.setData({
        tell: tel
      })
    }
    if (points) {
      this.setData({
        points: points
      })
    }
  },
  onPullDownRefresh: function () {
    var self = this;
    var uuid = app.globalData.userInfo.uuid;
    app.api.postJSON("/api/member/info", { "uuid": uuid }, function (res) {
      if ("0" == res.code) {
        wx.stopPullDownRefresh();
        var userinfo = res.data;
        app.api.setLoginData(res);
        self.updateuserinfo(userinfo);
      }
    })
  },
  // 签到
  qianDao:function(){
    var self = this;
    var uuid = app.globalData.userInfo.uuid
    var points = self.data.points;
    console.log(uuid)
    app.api.postJSON("/api/userSign/clickSign",{"uuid":uuid},function (res) {
      if ("0" == res.code) {
        var score = res.data.score;
        self.setData({
          points: points + score,
          sign: "已签到",
          disable:true     
        })
        app.api.layer('今日签到成功赠送您' + score + "云钻")
      }else{
        app.api.layer(res.msg)
      }
    })
  },
  clickHref:function(url){
    url:url
  },
  userInfo:function(){
    wx.navigateTo({
      url: '../userInfo/userInfo',
    })
  }  
})