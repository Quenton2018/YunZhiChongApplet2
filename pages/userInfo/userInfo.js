const app = getApp()
var apiHost = "http://39.106.62.16:8181";


Page({
  data: {
    headImg:"https://qiniuyun.quenton.cn/yunzhichongApplet/menuapp_10.png",
    mobile: "",
    nickname: "系统默认",
    gender: "男",
    actionSheetHidden: true,
    actionSheetItems: [
      { id: 'id', txt: '女' },
      { id: 'id', txt: '男' }
    ],
    index: '',
    tempFilePaths: ''
  },
  onLoad: function () {
    // this.getUserInfo()
    // this.updateUserInfo()
  },
  onShow:function(){
    this.getUserInfo()
    this.updateUserInfo()
  },
  onPullDownRefresh: function () {
    this.updateUserInfo();
  },
  updateUserInfo:function(){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    app.api.postJSON("/api/member/info", { "uuid": uuid }, function (res) {
      if ("0" == res.code) {
        console.log("## onPullDownRefresh ##")
        wx.stopPullDownRefresh();
        app.api.setLoginData(res);
        that.getUserInfo();
      }else{
        app.api.layer(res.msg)
        app.api.clearLogin()
        wx.reLaunch({
          url: '../logs/logs',
        })
      }
    })
  },
  getUserInfo:function(){
    var that = this;
    var userinfo = wx.getStorageSync("userinfo");
    if (app.api.vaildeParam(userinfo)) {
      var mobile = userinfo.mobile;
      var headImage = userinfo.headImage;
      var nickname = userinfo.nickname;
      var gender = userinfo.gender;
      if (app.api.vaildeParam(headImage)){
        that.setData({
          headImg: headImage
        })
      }
      if (app.api.vaildeParam(nickname)) {
        that.setData({
          nickname: nickname
        })
      }
      if (app.api.vaildeParam(gender)) {
        that.setData({
          gender: gender
        })
      }
      if (app.api.vaildeParam(mobile)) {
        that.setData({
          mobile: mobile
        })
      }
    }
  },
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindid: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    var uuid = app.globalData.userInfo.uuid;
    this.setData({
      index: index,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    console.log(that.data.index)
    var gender = (index == 1) ? '男' : '女';
    var params = {
      "uuid": uuid,
      "gender": gender,
      "nickname": '',
      "homeAddress": ''
    }
    app.api.postJSON("/api/member/updateMemberInfo", params, function (res) {
      if ("0" == res.code) {
        that.updateUserInfo()
      }else{
        app.api.layer(res.msg)
      }
    })
  },
  chooseimage:function(){
    var uuid = app.globalData.userInfo.uuid;
    var _this = this;
    wx.chooseImage({
      count: 1,
      success:function(res){
        _this.setData({
          headImg: res.tempFilePaths[0]
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], 
          encoding: 'base64', 
          success: res => { 
            _this.urlTobase64(res.data);
          }
        }) 
      }
    })
  },
  urlTobase64: function (base64) {
    var _this = this;
    var uuid = app.globalData.userInfo.uuid;
    var data = {
      "uuid": uuid,
      "img": base64
    }
    app.api.postJSON("/api/member/uploadPicture", data, function (res) {
      if("0" == res.code){
        console.log(res.data)
        _this.setData({
          headImg: res.data
        })
      }else{
        app.api.layer('网络异常，请稍后再试！')
      }
    })
  },
  logOut:function(){
    wx.showModal({
      content: '确认退出登录',
      success: function (res) {
        if (res.confirm) {
          app.api.layer("退出登录成功")
          setTimeout(function(){
            app.api.clearLogin()
            wx.reLaunch({
              url: '../logs/logs',
            })
          },2000)
        } else if (res.cancel) {}
      }
    })
  }
})