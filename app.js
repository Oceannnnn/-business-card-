//app.js
App({
  onLaunch: function () {
    // wx.clearStorage()
    if (wx.getStorageSync('httpClient').token) {
      this.globalData.state = wx.getStorageSync('httpClient').state;
      this.globalData.token = wx.getStorageSync('httpClient').token;
      this.globalData.card_num = wx.getStorageSync('card_num')
      this.globalData.headimg = wx.getStorageSync('headimg');
      this.globalData.nick_name = wx.getStorageSync('nick_name'); 
      this.globalData.identify_flag = wx.getStorageSync('identify')
      this.globalData.is_join = wx.getStorageSync('is_join');
    }
  },
  globalData: {
    userInfo: null,
    code:'',
    state:0,
    token:'',
    globalFormIds: [],
    is_money:0
  }, 
})