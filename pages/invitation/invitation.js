const app = getApp()

Page({
  data: {
    inviteTel:"",
    invitationCount:"0",
    givePoints:"0",
    tempFilePaths: '',
    motto: '分享给朋友',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (options) {
    var userinfo = wx.getStorageSync("userinfo");
    var inviteTel = userinfo.mobile;
    this.setData({
      inviteTel: inviteTel
    })
    this.getInvitationStatistics()
  },
  onPullDownRefresh: function () {
    this.getInvitationStatistics()
  },
  onShareAppMessage: function (ops){
    var inviteTel = this.data.inviteTel;
    console.log(inviteTel)
    var that = this;
    if (ops.from === 'button') {
      console.log(ops.target)
    }
    return {
      title: '云智充智能共享充电桩',
      path: 'pages/invite/invite?inviteTel=' + inviteTel,
      success: function (res) {
        app.api.layer("发送成功")
      },
      fail: function (res) {
        app.api.layer("发送失败")
      }
    }
  },
  getInvitationStatistics:function(){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    if (app.api.vaildeParam(uuid)) {
      app.api.postJSON("/api/invitationLog/getInvitationStatistics", { "uuid": uuid }, function (res) {
        if ("0" == res.code) {
          wx.stopPullDownRefresh();
          var invitationCount = res.data.invitationCount;
          var givePoints = res.data.givePoints;
          that.setData({
            invitationCount: invitationCount,
            givePoints: givePoints
          })
        }else{
          app.api.layer(res.msg)
        }
      })
    }
  }
})