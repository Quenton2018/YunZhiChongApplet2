const app = getApp()


Page({
  data: {
    location:"定位中..." ,
    statusBarHeight: app.globalData.statusBarHeight,
    content: ["暂无可用充电桩"],
    pileNum:"5",
    socketList:[1,2,3,4,5,6,7,8,9,10,11,12],
    socketTab: -1,
    StakeList:[],
    stakeTab:0,
    timeTab:-1,
    timeList:"",
    tollList:[],
    fullTopflag:true,
    priceHid:true,
    price:1,
    id:'',
    socke:'',
    zcID: '',
    chargingGroupPriceId:'',
    method:'',
    minutes:'',
    have:0,
    zCode:"",
    defaultLoc:0,
    cutton:0,
    runImg:"http://image.jx9n.com/3xkZCdTiiX3b2AtSwahe_1552635910214.png",
    runImage: "http://image.jx9n.com/BwCC2yP2JDhpG2QemRdE_1552635910088.png",
    aanimationData: {},
    runHide:true,
    timer:null,
    one:false,
    two: false,
    three: false,
    four: false,
    five: false,
    six: false,
  },
  onLoad:function(options){
    var that = this;
    // 拿到传过来的片区id以及地址
    var areaSn = options.areaSn;
    var getArea = options.area;
    // 扫码传对应的充电桩编号
    var zCode = options.zCode||'';
    if (areaSn == undefined){
      that.setData({
        id: null
      })
    }else{
      that.setData({
        id: areaSn,
        location: getArea,
        zCode: zCode
      })
    }
  },
  onShow: function (){
    var that = this;
    var id = this.data.id;
    // 默认swiper显示点位置
    var defaultLoc = that.data.defaultLoc;
    clearInterval(that.data.timer)
    that.setData({
      defaultLoc:0,
      runHide: true,
      one: false,
      two: false,
      three: false,
      four: false,
      five: false,
      six: false,
    })
    if (id == null) {
      that.local();
    } else {
      that.getChargingByGroupID(id)
      that.getChargingGroupPrice(id)
    }
  },
  onPullDownRefresh: function () {
    app.api.showBusy()
    var that = this;
    var defaultLoc = that.data.defaultLoc;
    clearInterval(that.data.timer)
    that.setData({
      defaultLoc: 0
    })
    var id = this.data.id;
    if (id == null) {
      that.local();
    }else{
      that.getChargingByGroupID(id)
      that.getChargingGroupPrice(id)
    }
  },
  // 定位跳转
  openNativeTitle:function(){
    wx.showLoading({
      title: '加载中',
      success:function(){
        wx.navigateTo({
          url: "../selectChargeSearch/selectChargeSearch"
        })
        wx.hideLoading()
      }
    })
  },
  // 获取定位
  local:function(){
    var that = this;
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.location(latitude, longitude)
      }
    })
  },
  location: function (latitude, longitude){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    var params = {
      uuid: uuid,
      latitude: latitude,
      longitude: longitude,
      useLocation: false
    }
    app.api.postJSON("/api/chargingGroupSearch/getChargingGroup", params, function (res) {
      // console.log(res)
      wx.stopPullDownRefresh();
      app.api.hideBusy()
      var area = res.data.chargingGroup.name.substring(0, 10);
      var id = res.data.chargingGroup.code;
      that.setData({
        location: area
      })
      that.setData({
        id:id
      })
      that.getChargingByGroupID(id)
      that.getChargingGroupPrice(id)
    })
  },
  //根据片区id获取充电桩桩号
  getChargingByGroupID:function(id){
    var zCode = this.data.zCode;
    var that = this;
    if (!app.api.vaildeParam(id)) {
      app.api.layer("没有获取到片区");
      return;
    }
    app.api.postJSON("/api/charging/getChargingByGroupID", { "id": id}, function (res) {
      if ("0" == res.code) {
        wx.stopPullDownRefresh();
        app.api.hideBusy()
        var data = res.data;
        if (data.length == 0) {
          app.api.layer("暂无可用充电桩");
        }else{
          if (!app.api.vaildeParam(zCode)){
            var stakeCode = data[0].code;
          }else{
            var stakeCode = zCode;
          }
          // console.log(stakeCode)
          that.setData({
            code: stakeCode,
            have:1
          })
          that.getChargingSocketList(stakeCode);
        }
        that.getChargingStakeList(data)
      }
    })
  },
  // 获取充电桩号
  getChargingStakeList:function(data){
    var that = this;
    data.forEach(function(item){
      item.shell = item.shellId.substring(0, 1)
    });
    that.setData({
      StakeList: data
    })
    var stakeNum;
    if (data.length>=5){
      stakeNum = 5;
    }else{
      stakeNum = data.length
    }
    that.setData({
      pileNum: stakeNum+""
    });
  },
  // 选择充电桩
  selePile:function(e){
    var that = this;
    var stakeCode = e.target.dataset.code;
    that.setData({
      code: stakeCode,
      cutton: e.target.dataset.index
    })
    that.getChargingSocketList(stakeCode)
  },
  last:function(){
    var that = this;
    var defaultLoc = that.data.defaultLoc;
    var cutton = that.data.cutton;
    var StakeList = that.data.StakeList;
    var number = StakeList.length - 5;
    if (number > 0 && defaultLoc >= 1){
      that.setData({
        defaultLoc: defaultLoc - 1
      })
      var stakeCode = that.data.StakeList[that.data.defaultLoc].code;
      that.setData({
        code: stakeCode,
      })
      that.getChargingSocketList(stakeCode);
    }
  },
  prev: function () {
    var that = this;
    var defaultLoc = that.data.defaultLoc;
    var cutton = that.data.cutton;
    var StakeList = that.data.StakeList;
    var number = StakeList.length - 5;
    if (number > 0 && defaultLoc < number){
      that.setData({
        defaultLoc: defaultLoc + 1
      })
    }
    var stakeCode = that.data.StakeList[that.data.defaultLoc].code;
    that.setData({
      code: stakeCode,
    })
    that.getChargingSocketList(stakeCode);
  },
  //获取插座
  getChargingSocketList: function (stakeCode){
    var that = this;
    if (!app.api.vaildeParam(stakeCode)) {
      return;
    }
    app.api.showBusy()
    app.api.postJSON("/api/chargingSocket/listByCode", { "code": stakeCode }, function (res) {
      if("0" == res.code){
        wx.stopPullDownRefresh();
        app.api.hideBusy()
        // console.log(res)
        var list = res.data.sort(that.compare('code'));
        // console.log(list)
        list.forEach(function (item) {
          item.code = parseInt(item.code) + 1;
        })
        that.setData({
          socketList: list,
          socketTab:-1,
          timeTab:-1,
          zcID:"",
          minutes:"",
          fullTopflag: true,
          priceHid: true,
          cutton:0
        })
      }else{
        console.log(res.msg)
      }
    })
  },
  compare:function (property) {
    return function (a, b) {
      var value1 = parseFloat(a[property]);
      var value2 = parseFloat(b[property]);
      return value1 - value2;
    }
  },
  // 选择插座
  sockeClick: function (e) {
    var that = this;
    if (this.data.socketTab === e.target.dataset.index) {
      return false;
    } else {
      that.setData({
        socketTab: e.target.dataset.index,
      })
    }
    // 储存选择的插座号
    that.setData({
      zcID: e.target.dataset.id
    });
  },
  // 获取充电时长
  getChargingGroupPrice: function (groupID){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    if (!app.api.vaildeParam(groupID)) {
      layer.msg("没有获取到片区");
      return;
    }
    var params = {
      "groupID": groupID,
      "uuid": uuid
    }
    app.api.showBusy()
    app.api.postJSON("/api/charging/getPriceListByGroupID", params, function (res) {
      var data = res.data;
      wx.stopPullDownRefresh();
      app.api.hideBusy()
      data.forEach(function (item) {
        if (item.state == 1) {
          item.defaultTime2 = "充满自停";
        }else{
          if (item.defaultTime >= 60) {
            item.defaultTime2 = parseInt(item.defaultTime) / 60 + "小时"
          } else if (item.defaultTime < 60) {
            item.defaultTime2 = parseInt(item.defaultTime) + "分钟"
          }
        }
      });
      that.setData({
        timeList: data
      })
    })
  },
  // 选择时长
  timeClick: function (e) {
    var that = this;
    var state = e.target.dataset.state;
    var chargingGroupPriceId = e.target.dataset.id;
    var price = e.target.dataset.price;
    if (this.data.timeTab === e.target.dataset.index) {
      return false;
    } else {
      that.setData({
        timeTab: e.target.dataset.index
      })
    }
    if (state == 1){
      that.setData({
        fullTopflag: false,
        priceHid: true
      })
      that.showPriceDesc(chargingGroupPriceId, state)
    }
    if (state == -1) {
      that.setData({
        priceHid: false,
        fullTopflag: true,
        price: price
      })
    }
    that.setData({
      chargingGroupPriceId: chargingGroupPriceId,
      minutes: e.target.dataset.defaulttime,
      method: state
    })
  },
  showPriceDesc: function (chargingGroupPriceId, state){
    var that = this;
    app.api.showBusy()
    app.api.postJSON("/api/charging/getChargingPriceDesc", { "chargingPriceId": chargingGroupPriceId }, function (res) {
      var data = res.data;
      if (res.code == '0') {
        app.api.hideBusy()
        that.setData({
          tollList: data
        })
      }
    })
  },
  // 下发充电
  submitBtn: function (){
    var that = this;
    var zcID = that.data.zcID;
    var uuid = app.globalData.userInfo.uuid;
    var chargingGroupPriceId = that.data.chargingGroupPriceId;
    var minutes = that.data.minutes;
    var method = that.data.method;

    if (!app.api.vaildeParam(that.data.id)) {
      app.api.layer("没有获取到片区");
      return;
    }
    if (!app.api.vaildeParam(zcID)) {
      app.api.layer("还没选择插座");
      return;
    }
    if (zcID.length<=0) {
      app.api.layer("还没选择插座");
      return;
    }
    if (!app.api.vaildeParam(minutes)) {
      app.api.layer("你还没选择时间");
      return;
    }
    var data={
      "uuid": uuid,
      "zcID": zcID,
      "chargingGroupPriceId": chargingGroupPriceId,
      "minutes": minutes,
      "method": method
    }
    that.runHide()
    setTimeout(function(){
      that.setData({
        one:true
      })
    },500)
    setTimeout(function () {
      that.setData({
        two: true
      })
    }, 900)
    setTimeout(function () {
      that.setData({
        three: true
      })
    }, 1300)
    setTimeout(function () {
      that.setData({
        four: true
      })
    }, 1700)
    setTimeout(function () {
      that.setData({
        five: true
      })
    }, 2100)
    app.api.postJSON("/api/DeviceCommand/sendChargeCommand", data, function (res) {
      if ("0" == res.code) {
        clearInterval(that.data.timer)
        // if (res.data.givePoints > 0) {
        //   app.api.layer("充电成功");
        // }
        setTimeout(function () {
          that.setData({
            six: true
          })
        }, 800)
        var orderNo = res.data.sn;
        setTimeout(function () {
          wx.navigateTo({
            url: "../chargeing/chargeing?orderNo=" + orderNo
          });
        }, 1000)
        that.setData({
          aanimationData: {},
        })
      }else{
        that.setData({
          runHide: true,
          one: false,
          two: false,
          three: false,
          four: false,
          five: false,
          six: false,
          aanimationData: {},
        })
        clearInterval(that.data.timer)
        if ('未知错误' == res.msg) {
          app.api.layer("请求超时");
        } else {
          app.api.layer(res.msg);
        }
      }
    }) 
  },
  runHide:function(){
    var that = this;
    this.setData({
      runHide:false
    })
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    })
    this.animation = animation;
    this.setData({
      animationData: animation.export()
    })
    var n = 0;
    that.setData({
      timer: setInterval(function () {
        n = n + 1;
        this.animation.rotate(90 * (n)).step()
        this.setData({
          animationData: this.animation.export()
        })
      }.bind(this), 1000)
    })
  }
})