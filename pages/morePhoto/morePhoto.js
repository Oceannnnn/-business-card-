// pages/morePhoto/morePhoto.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    imgbox: [],//上传图片
    image:{}
  },
  onLoad(op){
    this.setData({
      id: op.id
    })
    util.uploadFormIds();
    this.init(op.id);
  },
  init(id) {
    let token = app.globalData.token;
    util.http('Membercard/getCardImage', { card_id: id }, 'post', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        if (info) {
          this.setData({
            imgbox: info
          })
        }
      }
    })
  },
  // 上传图片 &&&
  addPic1() {
    var imgbox = this.data.imgbox;
    var that = this;
    var n = 9;
    if (9 > imgbox.length > 0) {
      n = 9 - imgbox.length;
    } else if (imgbox.length == 9) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePat
        let tempFilePaths = res.tempFilePaths;
        that.uploadimg(tempFilePaths);
      }
    })
  },
  uploadimg(arr) {
    let token = app.globalData.token;
    let id = this.data.id;
    let imgbox = this.data.imgbox;
    if (imgbox==''){
      imgbox = []
    }
    let image = this.data.image;
    for (var i = 0; i < arr.length; i++) { 
      var that = this;
      wx.uploadFile({
        url: util.url + "Membercard/uploadCardImage",
        filePath: arr[i],
        name: 'file',//这里根据自己的实际情况改,
        formData: {
          'card_id': id
        },
        header: {
          "Content-Type": "multipart/form-data",
          token: token
        },//这里是上传图片时一起上传的数据
        complete: (res) => {
          i++;//这个图片执行完上传后，开始上传下一张
          let data = res.data;
          data = JSON.parse(data);
          let id = data.data.id;
          let url = data.data.url;
          image['image'] = url;
          image['id'] = id;
          imgbox.push(image);
          image = {}
          that.setData({
            imgbox: imgbox
          });
          if (i >= arr.length) {   //当图片传完时，停止调用    
            wx.showToast({
              title: '上传成功',
              icon:'success'
            })
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; //上一个页面
            prevPage.setData({
              modifyPhone:1
            })
            return
          } else {//若图片还没有传完，则继续调用函数
            that.uploadimg(arr);
          }
        }
      });
    }
  },
  delImage(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let token = app.globalData.token;
    let card_id = this.data.id;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    let type = ''
    if (index != -1) {
      type = 2
    } else {
      type = 1
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; 
    util.http('Membercard/deleteCardImage', { card_id: card_id, image_id:id,type:type}, 'post',token).then(res => {
      if (res.code == 200) {
        if (index != -1) {
          imgbox.splice(index, 1)
        } else {
          imgbox = [];
        }
        this.setData({
          imgbox: imgbox
        });
        if (imgbox == ''){
          prevPage.setData({
            modifyPhone: 0
          })
        }
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        }) 
      }
    })
  }
})