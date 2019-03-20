// pages/my/my.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    state: 0
  },
  onLoad: function () {
  },
  onShow(){
    this.init()
  },
  init() {
    this.setData({
      state: app.globalData.state,
      is_money: app.globalData.is_money
    })
    if (app.globalData.state == 1){
      this.setData({
        card_num: app.globalData.card_num,
        headimg: app.globalData.headimg,
        nick_name: app.globalData.nick_name,
        identify_flag: app.globalData.identify_flag
      })
    }
    let that = this;
    wx.createSelectorQuery().selectAll('.avatar').boundingClientRect(function (rect) {
      that.setData({
        height: rect[0].height,
        width: rect[0].width
      })
    }).exec();
  },
  promotionCards(e) {//推广名片
    if (this.data.state == 1) {
      if (this.data.identify_flag){
        wx.navigateTo({
          url: '../myCards/myCards?promotionCards',
        })
      }else{
        wx.showModal({
          confirmText: '确认',
          content: '为了使您更好的体验，请先实名认证！',
          confirmColor: '#165ABB',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../certification/certification',
              })
            }
          }
        })
      }
    } else {
      this.toLogin()
    }
    let formId = e.detail.formId;
    util.collectFormIds(formId);
  },
  myCards(e) {//我的名片
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../myCards/myCards',
      })
    } else {
      this.toLogin()
    }
    let formId = e.detail.formId;
    util.collectFormIds(formId);
  },
  makingCards(e) {//制作名片
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../makingCards/makingCards',
      })
    } else {
      this.toLogin()
    }
    let formId = e.detail.formId;
    util.collectFormIds(formId);
  },
  certification() {//实名认证
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../certification/certification',
      })
    } else {
      this.toLogin()
    }
  },
  about(e) {
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../about/about',
      })
    } else {
      this.toLogin()
    }
    let formId = e.detail.formId;
    util.collectFormIds(formId);
  },
  toLogin() {
    wx.navigateTo({
      url: '../toLogin/toLogin',
    })
  },
  bindsubmitLogin(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
  },
  onShareAppMessage(ops) {
    if (ops.from === 'button') { }
    return {
      title: '为你解决多有销售问题！',
      path: "/pages/index/index"
    }
  }
})