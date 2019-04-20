// pages/bookkeeping/bookkeeping.js
var util = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oppid:'',
    time:'',
    year:'',
    mon:'',
    day:'',
    timearray: ['支出','收入'],
    type:'',
    src:'',
    list:[],
    value:'',
    zhichu:'',
    shouru:''
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
            // console.log(this.data.value)
            if (JSON.stringify(res.data) == '[]') {
              count.add({
                data: {
                  count_totalassets:'0',
                  count_staticassets:'0'
                }
              })
            }else{
              this.data.value = res.data[0].count_totalassets;
            }
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
      this.setData({
        year: util.year(this.data.time),
        mon: util.mon(this.data.time),
        day: util.day(this.data.time)
      })
      const db = wx.cloud.database({});
      console.log(this.data.mon)
      const bill = db.collection('bill');
      bill.where({
        _openid: this.data.oppid,
        count_mon: this.data.mon,
        count_day: this.data.day,
        count_year: this.data.year
      }).get({
        success: (res) => {
          this.setData({
            list: res.data
          })
          console.log(this.data.list)
        }
      })
      // const db = wx.cloud.database({});
      const mon = db.collection('mon');
      mon.where({
        _openid: this.data.oppid,
        mon: this.data.mon
      }).get({
        success: (res) => {
          console.log(res.data)
          if (JSON.stringify(res.data) == '[]') {
            mon.add({
              data: {
                mon: this.data.mon,
                mon_zhichu: '0',
                mon_shouru: '0'
              }
            })
          }else{
            this.setData({
              zhichu:res.data[0].mon_zhichu,
              shouru:res.data[0].mon_shouru
            })
            this.data.mid = res.data[0]._id
            console.log(this.data)
          }
        }
      })
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
    const db = wx.cloud.database({});
    console.log(this.data.mon)
    const bill = db.collection('bill');
    bill.where({
      _openid: this.data.oppid,
      count_mon: this.data.mon,
      count_day: this.data.day,
      count_year: this.data.year
    }).get({
      success: (res) => {
        this.setData({
          list: res.data
        })
        console.log(this.data.list)
      }
    })
    // const db = wx.cloud.database({});
    const count = db.collection('count');
    count.where({ _openid: this.data.oppid }).get({
      success: (res) => {
        // console.log(this.data.value)
        if (JSON.stringify(res.data) == '[]') {
          count.add({
            data: {
              count_totalassets: '0',
              count_staticassets: '0'
            }
          })
        } else {
          this.data.value = res.data[0].count_totalassets;
        }
      }
    })
    const mon = db.collection('mon');
    mon.where({
      _openid: this.data.oppid,
      mon: this.data.mon
    }).get({
      success: (res) => {
        console.log(res.data)
        if (JSON.stringify(res.data) == '[]') {
          mon.add({
            data: {
              mon: this.data.mon,
              mon_zhichu: '0',
              mon_shouru: '0'
            }
          })
        } else {
          this.setData({
            zhichu: res.data[0].mon_zhichu,
            shouru: res.data[0].mon_shouru
          })
          this.data.mid = res.data[0]._id
          console.log(this.data)
        }
      }
    })
    wx.stopPullDownRefresh()
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
    this.add = e.detail.value
    console.log(this.add)
  },
  inputChange2: function (e) {
    this.add2 = e.detail.value
    console.log(this.add2)
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
    if(this.data.type==='支出'){
      this.add='-'+this.add
      this.data.src ='../../images/zhichu.png'
      const db = wx.cloud.database({});
      const count = db.collection('count');
      count.doc(this.data.id).update({
        data: {
          count_totalassets: this.data.value*1 + this.add*1
          }})
      const mon = db.collection('mon');
      mon.doc(this.data.mid).update({
        data:{
          mon_zhichu:this.data.zhichu*1 - this.add*1
        }
      })
    }else{
      this.data.src = '../../images/shouru.png'
      const db = wx.cloud.database({});
      const count = db.collection('count');
      count.doc(this.data.id).update({
        data: {
          count_totalassets: this.data.value*1 + this.add*1
        }
      })
      const mon = db.collection('mon');
      mon.doc(this.data.mid).update({
        data: {
          mon_shouru: this.data.shouru * 1 + this.add * 1
        }
      })
    }
    /* console.log(this.add)
    console.log(this.data.mon) */
    const db = wx.cloud.database({});
    const bill = db.collection('bill');
    bill.add({
      data:{
        count_value:this.add,
        count_year:this.data.year,
        count_mon: this.data.mon,
        count_day: this.data.day,
        count_src:this.data.src,
        count_detail:this.add2
      }
    })
    this.hideModal();
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  bindtime: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeindex: e.detail.value,
    })
    console.log(this.data.timeindex)
    if(this.data.timeindex==0){
      this.setData({
        type:'支出'
      })
    }else{
      this.setData({
        type: '收入'
      })
    }
  }
})