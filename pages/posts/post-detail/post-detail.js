// pages/posts/post-detail/post-detail.js
var postData = require('../../../data/posts-data.js');

Page({
  data:{
    isPlayingMusic: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var postId = options.id;
    this.data.postId = postId;
    var postsData = postData.postList[postId];
    this.setData({
      postData: postsData
    });

    var postsCollected = wx.getStorageSync('posts_collected');
    if(!postsCollected){
      postsCollected = {};
    }
    if(postsCollected[postId]){
      var collected = postsCollected[postId];
      this.setData({
        collected: collected
      })
    }else{
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
    var that = this;
    wx.getBackgroundAudioPlayerState({
      success:function(res){
        if(res.dataUrl && res.dataUrl === postsData.music.dataUrl){
          that.setData({
            isPlayingMusic: true
          })
        }
      }
    });
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isPlayingMusic: true
      });
    });
    wx.onBackgroundAudioPause(function() {
      that.setData({
        isPlayingMusic: false
      });
    });
    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false
      });
    });
  },
  onCollectionTap: function(event){
    var postsCollected = wx.getStorageSync('posts_collected');
    postsCollected[this.data.postId] = !postsCollected[this.data.postId];
    this.showToast(postsCollected, postsCollected[this.data.postId]);
  },
  onShareTap: function(event){
    var itemList = [
                      '分享给微信好友',
                      '分享到朋友圈',
                      '分享到QQ',
                      '分享到微博'
                    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function(res){
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消?'+res.cancel+",现在无法实现分享功能"
        })
      }
    })
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
  onMusicTap: function(event){
    var isPlayingMusic = this.data.isPlayingMusic;
    var data = postData.postList[this.data.postId];
    if(isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    }else{
      wx.getBackgroundAudioPlayerState({
        success: function(res){
          if(res.status === 0){
            var currentPosition = res.currentPosition;
            wx.playBackgroundAudio(data.music);
            wx.seekBackgroundAudio({
              position: currentPosition
            });
          }else{
            wx.playBackgroundAudio(data.music);
          }
        }
      })
      this.setData({
        isPlayingMusic: true
      });   
    }
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