// pages/toLogin/toLogin.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    share:0,
    scene:0
  },
  onLoad(op) {
    if (op.share) {
      this.setData({
        share: op.share,
        id:op.id
      })
    }
    if (op.scene) {
      this.setData({
        scene: op.scene,
        id: op.id
      })
    }
  },
  cancel() {
    if (this.data.share == 0) {
      wx.navigateBack()
    } else {
      wx.reLaunch({
        url: '../index/index'
      })
    }
  },
  getUserInfo(e) {
    let that = this;
    wx.login({
      success: function (msg) {
        var codeText = msg.code;
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: msg => {
                  var encryptedData = msg.encryptedData;
                  var iv = msg.iv;
                  util.http('Login/login', { code: codeText, encryptedData: encryptedData, iv: iv }, 'post').then(data => {
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
                          userInfo:e.detail.userInfo,
                          state :1,
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
                      wx.showToast({
                        title: '登陆成功',
                        icon:"success",
                        duration:1000
                      })
                      let pages = getCurrentPages()
                      let prevPage = pages[pages.length - 2]  //上一个页面
                      setTimeout(() => {
                        if (that.data.share == 0) {
                          wx.reLaunch({
                            url: '../MyCard/MyCard'
                          })
                        } else if (that.data.share == 1) {
                          wx.navigateBack()
                          prevPage.collect()
                          prevPage.init(that.data.id)
                          prevPage.setData({
                            state:1
                          })
                        } else if (that.data.scene == 1) {
                          wx.navigateTo({
                            url: '../toDetails/toDetails?id=' + that.data.id,
                          })
                        }
                      }, 500)
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  }
})