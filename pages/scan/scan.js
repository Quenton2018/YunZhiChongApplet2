const app = getApp()

Page({
  data: {
    isIpx: app.globalData.isIpx
  },
  onLoad:function(){
    
  },
  scancode:function(){
    wx.scanCode({
      success:function(res){
        console.log(res.result);
        app.api.postJSON("/api/charging/infoByShellId", { 'shellId': res.result }, function (res) {
          if ('0' == res.code) {
            console.log(res)
            var zCode = res.data.code;
            var areaSn = res.data.groupId.sn;
            var area = res.data.groupId.name;
            console.log(areaSn, area, zCode)
            app.api.layer("扫码成功，即将跳转")
            setTimeout(function () {            
              wx.reLaunch({
                url: "../charge/charge?areaSn=" + areaSn + "&area=" + area + "&zCode=" + zCode
              })
            },2000)
            
          }else{
            setTimeout(function(){
              wx.navigateTo({
                url: '../selectChargeSearch/selectChargeSearch'
              })
            },2000)
            app.api.layer("暂无充电桩,请手动搜索，或返回继续扫码")
          }
        })
      }
    })
  }
})