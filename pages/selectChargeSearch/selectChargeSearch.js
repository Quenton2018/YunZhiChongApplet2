const app = getApp()

Page({
  data: {
    hide:true,
    searchHid:false,
    getAddress:"加载中...",
    area:"",
    latitude:'',
    longitude:'',
    lastAddress:"",
    nearAddress:"",
    areaSn:"",
    dataList:"",
    searchHide:true,
    localHide:false,
    searchList:true
  },
  onLoad: function (options) {
    this.local();
  },
  // 获取定位
  local: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
        var latitude = that.data.latitude
        var longitude = that.data.longitude
        that.location(latitude, longitude)
        that.getChargingGroupNearList(latitude, longitude);
      }
    })
  },
  location: function (latitude, longitude) {
    console.log(latitude, longitude)
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    if (!app.api.vaildeParam(longitude) || !app.api.vaildeParam(latitude)) {
      app.api.layer("定位失败，请重新定位");
      return;
    }
    var params = {
      uuid: uuid,
      latitude: latitude,
      longitude: longitude,
      useLocation: true
    }
    app.api.postJSON("/api/chargingGroupSearch/getChargingGroup", params, function (res) {
      var area = res.data.chargingGroup;
      var code = res.data.chargingGroup.code;
      that.setData({
        getAddress: area
      })
    })
  },
  relocation:function(){
    this.showBusy();
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    var uuid = app.globalData.userInfo.uuid;
    var that = this;
    if (!app.api.vaildeParam(longitude) || !app.api.vaildeParam(latitude)) {
      app.api.layer("定位失败，请重新定位");
      return;
    }
    this.setData({
      getAddress: {
        name:"定位中..."
      }
    })
    var params = {
      uuid: uuid,
      latitude: latitude,
      longitude: longitude,
      useLocation: true
    }
    app.api.postJSON("/api/chargingGroupSearch/getChargingGroup", params, function (res) {
      var area = res.data.chargingGroup;
      var code = res.data.chargingGroup.code;
      that.setData({
        getAddress: area
      })
      wx.hideToast()
    })
  },
  showBusy: function () {
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading',
      duration: 100000,
    })
  },
  getChargingGroupNearList: function (latitude, longitude){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    console.log(uuid, latitude, longitude)
    var params = {
      uuid: uuid,
      latitude: latitude,
      longitude: longitude,
      useLocation: false
    }
    app.api.postJSON("/api/chargingGroupSearch/getNearChargingGroup", params, function (res) {
      that.setData({
        nearAddress: res.data.near,
        lastAddress: res.data.recent
      })
    })
  },
  goAddress:function(e){
    var code = e.target.dataset.code;
    var area = e.target.dataset.area;
    this.setData({
      areaSn: code,
      area: area
    })
    var areaSn = this.data.areaSn;
    var area = this.data.area
    console.log(areaSn, area)
    wx.reLaunch({
      url: "../charge/charge?areaSn=" + areaSn + "&area=" + area
    })
  },
  tapAddress:function(e){
    var areaCode = e.target.dataset.code;
    var area = e.target.dataset.area;
    this.setData({
      areaSn: areaCode,
      area: area
    })
    var areaSn = this.data.areaSn;
    var area = this.data.area
    console.log(areaSn,area)
    wx.reLaunch({
      url: "../charge/charge?areaSn=" + areaSn + "&area=" + area
    })
  },
  clickAddress:function(e){
    var areaSn = e.target.dataset.sn;
    var area = e.target.dataset.area;
    this.setData({
      areaSn: areaSn,
      area: area
    })
    var areaSn = this.data.areaSn;
    var area = this.data.area
    console.log(areaSn, area)
    wx.reLaunch({
      url: "../charge/charge?areaSn=" + areaSn + "&area="+area
    })
  },
  // 搜索
  search:function(e){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    console.log(uuid)
    var value = e.detail.value;
    console.log(value)
    if (app.api.vaildeParam(value)) {
      that.setData({
        localHide: true,
        searchHide: false,
        searchList: false
      })
      var params = {
        uuid: uuid,
        keywords: value,
        limit: 10
      }
      app.api.postJSON("/api/chargingGroupSearch/searchChargingGroup", params, function (res) {
        if ("0" == res.code) {
          if (app.api.vaildeParam(res.data)) {
            var dataList = res.data
            that.setData({
              dataList: res.data
            })
          }
        }
      })
    }else{
      that.setData({
        localHide: false,
        searchHide: true,
        searchList: true
      })
    }
  }
})