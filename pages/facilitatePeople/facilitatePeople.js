// pages/facilitatePeople/facilitatePeople.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    page: 1,
    onBottom: true,
    imgUrls:[],
    facilities: [],
    login_state: app.globalData.state
  },
  onLoad() {
    // if (app.globalData.state == 0) {
    //   wx.navigateTo({
    //     url: '../toLogin/toLogin',
    //   })
    // }
    this.init();
  },
  init(){
    util.http('Gener/index', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          gener: res.data
        })
      }
    })
    util.http('Swiper/index', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          imgUrls: res.data
        })
      }
    })
    let token = app.globalData.token
    util.http('Article/getTotal', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          count: res.data.count,
          sum: res.data.sum
        })
      }
    })
    this.facilities(1)
  },
  facilities(page) {
    let list = this.data.facilities;
    util.http('Config/getArticle', { page_size: 10, page_current: page, cate_id: "" }, 'post').then(res => {
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
  tocategory(e) {
    if (app.globalData.state == 0) {
      wx.showModal({
        content: '为了更好的体验，请您先登录！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../toLogin/toLogin',
            })
          }
        }
      })
    } else {
      let type = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: '../category/category?type=' + type,
      })
    }
  },
  toContent(e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../contentList/contentList?id=' + id + '&title=' + title,
    })
  },
  toContentDetails(e) {
    let id = e.currentTarget.dataset.id;
    let cate_id = e.currentTarget.dataset.cate_id;
    wx.navigateTo({
      url: '../contentDetails/contentDetails?id=' + id + '&cate_id=' + cate_id,
    })
  },
  onShareAppMessage() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let url = "/" + currentPage.route;
    return {
      title: '乡亲们都在这，你在哪里？',
      path: url
    }
  },
})