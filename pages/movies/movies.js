// pages/movies/movies.js
var util = require('../../utils/utils.js');
var app = getApp();
Page({
  data:{
    'inTheaters':{},
    'comingSoon':{},
    'top250':{}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣TOP250");
  },
  getMovieListData: function(url, settedKey, categoryTitle){
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application'
      },
      success: function(res){
        // console.log(res);
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function() {
        console.log('fail');
      },
      complete: function() {
        // complete
      }
    })
  },
  processDoubanData: function(moviesDouban, settedKey, categoryTitle){
    var movies = [];
    for(var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6){
        title = title.substring(0,6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }
    // console.log(settedKey)
    var data = {};
    data[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(data);
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