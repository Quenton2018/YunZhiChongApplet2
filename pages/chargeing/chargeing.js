const app = getApp()
Page({
  data: {
    orderAddr:"",
    orderZh:'',
    orderCz:"",
    orderTime:"0",
    orderMoney:"0",
    charginTime:"00:00:00",
    hide:true,
    show:false,
    hiddenmodalput: true,
    methods: "充满自停",
    total: '12',
    orderNo:'',
    timer:null,
    cdFlag:false
  },
  onLoad: function (options){
    this.setData({
      orderNo: options.orderNo,
      cdFlag:false
    })
    this.loadData()
    console.log("订单", options.orderNo)
  },
  onPullDownRefresh: function () {
    var that = this;
    clearInterval(that.data.timer);
    this.loadData()
  },
  // 点击结束充电
  modalcnt:function(){
    var that = this;
    var orderNo = this.data.orderNo;
    var uuid = app.globalData.userInfo.uuid;
    console.log(orderNo, uuid)
    var params = {
      uuid: uuid,
      sn: orderNo
    }
    this.setData({
      hiddenmodalput: false
    })
    app.api.postJSON("/api/userChargingDetail/settlement", params, function (res) {
      if ("0" == res.code) {
        that.setData({
          total: res.data.chargingPrice
        })
      }else{
        app.api.layer(res.msg)
      }
    })
  },
  cancel: function (e) {
    this.setData({
      hiddenmodalput:true
    })
  },
  countDownTime: function (timeTotal, remainingSeconds, goon){
    var that = this;
    var seconds = timeTotal - remainingSeconds;	
    var estimateHours = parseInt(timeTotal / 3600);
    var estimateMinutes = parseInt(timeTotal / 60) - estimateHours * 60;
    var uuid = app.globalData.userInfo.uuid;
    that.showTime(timeTotal, remainingSeconds);
    if (goon) {
      that.setData({
        timer:setInterval(function () {
          remainingSeconds--;
          if (remainingSeconds >= 0) {
            that.showTime(timeTotal, remainingSeconds);
          }
          // 每分钟查询一次
          var orderNo = that.data.orderNo;
          if (remainingSeconds % 60 == 0 || remainingSeconds <= 0) {
            if (app.api.vaildeParam(uuid) && app.api.vaildeParam(orderNo)) {
              var params = {
                "uuid": uuid,
                "charge_order_number": orderNo
              }
              console.log(orderNo)
              var cdFlag = that.data.cdFlag;
              if (cdFlag == false){
                app.api.postJSON("/api/userChargingDetail/order", params, function (res) {
                  if ("0" == res.code) {
                    if (res.data.endReason != null) {
                      clearInterval(that.data.timer);
                      app.api.layer('充电结束');
                      wx.navigateTo({
                        url: "../chargeDetail/chargeDetail?orderNo=" + orderNo
                      })
                      return false
                    }
                  }
                })
              }
            }
          }
        }, 1000)
      }) 
    }
  },
  showTime:function (timeTotal, remainingSeconds) {
    var that = this;
    var timestr;
    if(remainingSeconds <= 0) {
      remainingSeconds = 0;
    }
    var seconds = timeTotal - remainingSeconds;
    var hours = parseInt(seconds / 3600);
    var minutes = parseInt(seconds / 60) - hours * 60;
    seconds = seconds % 60;
    timestr = (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    that.setData({
      charginTime: timestr
    })
  },
  // 获取数据
  loadData:function(){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    var orderNo = that.data.orderNo;
    if (app.api.vaildeParam(uuid) && app.api.vaildeParam(orderNo)) {
      var params = {
        "uuid": uuid,
        "charge_order_number": orderNo
      }
      app.api.postJSON("/api/userChargingDetail/order", params, function (res) {
        if ("0" == res.code) {
          wx.stopPullDownRefresh();
          if (res.data.endReason != null) {
            clearInterval(that.data.timer);
            app.api.layer('充电结束');
            wx.navigateTo({
              url: "../chargeDetail/chargeDetail?orderNo=" + orderNo
            })
            return false;
          }
          var timeTotal = res.data.timeTotal * 60;
          var chargingTime = res.data.chargingTime;
          var powerConsumption = res.data.powerConsumption == null ? 0 : res.data.powerConsumption;
          // var chargingPower = chargingTime == null ? 0 : parseInt((powerConsumption / 2.7778E-7) / (chargingTime * 60));
          var seconds;
          var goon = res.data.status == 1 && res.data.endReason == null;
          if (goon) {
            seconds = parseInt((res.data.endDate < new Date().getTime() ? 0 : res.data.endDate - new Date().getTime()) / 1000);
          } else {
            seconds = timeTotal - parseInt(chargingTime) * 60;
          }
          if (res.data.charging.groupId) {
            that.setData({
              orderAddr: res.data.charging.groupId.name,
              orderZh: res.data.charging.shellId.substr(0, 1)
            })
          }
          if (res.data.czId) {
            var orderCz = parseInt(res.data.czId.code) + 1;
            that.setData({
              orderCz: orderCz
            })
          }
          if (res.data.method == "1") {
            that.setData({
              show: false,
              hide: true,
              methods: "充满自停"
            })
          } else {
            if (res.data.method == "-1") {
              that.setData({
                methods: "预付扣款"
              })
            }else{
              that.setData({
                methods: "实际扣款"
              })
            }
            that.setData({
              show: true,
              hide: false,
              orderTime: timeTotal / 3600
            })
          }
          that.setData({
            orderMoney: res.data.amount
          })
          that.countDownTime(timeTotal, seconds, goon);  
        }else{
          app.api.layer(res.msg)
        }
      })
    }
  },
  over: function (e) {
    var that = this;
    var orderNo = this.data.orderNo;
    var uuid = app.globalData.userInfo.uuid;
    console.log(orderNo, uuid)
    var params = {
      uuid: uuid,
      sn: orderNo
    }
    app.api.postJSON("/api/DeviceCommand/trunOffCharge", params, function (res) {
      if ("0" == res.code) {
        clearInterval(that.data.timer);
        that.setData({
          cdFlag:true
        })
        wx.redirectTo({
          url: "../chargeDetail/chargeDetail?orderNo=" + orderNo
        })
      } else {
        app.api.layer(res.msg)
      }
    })
  },
})