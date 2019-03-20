// pages/toDetails/toDetails.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    saw:0,
    hidden:true,
    isShare:0,
    writePhotosAlbum:0,
    info:'',
    imagesList:[]
  },
  onLoad(op) {
    this.setData({
      id: op.id
    })
    util.uploadFormIds();
    if (op.isShare) {
      this.setData({
        isShare: op.isShare
      })
      if (app.globalData.state == 0) {
        wx.navigateTo({
          url: '../toLogin/toLogin?share=1&id=' + op.id
        })
      } else {
        this.init(op.id)
      }
      return
    }
    this.init(op.id)
  },
  onShow() {
    this.getCardInfo()
  },
  getCardInfo() {
    let id = this.data.id;
    let token = app.globalData.token;
    util.http('Membercard/getCardInfo', { card_id: id }, 'post', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        wx.removeStorageSync("getCardInfo")
        wx.setStorage({
          key: 'getCardInfo',
          data: info,
        })
        if (info == ""){
          this.setData({
            hidden: false,
            info: ''
          })
        } else {
          this.setData({
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
    util.http('Membercard/getCardImage', { card_id: id }, 'post', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        wx.removeStorageSync("getCardImage")
        wx.setStorage({
          key: 'getCardImage',
          data: info,
        })
        this.setData({
          imagesList:info
        })
      }
    })
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum'] == false) {
          that.setData({
            writePhotosAlbum: 1
          })
        } else {
          that.setData({
            writePhotosAlbum: 0
          })
        }
      }
    })
  },
  init(id){
    let token = app.globalData.token;
    util.http("Membercard/detail", { id: id }, 'post', token).then(res => {
      if(res.code == 200){
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
          wx.setNavigationBarTitle({
            title: "我的名片"
          })
          this.setData({
            isPersonal: 1
          })
        }
      }
    })
  },
  collect() {
    if (app.globalData.state == 1) {
      let token = app.globalData.token;
      var type = this.data.type;
      var id = this.data.id;
      util.http("Membercard/collect", { collect_id: id}, 'post',token).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1000
          })
          this.setData({
            is_collectd: true
          })
        }else if (res.code == 0){
          this.setData({
            is_collectd: false
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../toLogin/toLogin',
      })
    }
  },
  preservation(e) {
    let that = this;
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    wx.downloadFile({
      url: that.data.images,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            that.setData({
              writePhotosAlbum: 0
            })
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '保存失败！',
            })
            that.setData({
              writePhotosAlbum: 1
            })
            wx.getSetting({
              success: (res) => {
                console.log(res)
                if (res.authSetting['scope.writePhotosAlbum'] == false) {
                  that.setData({
                    writePhotosAlbum: 1
                  })
                } else {
                  that.setData({
                    writePhotosAlbum: 0
                  })
                }
              }
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          icon: 'none',
          title: '保存失败！',
        })
      }
    })
  },
  sawMore(){
    this.setData({
      hidden:!this.data.hidden
    })
  },
  setClipboardData(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let txt = e.currentTarget.dataset.txt;
    if (txt != '') {
      wx.setClipboardData({
        data: txt,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '无内容复制',
        icon:'none'
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
  imageLoad(e) {
    //获取图片的原始宽度和高度 
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    let imageSize = util.imageZoomHeightUtil(originalWidth, originalHeight); 
    imageSize = util.imageZoomHeightUtil(originalWidth, originalHeight, imageSize.imageWidth-20)
    this.setData({ imageWidth: imageSize.imageWidth, imageHeight: imageSize.imageHeight });  
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getCardInfo();
    this.init();
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onShareAppMessage(ops) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let url = "/" + currentPage.route;
    let name = this.data.name;
    if (this.data.isPersonal==1){
      name = "我"
    }
    let id = this.data.id;
    if (ops.from === 'button') { }
    return {
      title: name + '的名片，请惠存',
      path: url + "?id=" + id + "&isShare=1"
    }
  },
})