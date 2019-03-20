//index.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    hidden: true,
    industryArray: [],
    industry: 0,
    regionArrindex:0,
    region: [],
    sort: "saw",
    searchValue: '',
    cateid: ''
  },
  onLoad(options) {
    // if (app.globalData.state == 0) {
    //   wx.navigateTo({
    //     url: '../toLogin/toLogin',
    //   })
    // }
    this.setData({
      token: app.globalData.token
    })
    this.initData();
    this.init();
    util.uploadFormIds();
    this.scene(options);//二维码扫描进入
  },
  initData(){
    this.setData({
      onBottom: true,
      page: 1,
      cards: []
    })
  },
  onShow() {
    let is_join = wx.getStorageSync('is_join');
    this.setData({
      is_join: is_join
    })
  },
  scene(op) {
    let scene = '';
    if (op.scene) {
      scene = decodeURIComponent(op.scene);
      if (app.globalData.state == 0) {
        wx.navigateTo({
          url: '../toLogin/toLogin?scene=1&id=' + op.scene
        })
      } else {
        wx.navigateTo({
          url: '../toDetails/toDetails?id=' + scene,
        })
      }
    }
  },
  init() {
    util.http('Category/index', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          industryArray: res.data
        })
      }
    })
    this.cards(1)
  },
  cards(page) {
    let token = app.globalData.token;
    let list = this.data.cards;
    let name = this.data.searchValue;
    let cateid = this.data.cateid;
    // let town = this.data.town;
    let search_json = {
      name: name,
      cateid: cateid,
      town: ''
    }
    search_json = JSON.stringify(search_json)
    let json = {
      search_json: search_json,
      page_size:10,
      page_current:page,
      sort: this.data.sort
    }
    if(app.globalData.token == '')return
    util.http('Membercard/index', json, 'post', token).then(res => {
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
  onReachBottom: function () {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.cards(this.data.page);
    }
  },
  bindfocus() {
    if (this.data.hidden) {
      this.setData({
        hidden: !this.data.hidden
      })
    }
  },
  bindconfirm(e) {
    this.initData();
    this.cards(1);
  },
  searchValue(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  s_cancel(e) {
    if (!this.data.hidden) {
      this.setData({
        hidden: !this.data.hidden,
        searchValue:''
      })
      this.initData();
      this.cards(1);
      let formId = e.detail.formId;
      util.collectFormIds(formId);
    }
  },
  bindIndustryChange(e) {
    let index = e.detail.value;
    let industryArray = this.data.industryArray;
    let cateid = industryArray[index].id
    this.setData({
      industry: e.detail.value,
      cateid: cateid
    })
    this.initData();
    this.cards(1);
  },
  bindRegionChange(e) {
    let index = e.detail.value;
    let regionArr = this.data.regionArr;
    let town = regionArr[index].name
    this.setData({
      regionArrindex: e.detail.value,
      town: town
    })
    this.initData();
    this.cards(1);
  },
  bindcancel() {
    this.setData({
      region: ''
    })
    this.initData();
    this.cards(1);
  },
  bindReorderChange(e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['按人气', '按收藏'],
      success: function (res) {
        let sort = ""
        if (res.tapIndex==0){
          sort = "saw"
        } else {
          sort = "collect"
        }
        that.setData({
          sort: sort
        })
        that.initData();
        that.cards(1);
        let formId = e.detail.formId;
        util.collectFormIds(formId);
      }
    })
  }, 
  toDetails(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../toDetails/toDetails?id=' + id
    })
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    util.uploadFormIds();
  },
  promoteText(){
    if (app.globalData.state == 1) {
      wx.navigateTo({
        url: '../promotionCards/promotionCards',
      })
    } else {
      wx.navigateTo({
        url: '../toLogin/toLogin',
      })
    }
  },
  toLogin(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    wx.navigateTo({
      url: '../toLogin/toLogin',
    })
  },
  onShareAppMessage() {
    return {
      title: '为你解决多有销售问题！',
      path: '/pages/index/index'
    }
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.initData();
    this.init()
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.initData();
    this.init();
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }
})