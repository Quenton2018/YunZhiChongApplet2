const app = getApp()

Page({
  data: {
    list:"",
    img:[
      "http://image.jx9n.com/iGXE5FbrFsAZ4YK5SP3S_1552540904327.png",
      "http://image.jx9n.com/cmSzkt2kAmEbJbhyx4hF_1552540943886.png",
      "http://image.jx9n.com/DDhN7fa8m86JwQaQWQNW_1552540969935.png",
      "http://image.jx9n.com/nanQWjzABrafXFh3PXhe_1552540989895.png",
      "http://image.jx9n.com/eiwEj5bADYN5QQEYZZ2E_1552541008168.png",
      "http://image.jx9n.com/XfbXE24jej6TXmiB5Tya_1552541026227.png",
      "http://image.jx9n.com/QYT3Zb5HaxdQ6tBXp7Cn_1552541047105.png",
      "http://image.jx9n.com/ptJFMJJSinyP6BsSQT47_1552541064938.png"
    ]
  },
  onLoad: function (options) {
    this.getList()
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '400-825-1068'
    })
  },
  getList:function(){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    if (app.api.vaildeParam(uuid)) {
      var dataParam = {
        "uuid": uuid,
        "pageSize": 10,
        "pageNumber": 1,
        "categoryName": '客服中心'
      }
      app.api.postJSON("/api/article/getArticleCategoryList", dataParam, function (res) {
        if ("0" == res.code) {
          var list = res.data.pagedata.content;
          var img = that.data.img;
          that.setData({
            list:list
          })
        } else {
          layer.msg(res.msg);
        }
      })
    }
  },
  jumpPage:function(e){
    console.log(e.currentTarget.dataset.id)
    var categoryId = e.currentTarget.dataset.id;
    console.log(e._relatedInfo.anchorTargetText);
    var anchorTargetText = e._relatedInfo.anchorTargetText;
    wx.navigateTo({
      url: '../commonProblem/commonProblem?categoryId=' + categoryId + "&anchorTargetText=" + anchorTargetText
    })
  }
})