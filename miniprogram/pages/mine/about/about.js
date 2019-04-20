//about.js
//获取应用实例
var app = getApp()
Page({
  data: {
    logosrc: '../../../images/logo.png',
    adrimg: '../../../images/icon-address.png',
    clockimg: '../../../images/icon-clock.png',
    phoneimg: '../../../images/icon-phone.png',
    jtimg: '../../../images/icon-jt.png',
    picimg: '../../../images/icon-pic.png',
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '13115412392',
    })
  },
  getLocation: function () {
    wx.openLocation({
      latitude: 45.73694610595703,
      longitude: 126.72388458251953,
      name: "东北农业大学",
      address: "哈尔滨市长江路600号",
      scale: 28
    })
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})