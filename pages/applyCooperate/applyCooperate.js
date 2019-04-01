const app = getApp()

Page({
  data: {

  },
  calling:function(){
    wx.makePhoneCall({
      phoneNumber: '400-825-1068'
    })
  }
})