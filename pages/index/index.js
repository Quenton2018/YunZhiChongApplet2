
const app = getApp()

Page({
  data: {
    isIpx: app.globalData.isIpx
  },
  onLoad: function () {

  },
  goToMyPage:function(){
    wx.navigateTo({
      url: '../recharge/recharge'
    })
  }
})

