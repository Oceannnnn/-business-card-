// pages/makingCards/makingCards.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {},
  onLoad() {
    let token = app.globalData.token;
    this.init(token);
    util.uploadFormIds();
  },
  init(token) {
    util.http('Pay/makeMoney', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          money: res.data
        })
      }
    })
  },
  pay(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId)
    let token = app.globalData.token;
    this.setData({
      disabled: true
    })
    var that = this;
    util.http('Pay/payOrder', { card_id: "", type: 1 }, 'post', token).then(res => {
      if (res.code == 200) {
        let trade_no = res.data.trade_no;
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            wx.setStorageSync("makeTrade", trade_no);
            that.setData({
              disabled: false
            })
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000,
              success: function () {
                wx.navigateTo({
                  url: '../personalData/personalData'
                })
              }
            })
          },
          'fail': function (res) {
            util.http('Pay/cancalOrder', { trade_no: trade_no }, 'post', token).then(res => {})
            that.setData({
              disabled: false
            })
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    })
  },
  onHide(){
    wx.removeStorageSync("makeTrade")
  }
})