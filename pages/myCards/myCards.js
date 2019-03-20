// pages/myCards/myCards.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    myCardList:[],
    page: 1,
    onBottom: true
  },
  onLoad(op) {
    if (op.promotionCards){
      this.setData({
        promotionCards:true
      })
    }
    this.myCardList(1)
    util.uploadFormIds();
  },
  myCardList(page) {
    let token = app.globalData.token;
    let list = this.data.myCardList;
    util.http('Member/myCardList', { page_size: 10, page_current: page }, 'post', token).then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          myCardList: list
        })
      } else if (res.code == 0) {
        if (page > 1) {
          wx.showToast({
            title: '没有数据啦！',
            icon: 'none',
            duration: 2000
          })
          this.data.onBottom = false;
        }
      } else if (res.code == -1) {
        util.afreshLogin()
      }
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.myCardList(this.data.page);
    }
  },
  toDetails(e) {
    let id = e.currentTarget.dataset.id;
    if (this.data.promotionCards) {
      wx.navigateTo({
        url: '../promotionCards/promotionCards?id=' + id,
      })
    }else{
      wx.navigateTo({
        url: '../toDetails/toDetails?id=' + id,
      })
    }
  }
})