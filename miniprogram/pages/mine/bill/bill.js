// pages/mine/bill/bill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oppid:'',
    count_staticassets:'',
    count_totalassets:'',
    value:'',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          oppid: res.result.openid
        })
        console.log(this.data.oppid)
        const db = wx.cloud.database({});
        const count = db.collection('count');
        count.where({ _openid: this.data.oppid }).get({
          success: (res) => {
            // this.data.value = res.data[0].integral_value;
            this.setData({
              count_staticassets: res.data[0].count_staticassets,
              count_totalassets: res.data[0].count_totalassets,
              id: res.data[0]._id
            })
            console.log(this.data)
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    });
    wx.cloud.callFunction({
      // 云函数名称
      name: 'time',
      // 传给云函数的参数
      data: {

      },
    }).then(res => {
      this.data.time = JSON.parse(res.result).data.t
      console.log(this.data.time)
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showDialogBtn: function () {
    // console.log(this.data.tag)
      this.setData({
        showModal: true
      })
  },
  inputChange: function (e) {
    this.setData({
      value:e.detail.value
    })
    console.log(this.data.value)
  },
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 2000
    })
    const db = wx.cloud.database({});
    const count = db.collection('count');
    count.doc(this.data.id).update({
      data: {
        count_staticassets:this.data.value,
        count_totalassets: this.data.value
      },
      success:(res)=>{
        const db = wx.cloud.database({});
        const count = db.collection('count');
        count.where({ _openid: this.data.oppid }).get({
          success: (res) => {
            // this.data.value = res.data[0].integral_value;
            this.setData({
              count_staticassets: res.data[0].count_staticassets,
              count_totalassets: res.data[0].count_totalassets,
              id: res.data[0]._id
            })
            console.log(this.data)
          }
        })
      }
    })
    this.hideModal();
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
  }
})