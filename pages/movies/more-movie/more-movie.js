// pages/movies/more-movie/more-movie.js
var app = getApp();
var utils = require('../../../utils/utils.js');
Page({
  data:{
    category: '',
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },
  onLoad:function(options){
    var category = options.category;
    this.data.category = category;
    var dataUrl = '';
    switch(category){
      case '正在热映':
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case '豆瓣TOP250':
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    utils.http(dataUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onReachBottom: function(event){
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    utils.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh: function(event){
    var refreshUrl = this.data.requestUrl + '?start=0&count=20';
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    utils.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onMovieTap: function(event){
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieId=' + movieId
    });
  },
  processDoubanData: function(moviesDouban){
    var movies = [];
    for(var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6){
        title = title.substring(0,6) + "...";
      }
      var temp = {
        stars: utils.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }
    var totalMovies = {};

    //如果绑定新加载的数据...
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReady: function(){
    wx.setNavigationBarTitle({
      title: this.data.category,
      success: function(res) {
        // success
      }
    })
  }
})