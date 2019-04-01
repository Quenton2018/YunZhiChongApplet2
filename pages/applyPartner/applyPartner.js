const app = getApp()


Page({
  data: {
    index: 0,
    region: ['', '', '请选择地址'],
    customItem: '',
    minDisable:false,
    maxDisable:false,
    numbers:0,
    contacts:"",
    mobile:""
  },
  onLoad: function () {
    // 默认安装数量为0；－按钮不能点击
    this.setData({
      minDisable:true
    })
  },
  // 监听城市默认值
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  // 监听改变城市
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  // 安装数量点击按钮：减少
  sub:function(){
    var that = this;
    var numbers = this.data.numbers;
    // 如果安装数量为0；不能点击
    if (numbers==0){
      that.setData({
        minDisable:true
      })
    }else{
      numbers--;
      that.setData({
        numbers: numbers,
        maxDisable: false
      })
      if (numbers == 0){
        that.setData({
          minDisable: true,
          maxDisable: false
        })
      }
    }
  },
  // 安装数量点击按钮：增加
  add: function () {
    var that = this;
    var numbers = this.data.numbers;
    // 安装数量太大时布局样式不好看，所以使之不能超过四位数
    if (numbers >= 3000) {
      that.setData({
        maxDisable: true,
        minDisable: false,
        numbers :3000
      })
      app.api.layer("数量大于3000台，请到公司申请")
    } else {
      numbers++;
      that.setData({
        numbers: numbers,
        minDisable:false
      })
      if (numbers >= 3000) {
        that.setData({
          maxDisable: true,
          minDisable:false
        })
      }
    }
  },
  // 安装数量手动输入：监听非负，必须为数字；不能为空
  installs:function(e){
    var that = this;
    var numbers = this.data.numbers;
    var value = e.detail.value;
    if (value<0){
      value = 0;
      that.setData({
        minDisable: true,
        numbers: value
      })
    }
    if (value == "" || value==null){
      value = 0;
      that.setData({
        numbers: value
      })
    }
    if (value!=0){
      value = parseInt(value)
      that.setData({
        numbers: value
      })
    }
    this.setData({
      numbers: value
    })
  },
  // 监听输入姓名
  clickName:function(e){
    this.setData({
      contacts: e.detail.value
    })
  },
  // 监听输入电话
  clickTel: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  // 提交申请
  present:function(){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    var contacts = this.data.contacts;
    var mobile = this.data.mobile;
    var numbers = this.data.numbers;
    var installAddress = this.data.region;
    if (!app.api.vaildeParam(contacts)) {
      app.api.layer("联系人不能为空");
      return;
    }
    if (!app.api.vaildeParam(mobile)) {
      app.api.layer("联系电话不能为空");
      return;
    }
    var myreg = /^[1][0-9]{10}$/;
    if (!myreg.test(mobile)) {
      app.api.layer("联系电话格式不正确");
      return;
    }
    if (!app.api.vaildeParam(numbers) || numbers == '0') {
      app.api.layer("预估安装数量不能为空");
      return;
    }
    if (!app.api.vaildeParam(installAddress)) {
      app.api.layer("申请发展地区不能为空");
      return;
    }
    if (installAddress[2] == "请选择地址") {
      app.api.layer("申请发展地区不能为空");
      return;
    }
    var params = {
      "uuid": uuid,
      "contacts": contacts,
      "mobile": mobile,
      "numbers": numbers,
      "installAddress": installAddress
    }
    app.api.showBusy()
    app.api.postJSON("/api/applyChargingPile/saveapplyChargingPile", params, function (res) {
      if ("0" == res.code) {
        app.api.hideBusy()
        app.api.layer("合作申请已提交，请保持您的手机畅通");
        setTimeout(function () {
          wx.redirectTo({
            url: '../applyCooperate/applyCooperate',
          })
        },2000)
      }else{
        app.api.layer(res.msg)
      }
    })
  }
})