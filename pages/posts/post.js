var postData = require('../../data/posts-data.js');

Page({
  data:{
    
  },
  onLoad: function(options){
    this.setData({
      postList: postData.postList
    })
  },
  onPostTap: function(event){
    var postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: "post-detail/post-detail?id="+postId,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  onSwiperTap: function(event){
    var postId = event.target.dataset.postId;
    if(!postId){
      return;
    }
    wx.navigateTo({
      url: "post-detail/post-detail?id="+postId,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})