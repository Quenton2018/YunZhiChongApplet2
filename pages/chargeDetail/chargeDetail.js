const app = getApp()


Page({
  data: {
    flag:null,
    pullOutDate:"",
    createDate:"",
    userTime:"",
    shellId:"",
    czId:"",
    name:"",
    amount:""
  },
  onLoad: function (options) {
    var orderNo = options.orderNo;
    var uuid = app.globalData.userInfo.uuid;
    console.log(uuid, orderNo)
    this.loadData(orderNo)
  },
  loadData: function (orderNo){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    var params = {
      "uuid": uuid,
      "charge_order_number": orderNo
    }
    if (app.api.vaildeParam(uuid) && app.api.vaildeParam(orderNo)) {
      app.api.postJSON("/api/userChargingDetail/order", params, function (res) {
        if(res.code=="0"){
          var list = res.data;
          var pullOutDate = list.pullOutDate;
          var createDate = list.createDate;
          var shellId = list.charging.shellId.substr(0, 1);
          var czId = parseInt(list.czId.code)+1;
          var amount = list.amount;
          var name = list.charging.groupId.name;
          var modifyTime = app.api.toDate(pullOutDate);
          var createTime = app.api.toDate(createDate);
          var userDate = (pullOutDate-createDate)/1000;
          var time = app.api.getTime(userDate);
          var flag = list.successFlag;
          // console.log(list.successFlag)
          that.setData({
            pullOutDate: modifyTime,
            createDate: createTime,
            userTime: time,
            shellId: shellId,
            czId: czId,
            name:name,
            amount: amount,
            flag: flag
          })
          
        }else{
          app.api.layer(res.msg)
        }
      })
    }
  }
  
})