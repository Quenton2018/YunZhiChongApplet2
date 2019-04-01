var WxParse = require('../../wxParse/wxParse.js');

const app = getApp();
Page({
  data: {
    paoblem:"",
    contentAbstract:""
  },
  onLoad: function (options) {
    var that = this;
    var categoryId = options.categoryId;
    wx.setNavigationBarTitle({
      title: options.anchorTargetText
    }) 
    var params = {
      "categoryId": categoryId
    }
    app.api.postJSON("/api/article/getArticleByCategoryTwoId", params, function (res) {
      if ("0" == res.code) {
        if (null != res.data) {
          var contentAbstract = res.data.content;
          // that.setData({
          //   contentAbstract: contentAbstract
          // })
          var data = res.data.content;
          var article = ``+data+``;
          WxParse.wxParse('article', 'html', article, that);
        }
      }
    })
  }
})