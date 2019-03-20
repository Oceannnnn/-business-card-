// pages/contentDetails/contentDetails.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    facilities: [],
    page: 1,
    onBottom: true,
  },
  onLoad(op) {
    this.setData({
      cate_id: op.cate_id,
      detail_id: op.id
    })
    let token = app.globalData.token;
    util.http('article/detail', {id:op.id}, 'post',token).then(res => {
      if (res.code == 200) {
        this.setData({
          info: res.data
        })
        wx.setNavigationBarTitle({
          title: res.data.cate_name + "-便民发布"
        })
      }
    })
    this.facilities(1)
  },
  toCall(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  facilities(page) {
    let token = app.globalData.token;
    let list = this.data.facilities;
    util.http('Article/index', { page_size: 10, page_current: page, cate_id: this.data.cate_id, detail_id: this.data.detail_id}, 'post', token).then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          facilities: list
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
      }
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.facilities(this.data.page);
    }
  },
})