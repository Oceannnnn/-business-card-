// pages/certification/certification.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    disabled: false,
    autherName: '',
    IDcard: '',
    srcUp: '',
    srcDown: ''
  },
  onLoad: function (options) { },
  IDcard(e) {
    this.setData({
      IDcard: e.detail.value
    })
  },
  autherName(e) {
    this.setData({
      autherName: e.detail.value
    })
  },
  aCardConfirm(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId)
    this.setData({
      disabled: true
    })
    let autherName = this.data.autherName;
    let IDcard = this.data.IDcard;
    let srcUp = this.data.srcUp;
    let srcDown = this.data.srcDown;
    if (srcUp != '' && srcDown != '') {
      let that = this;
      wx.uploadFile({
        url: util.url + 'Member/uploadIdentity',
        filePath: srcUp,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data',
          token: app.globalData.token
        },
        success: function (res) {
          let data = res.data;
          data = JSON.parse(data)
          if (data.code == 200) {
            that.setData({
              disabled: false
            })
            app.globalData.identify_flag = true;
            wx.setStorageSync('identify', true)
            wx.showToast({
              title: '认证成功',
              icon:'success',
              success: function () {
                wx.navigateBack()
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '认证失败，请重新上传照片',
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    srcUp: '',
                    srcDown: ''
                  })
                } else if (res.cancel) {
                  that.setData({
                    srcUp: '',
                    srcDown: ''
                  })
                }
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请确保图片已上传',
        icon: 'none',
        duration: 1000
      })
    }
  },
  addUpCard() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        that.setData({
          srcUp: tempFilePaths[0]
        })
      }
    })
  },
  addDownCard() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        that.setData({
          srcDown: tempFilePaths[0]
        })
      }
    })
  }
})