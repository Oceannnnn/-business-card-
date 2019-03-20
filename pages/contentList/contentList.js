// pages/contentList/contentList.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    page: 1,
    onBottom: true,
    facilities:[]
  },
  onLoad(op) {
    this.setData({
      id: op.id
    })
    wx.setNavigationBarTitle({
      title:op.title
    })
    this.facilities(1)
  },
  facilities(page) {
    let token = app.globalData.token;
    let list = this.data.facilities;
    util.http('Article/index', { page_size: 10, page_current: page, cate_id:this.data.id}, 'post', token).then(res => {
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
  toCall(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  }, 
  toContentDetails(e) {
    let id = e.currentTarget.dataset.id;
    let cate_id = e.currentTarget.dataset.cate_id;
    wx.navigateTo({
      url: '../contentDetails/contentDetails?id=' + id + '&cate_id=' + cate_id,
    })
  }
})