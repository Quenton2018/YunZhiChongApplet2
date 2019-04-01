const app = getApp()
var pageNumber = 1;
var pageSize = 10;

Page({
  data: {
    detail:["消费明细","充值明细"],
    index:1,
    newsList:[],
    nullList:false,
    newsHide:true,
    consumptionType: 1,
    noneList:true
  },
  onLoad: function (options) {
    var consumptionType = this.data.consumptionType;
    wx.showLoading({
      title: '玩命加载中'
    })
    this.getList(consumptionType)
  },
  onReachBottom: function () {
    var consumptionType = this.data.consumptionType;
    pageSize+=10;
    wx.showLoading({
      title: '玩命加载中'
    })
    this.getList(consumptionType)
  },
  clickTab:function(e){
    var that = this;
    var type = e.currentTarget.dataset.type;
    wx.showLoading({
      title: '玩命加载中'
    })
    if (this.data.type === e.currentTarget.dataset.type){
      return false
    }else{
      that.setData({
        index: e.currentTarget.dataset.type
      })
    }
    var consumptionType = that.data.index;
    this.getList(consumptionType)
  },
  getList: function (consumptionType){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    var consumptionType = consumptionType;
    if (app.api.vaildeParam(uuid)) {
      var dataParam = {
        "uuid": uuid,
        "recordType": "0",
        "consumptionType": consumptionType,
        "pageSize": pageSize,
        "pageNumber": pageNumber
      }
      app.api.postJSON("/api/detailRecord/getDetailRecordList", dataParam, function (res) {
        if ("0" == res.code) {
          var list = res.data.pagedata.content; 
          if (list.length <= pageSize){
            that.setData({
              noneList:false
            })
          }
          list.forEach(function (item) {
            item.createDate = app.api.toDate(item.createDate)
          });
          if (list.length == 0 && pageNumber > 1) {
            return;
          }
          if (!app.api.vaildeParam(list)) {
            that.setData({
              nullList:false,
              newsHide:true
            })
          } else {
            that.setData({
              newsList: list,
              consumptionType: consumptionType,
              nullList: true,
              newsHide: false
            })
          }
          wx.hideLoading();
        }
      })
    }
  }
})