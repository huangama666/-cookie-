// 监听扩展安装事件
chrome.runtime.onInstalled.addListener(function() {
  console.log("小红书Cookie获取器已安装");
});

// 监听扩展图标点击事件
chrome.action.onClicked.addListener(function(tab) {
  // 这个事件不会触发，因为我们设置了default_popup
  // 但保留这段代码以防将来需要
});

// 处理来自popup的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getCookies") {
    // 获取所有小红书相关域名的cookie
    const domains = [
      ".xiaohongshu.com", 
      "xiaohongshu.com", 
      "www.xiaohongshu.com",
      "as.xiaohongshu.com", 
      "t2.xiaohongshu.com"
    ];
    
    const promises = domains.map(domain => {
      return new Promise(resolve => {
        chrome.cookies.getAll({ domain: domain }, resolve);
      });
    });
    
    Promise.all(promises).then(results => {
      // 合并所有cookie
      const allCookies = [].concat(...results);
      
      if (allCookies && allCookies.length > 0) {
        sendResponse({ 
          cookies: allCookies, 
          success: true 
        });
      } else {
        sendResponse({ 
          success: false, 
          message: "未找到Cookie，请确保您已登录小红书网站" 
        });
      }
    });
    
    return true; // 保持消息通道开放直到异步回调完成
  }
}); 