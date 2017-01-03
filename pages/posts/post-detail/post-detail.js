// pages/posts/post-detail/post-detail.js
var postData = require('../../../data/posts-data.js');

Page({
  data:{

  },
  onLoad:function(options){
    // wx.clearStorageSync();
    var postId = options.id;
    this.data.postId = postId;
    var postsData = postData.postList[postId];
    // console.log(postsData);
    this.setData({
      postData: postsData
    });
    // this.data.postData = postsData;

    var postsCollected = wx.getStorageSync('posts_collected');
    // console.log(postsCollected);
    if(postsCollected[postId]){
      var collected = postsCollected[postId];
      this.setData({
        collected: collected
      })
    }else{
      // var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
    // 页面初始化 options为页面跳转所带来的参数
  },
  onCollectionTap: function(event){
    // console.log(123);
    var postsCollected = wx.getStorageSync('posts_collected');
    postsCollected[this.data.postId] = !postsCollected[this.data.postId];
    // wx.setStorageSync('posts_collected', postsCollected);
    // this.setData({
    //   collected: postsCollected[this.data.postId]
    // });
    this.showToast(postsCollected, postsCollected[this.data.postId]);
  },
  showModal: function(postsCollected, postCollected){
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected?'是否收藏该文章':'取消收藏该文章',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function(res){
        if(res.confirm){
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postsCollected[that.data.postId]
          });
        }
      }
    })
  },
  showToast: function(postsCollected, postCollected){
    var that = this;
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postsCollected[that.data.postId]
    });
    wx.showToast({
      title: postsCollected[that.data.postId] ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: 'success'
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})