Page({
    onTap: function(){
        // wx.navigateTo({
        //     url: "../posts/post"
        // });

        wx.redirectTo({
          url: '../posts/post',
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

    onUnload: function(){
        
    },

    onHide: function(){
        
    }
})