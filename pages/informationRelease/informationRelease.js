// pages/informationRelease/informationRelease.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    disabled:false
  },
  onLoad(op) {
    this.setData({
      id: op.id
    })
    let token = app.globalData.token;
    util.http('Article/publishMoney', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          charge: res.data
        })
      }
    })
  },
  bindTitle(e){
    this.setData({
      title: e.detail.value
    })
  },
  bindContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  bindName(e) {
    this.setData({
      contact: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  comfirm() {
    this.setData({
      disabled: true
    })
    let title = this.data.title;
    let content = this.data.content;
    let contact = this.data.contact;
    let phone = this.data.phone;
    let id = this.data.id;
    let charge = this.data.charge;
    if (!title) {
      wx.showToast({
        title: '请输入题目',
        image: '../../images/warn.png'
      })
      return 
    } else if (!content) {
      wx.showToast({
        title: '请输入内容',
        image: '../../images/warn.png'
      })
      return 
    } else if (!contact) {
      wx.showToast({
        title: '请输入联系人',
        image: '../../images/warn.png'
      })
      return 
    } else if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        image: '../../images/warn.png'
      })
      return
    } else {
      if (!util.toCheck(phone)) {
        wx.showToast({
          title: '手机号格式错误',
          image: '../../images/warn.png'
        })
        return
      }
    }
    let info = {
      title: title,
      content: content,
      contact: contact,
      phone: phone,
      cate_id:id
    }
    let that = this;
    let token = app.globalData.token;
    info = JSON.stringify(info);
    util.http('Article/publish', { data: info}, 'post', token).then(res => {
      if (res.code == 200) {
        if (charge) {
          util.http('Article/pay', {}, 'get', token).then(res => {
            if (res.code == 200) {
              wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': res.data.signType,
                'paySign': res.data.paySign,
                'success': function (res) {
                  that.setData({
                    disabled: false
                  })
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 1000,
                    success: function () {
                      setTimeout(() => {
                        wx.reLaunch({
                          url: '../facilitatePeople/facilitatePeople',
                        })
                      }, 1000)
                    }
                  })
                },
                'fail': function (res) {
                  that.setData({
                    disabled: false
                  })
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none',
                    duration: 1000
                  })
                }
              })
            }
          })
          return
        }
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '../facilitatePeople/facilitatePeople',
          })
        },1000)
      }
    })
  }
})