// pages/cardOrganizer/cardOrganizer.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    hidden:true,
    cards:[],
    searchValue:'',
    page:1,
    onBottom:true
  },
  onLoad() {
    this.init();
    util.uploadFormIds();
  },
  onShow() {
    this.setData({
      cards: [],
      page: 1,
      onBottom: true
    })
    this.cards(1, '')
  },
  init(){
    this.setData({
      state: app.globalData.state
    })
    if (app.globalData.state==1){
      this.cards(1,'')
    }
  },
  cards(page, keyword){
    let token = app.globalData.token;
    let list = this.data.cards;
    if (token=='')return
    util.http('My/getMyCollect', { page_size: 10, page_current: page, keyword: keyword }, 'post', token).then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          cards: list
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
      this.cards(this.data.page, this.data.searchValue);
    }
  },
  bindfocus() {
    if (this.data.hidden) {
      this.setData({
        hidden: !this.data.hidden
      })
    }
  },
  bindconfirm(e){
    this.setData({
      cards: [],
      page: 1,
      onBottom: true
    })
    this.cards(1, e.detail.value)
  },
  searchValue(e){
    this.setData({
      searchValue: e.detail.value
    })
    if (e.detail.value == '') {
      this.setData({
        cards: [],
        page: 1,
        onBottom: true
      })
      this.cards(1, '')
    }
  },
  s_cancel(e) {
    if (!this.data.hidden){
      this.setData({
        hidden: !this.data.hidden,
        searchValue: ''
      })
      this.cards(1, '');
      let formId = e.detail.formId;
      util.collectFormIds(formId);
    }
  },
  toDetails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../toDetails/toDetails?id='+id
    })
    let formId = e.detail.formId;
    util.collectFormIds(formId)
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.init()
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }
})