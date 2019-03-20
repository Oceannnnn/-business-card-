// pages/MyCard/MyCard.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    saw: 0,
    hidden: true,
    isShare: 0,
    info: '',
    imgUrls: []
  },
  onLoad(options) {
    this.myCardList();
    this.getCompanyConfig();
  },
  onShow() {
    this.setData({
      login_state: app.globalData.state
    })
    let modifyPhone = this.data.modifyPhone;
    if (modifyPhone == 1) {
      this.setData({
        imgUrls: [],
        modifyPhone: 0
      })
      this.myCardList();
    }
  },
  myCardList() {
    if (app.globalData.token == '') return
    let token = app.globalData.token;
    util.http('Member/myCardList', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          imgUrls: res.data,
          id: res.data[0].id
        })
        this.init(res.data[0].id)
      } else if (res.code == -1) {
        util.afreshLogin()
      }
    })
  },
  bindchange(e) {
    let imgUrls = this.data.imgUrls;
    let current = e.detail.current;
    let id = imgUrls[current].id;
    this.setData({
      id: id
    })
    this.init(id)
  },
  init(id) {
    this.getCardInfo(id);
    let token = app.globalData.token;
    util.http("Membercard/detail", {
      id: id
    }, 'post', token).then(res => {
      if (res.code == 200) {
        let is_self = res.data.is_self;
        let is_collectd = res.data.is_collectd;
        this.setData({
          is_collectd: res.data.is_collectd,
          cate_name: res.data.cate_name,
          lead: res.data.lead,
          head: res.data.head,
          collect: res.data.collect,
          company: res.data.company,
          saw: res.data.saw,
          name: res.data.name,
          is_public: res.data.is_public,
          is_self: is_self,
          address: res.data.address,
          phone: res.data.phone,
          latitude: res.data.lat,
          longitude: res.data.lng,
          is_join: res.data.is_join
        })
        if (this.data.isShare == 1 && !is_collectd && !is_self) {
          this.collect()
        }
        if (res.data.is_self) {
          this.setData({
            isPersonal: 1
          })
        }
        var query = wx.createSelectorQuery();
        //选择id
        var that = this;
        query.select('.details_info').boundingClientRect(function(rect) {
          that.setData({
            height: rect.height + 14 + 'px'
          })
        }).exec();
      }
    })
  },
  getCardInfo(id) {
    let token = app.globalData.token;
    util.http('Membercard/setCardInfo', {
      card_id: id,
      type: 1
    }, 'post', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        if (info == "") {
          this.setData({
            info: info,
            hidden: false,
            myTitle: "",
            myQQ: "",
            myWechat: "",
            myMotto: "",
            myAutograph: "",
            myContent: ""
          })
        } else {
          this.setData({
            hidden: true,
            info: info,
            myTitle: info.title,
            myQQ: info.qq,
            myWechat: info.wechat,
            myMotto: info.motto,
            myAutograph: info.autograph,
            myContent: info.content
          })
        }
      }
    })
    util.http('Membercard/getCardImage', {
      card_id: id
    }, 'post', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        this.setData({
          imagesList: info
        })
      }
    })
  },
  openChange(e) {
    let value = e.detail.value;
    let token = app.globalData.token;
    let id = this.data.id;
    let status = 1;
    if (!value) {
      status = 2;
    }
    util.http("Membercard/setPublic", {
      id: id,
      status: status
    }, 'post', token).then(res => {})
  },
  edit(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let id = this.data.id;
    let that = this;
    wx.showActionSheet({
      itemList: ['基本资料', '更多资料', "上传图片", "名片背景", "再建一张名片", "删除此名片"],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../personalData/personalData?type=1&id=' + id
          })
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '../moreData/moreData?id=' + id
          })
        } else if (res.tapIndex == 2) {
          wx.navigateTo({
            url: '../morePhoto/morePhoto?id=' + id
          })
        } else if (res.tapIndex == 4) {
          that.makingCards()
        } else if (res.tapIndex == 5) {
          that.deleteCard()
        }
      }
    })
  },
  deleteCard() {
    if (app.globalData.token == '') return
    let token = app.globalData.token;
    util.http('Membercard/deleteCard', {
      card_id: this.data.id
    }, 'post', token).then(res => {
      if (res.code == 200) {
        this.setData({
          imgUrls: []
        })
        this.myCardList();
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 500
        })
      } else if (res.code == -1) {
        util.afreshLogin()
      }
    })
  },
  sawMore() {
    this.setData({
      hidden: !this.data.hidden
    })
  },
  makingCards(e) {
    if (app.globalData.token == '') return
    let token = app.globalData.token;
    util.http('Card/isNeedMoney', {}, 'get', token).then(res => {
      if (res.code == 200) {
        if (res.data) {
          wx.navigateTo({
            url: '../makingCards/makingCards'
          })
        } else {
          wx.navigateTo({
            url: '../personalData/personalData'
          })
        }
      } else if (res.code == -1) {
        util.afreshLogin()
      }
    })
  },
  headImage() {
    wx.navigateTo({
      url: '../headImage/headImage?id=' + this.data.id
    })
  },
  setClipboardData(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let txt = e.currentTarget.dataset.txt;
    if (txt != '') {
      wx.setClipboardData({
        data: txt,
        success: function(res) {
          wx.getClipboardData({
            success: function(res) {}
          })
        }
      })
    } else {
      wx.showToast({
        title: '无内容复制',
        icon: 'none'
      })
    }
  },
  toLocation(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let latitude = Number(this.data.latitude);
    let longitude = Number(this.data.longitude);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: this.data.address,
      scale: 15
    })
  },
  toCall(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
    let formId = e.detail.formId;
    util.collectFormIds(formId)
  },
  toQRCode() {
    wx.navigateTo({
      url: '../toLogin/toLogin?id=' + this.data.id
    })
  },
  getCompanyConfig() {
    if (app.globalData.token == '') return
    util.http('Config/getCompanyConfig', {}, 'get').then(res => {
      if (res.code == 200) {
        let info = res.data;
        app.globalData.address = info.address;
        app.globalData.latitude = info.latitude;
        app.globalData.longitude = info.longitude;
        app.globalData.domain = info.domain;
        app.globalData.name = info.name;
        app.globalData.phone = info.phone;
        app.globalData.image = info.image;
        app.globalData.is_money = info.is_money
      }
    })
  },
  getUserInfo(e) {
    let that = this;
    wx.login({
      success: function(msg) {
        var codeText = msg.code;
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: msg => {
                  var encryptedData = msg.encryptedData;
                  var iv = msg.iv;
                  util.http('Login/login', {
                    code: codeText,
                    encryptedData: encryptedData,
                    iv: iv
                  }, 'post').then(data => {
                    if (data.code == 200) {
                      app.globalData.userInfo = e.detail.userInfo;
                      app.globalData.state = 1;
                      app.globalData.token = data.data.token;
                      app.globalData.card_num = data.data.card_num;
                      app.globalData.headimg = data.data.headimg;
                      app.globalData.nick_name = data.data.nick_name;
                      app.globalData.identify_flag = data.data.identify_flag;
                      wx.setStorage({
                        key: "httpClient",
                        data: {
                          userInfo: e.detail.userInfo,
                          state: 1,
                          token: data.data.token
                        }
                      })
                      wx.setStorage({
                        key: "headimg",
                        data: data.data.headimg
                      })
                      wx.setStorage({
                        key: "nick_name",
                        data: data.data.nick_name
                      })
                      wx.setStorage({
                        key: "card_num",
                        data: data.data.card_num
                      })
                      wx.setStorage({
                        key: "identify",
                        data: data.data.identify_flag
                      })
                      wx.setStorage({
                        key: "is_join",
                        data: data.data.is_join
                      })
                      that.makingCards();
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  },
  onShareAppMessage(ops) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let url = '';
    let id = this.data.id;
    if (ops.from === 'button') {}
    return {
      title: '我的名片，请惠存',
      path: url + "?id=" + id + "&isShare=1"
    }
  }
})