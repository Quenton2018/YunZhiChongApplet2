const app = getApp()

var pageNumber = 1;
var pageSize = 10;
Page({
  data: {
    itemList:'',
    list:[],
  },
  onLoad: function (options) {
    
  },
  onShow:function(){
    this.getList()
  },
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    var pageSize = 10;
    this.getList()
  },
  onReachBottom: function () {
    console.log("上拉加载")
    pageSize+=10;
    var that = this;
    wx.showLoading({
      title: '玩命加载中'
    })
    this.getList()
  },
  getList:function(){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    if (app.api.vaildeParam(uuid)) {
      var dataParam = {
        "uuid": uuid,
        "pageSize": pageSize,
        "pageNumber": pageNumber
      }
      app.api.postJSON("/api/userChargingDetail/getUserList", dataParam, function (res) {
        wx.stopPullDownRefresh();
        if ("0" == res.code) {
          var list = res.data.pagedata.content;
          list.forEach(function (item) {
            if (1 == item.status) {
              item.charging.shellId = item.charging.shellId.substr(0,1);
              item.czId.code = parseInt(item.czId.code) + 1;
              var timer = new Date().getTime();
              console.log(timer)
              var timeFiff = item.endDate - timer;
              console.log(item.endDate)
              console.log(timeFiff)
              if (timeFiff <= 0) {
                item.timeDiffString = "0秒";
              }else{
                item.timeDiffString = that.getTime(timeFiff/1000);
                console.log(item.timeDiffString)
              }
              var timeTotal = item.timeTotal * 60 * 1000;
              var percent = timeFiff / timeTotal;
              if (percent < 0) {
                item.percent = 0;
              }
              item.percent = percent * 100;
            }else{
              var leftTime = item.pullOutDate - item.createDate;
              item.remainder = parseInt(leftTime / 60000);
            }
            item.createDate = app.api.toDate(item.createDate);
          })
          that.setData({
            list: list
          })
          wx.hideLoading();
        }
      })
    }
  },
  getTime: function (result) {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return result = h + "小时 " + m + "分钟 " + s + "秒";
  }
})