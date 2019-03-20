const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/*** 
   * 按照显示图片的宽等比例缩放得到显示图片的高 
   * @params originalWidth 原始图片的宽 
   * @params originalHeight 原始图片的高 
   * @params imageWidth   显示图片的宽，如果不传就使用屏幕的宽 
   * 返回图片的宽高对象 
  ***/
const imageZoomHeightUtil = (originalWidth, originalHeight, imageWidth) => {
  let imageSize = {};
  if (imageWidth) {
    imageSize.imageWidth = imageWidth;
    imageSize.imageHeight = (imageWidth * originalHeight) / originalWidth;
  } else {//如果没有传imageWidth,使用屏幕的宽 
    wx.getSystemInfo({
      success: function (res) {
        imageWidth = res.windowWidth;
        imageSize.imageWidth = imageWidth;
        imageSize.imageHeight = (imageWidth * originalHeight) / originalWidth;
      }
    });
  }
  return imageSize;
}

  /*** 
   * 按照显示图片的高等比例缩放得到显示图片的宽 
   * @params originalWidth 原始图片的宽 
   * @params originalHeight 原始图片的高 
   * @params imageHeight  显示图片的高，如果不传就使用屏幕的高 
   * 返回图片的宽高对象 
  ***/
const imageZoomWidthUtil = (originalWidth, originalHeight, imageHeight) =>{
  let imageSize = {};
  if (imageHeight) {
    imageSize.imageWidth = (imageHeight * originalWidth) / originalHeight;
    imageSize.imageHeight = imageHeight;
  } else {//如果没有传imageHeight,使用屏幕的高 
    wx.getSystemInfo({
      success: function (res) {
        imageHeight = res.windowHeight;
        imageSize.imageWidth = (imageHeight * originalWidth) / originalHeight;
        imageSize.imageHeight = imageHeight;
      }
    });
  }
  return imageSize;
}
// 正则校验手机号
const toCheck = (str) => {
  // 定义手机号的正则
  var isMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  //拿到去除空格后的手机号
  // 校验手机号
  return isMobile.test(str);
}
const u = "https://www.qzmpq.club/api.php/api/"
// const u = "http://local.card.cn/api.php/api/"
const http = (url, data = {}, method = 'get', token = '') => {
  const allUrl = u + url;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: allUrl,
      data: data,
      method: method ? method : 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res.data)
      }
    })
  })
}

const afreshLogin = () => {
  wx.clearStorage();
  app.globalData.state = 0;
  wx.showModal({
    title: '提示',
    confirmText: '确认',
    content: '信息已过期，请重新登陆',
    confirmColor: '#029F53',
    success: function (res) {
      if (res.confirm) {
        wx.switchTab({
          url: '../my/my'
        })
      }
    }
  })
}

const certification = () => {
  wx.showModal({
    title: '',
    content: '为了您更好的体验，请前往个人中心实名认证',
    confirmColor: '#165ABB',
    success: function (res) {
      if (res.confirm) {
        wx.switchTab({
          url: '../my/my',
        })
      }
    }
  })
}
const collectFormIds = (formId) => {
  let formIds = app.globalData.globalFormIds;  // 获取全局推送码数组
  if (formId == undefined) return
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  let data = {
    form_id: formId,
    expire_time: timestamp + 60480000  // 7天后的过期时间戳
  }
  formIds.push(data);
  app.globalData.globalFormIds = formIds;
}

const uploadFormIds = () => {
  var formIds = app.globalData.globalFormIds;  // 获取全局推送码
  if (formIds.length) {
    formIds = JSON.stringify(formIds);  // 转换成JSON字符串
    let token = app.globalData.token;
    http('My/saveFormId', { formid_arr: formIds }, 'post', token).then(res => {
      if (res.code == 200) {
        app.globalData.globalFormIds = [];  // 清空当前全局推送码
      }
    })
  }
}
module.exports = {
  http: http,
  formatTime: formatTime,
  imageZoomWidthUtil: imageZoomWidthUtil,
  imageZoomHeightUtil: imageZoomHeightUtil,
  toCheck: toCheck,
  url: u,
  afreshLogin: afreshLogin,
  certification: certification,
  collectFormIds: collectFormIds,
  uploadFormIds: uploadFormIds
}
