const app = getApp()

Page({
  data: {
    value:""
  },
  onLoad: function () {
    
  },
  bingInp:function(e){
    var value = e.detail.value;
    this.setData({
      value: value
    })
  },
  getList:function(){
    var uuid = app.globalData.userInfo.uuid;
    var value = this.data.value;
    if (!app.api.vaildeParam(value)) {
      app.api.layer("新昵称不能为空");
      return;
    }
    var data = {
      "uuid": uuid,
      "gender": '',
      "nickname": this.data.value,
      "homeAddress": ''
    }
    app.api.postJSON("/api/member/updateMemberInfo", data, function (res) {
      app.api.layer(res.msg);
      if ("0" == res.code) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
  
})