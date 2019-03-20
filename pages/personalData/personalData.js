// pages/personalData/personalData.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    id: '',
    type: '',
    myName: "",
    industryIndex: -1,
    region: [],
    catename: "请选择行业(必填)"
  },
  onLoad(op) {
    if (op.id) {
      this.setData({
        id: op.id,
        type: op.type
      })
    }
    if (op.id == '') {
      wx.setNavigationBarTitle({
        title: '创建我的名片',
      })
    }
    this.init()
    util.uploadFormIds();
  },
  init() {
    util.http('Category/index', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          industryArray: res.data,
        })
      }
    })
    let token = app.globalData.token;
    let id = this.data.id;
    let type = this.data.type;
    if (id != '') {
      util.http('Membercard/baseInfo', {
        card_id: id,
        type: type
      }, 'post', token).then(res => {
        if (res.code == 200) {
          let info = res.data;
          this.setData({
            myName: info.name,
            myPosition: info.lead,
            myCompany: info.company,
            catename: info.cate_name,
            province: info.province,
            city: info.city,
            town: info.town,
            myAddress: info.address,
            myPhone: info.phone,
            cateid: info.cateid,
            industryId: info.cateid,
            head: info.head
          })
        } else if (res.code == -1) {
          util.afreshLogin()
        }
      })
    } else {
      util.http('Member/memberBase', {}, 'get', token).then(res => {
        if (res.code == 200) {
          let info = res.data;
          this.setData({
            myName: info.wx_name,
            head: info.wx_avatar
          })
        } else if (res.code == -1) {
          util.afreshLogin()
        }
      })
    }
    let that = this;
    wx.createSelectorQuery().selectAll('.avatar').boundingClientRect(function(rect) {
      that.setData({
        height: rect[0].height,
        width: rect[0].width
      })
    }).exec();
  },
  myName(e) {
    let value = e.detail.value;
    this.setData({
      myName: value
    })
  },
  myPosition(e) {
    let value = e.detail.value;
    this.setData({
      myPosition: value
    })
  },
  myCompany(e) {
    let value = e.detail.value;
    this.setData({
      myCompany: value
    })
  },
  myPhone(e) {
    let value = e.detail.value;
    this.setData({
      myPhone: value
    })
  },
  myAddress(e) {
    let value = e.detail.value;
    this.setData({
      myAddress: value
    })
  },
  bindIndustryChange(e) {
    let value = e.detail.value;
    let industryArray = this.data.industryArray;
    let industryId = industryArray[value].id
    this.setData({
      industryIndex: value,
      industryId: industryId
    })
  },
  bindRegionChange(e) {
    let value = e.detail.value;
    this.setData({
      region: value
    })
  },
  check() {
    let name = this.data.myName;
    let phone = this.data.myPhone;
    let myCompany = this.data.myCompany;
    let myAddress = this.data.myAddress;
    let region = this.data.region;
    let industryId = this.data.industryId;
    let myPosition = this.data.myPosition;
    if (!name) {
      wx.showToast({
        title: '请输入联系人',
        image: '../../images/warn.png'
      })
      return false
    } else if (!myPosition) {
      wx.showToast({
        title: '输入称谓或职位',
        image: '../../images/warn.png'
      })
      return false
    } else if (!industryId) {
      wx.showToast({
        title: '请选择行业',
        image: '../../images/warn.png'
      })
      return false
    } else if (!myCompany) {
      wx.showToast({
        title: '请输入你的公司',
        image: '../../images/warn.png'
      })
      return false
    } else if (!region) {
      wx.showToast({
        title: '请选择地区',
        image: '../../images/warn.png'
      })
      return false
    } else if (!myAddress) {
      wx.showToast({
        title: '请输入详细地址',
        image: '../../images/warn.png'
      })
      return false
    } else if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        image: '../../images/warn.png'
      })
      return false
    } else {
      if (!util.toCheck(phone)) {
        wx.showToast({
          title: '手机号格式错误',
          image: '../../images/warn.png'
        })
        return false
      }
    }
    return true
  },
  submitBtn(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let region = this.data.region;
    let id = this.data.id;
    let info = {
      name: this.data.myName,
      phone: this.data.myPhone,
      company: this.data.myCompany,
      address: this.data.myAddress,
      province: region[0],
      city: region[1],
      town: region[2],
      cateid: this.data.industryId,
      lead: this.data.myPosition,
      head: this.data.head
    }
    let token = app.globalData.token;
    info = JSON.stringify(info);
    let type = 3;
    if (id) {
      type = 2
    }
    if (this.check()) {
      util.http('Membercard/baseInfo', {
        card_id: id,
        info: info,
        type: type
      }, 'post', token).then(res => {
        if (res.code == 200) {
          let text = '';
          if (type == 2) {
            text = '保存成功';
          } else if (type == 3) {
            text = "制作成功";
          }
          wx.showToast({
            title: text,
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../MyCard/MyCard'
            })
          }, 1000)
        }
      })
    }
  },
  changeAvatar() {
    wx.navigateTo({
      url: '../headImage/headImage?id=' + this.data.id
    })
  }
})