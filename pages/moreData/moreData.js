// pages/moreData/moreData.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    myTitle: "",
    myQQ: "",
    myWechat: "",
    myMotto: "",
    myAutograph: "",
    myContent: ""
  },
  onLoad(op) {
    this.setData({
      id: op.id,
    })
    this.init(op.id)
    util.uploadFormIds();
  },
  init(id) {
    let token = app.globalData.token;
    util.http('Membercard/setCardInfo', {
      card_id: id,
      type: 1
    }, 'post', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        if (info) {
          this.setData({
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
  },
  myWechat(e) {
    let value = e.detail.value;
    this.setData({
      myWechat: value
    })
  },
  myAutograph(e) {
    let value = e.detail.value;
    this.setData({
      myAutograph: value
    })
  },
  myQQ(e) {
    let value = e.detail.value;
    this.setData({
      myQQ: value
    })
  },
  myMotto(e) {
    let value = e.detail.value;
    this.setData({
      myMotto: value
    })
  },
  myTitle(e) {
    let value = e.detail.value;
    this.setData({
      myTitle: value
    })
  },
  myContent(e) {
    let value = e.detail.value;
    this.setData({
      myContent: value
    })
  },
  submitBtn(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let title = this.data.myTitle,
      content = this.data.myContent,
      wechat = this.data.myWechat,
      qq = this.data.myQQ,
      motto = this.data.myMotto,
      autograph = this.data.myAutograph;
    let info = {
      title: title,
      content: content,
      wechat: wechat,
      qq: qq,
      motto: motto,
      autograph: autograph
    }
    let token = app.globalData.token;
    info = JSON.stringify(info);
    if (title || content || qq || wechat || motto || autograph) {
      util.http('Membercard/setCardInfo', {
        info: info,
        card_id: this.data.id,
        type:2
      }, 'post', token).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
          wx.reLaunch({
            url: '../MyCard/MyCard'
          })
        }
      })
    }
  }
})