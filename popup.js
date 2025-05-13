document.addEventListener('DOMContentLoaded', function() {
  const getCookieBtn = document.getElementById('getCookieBtn');
  const cookieResult = document.getElementById('cookieResult');
  const copyBtn = document.getElementById('copyBtn');

  // 获取Cookie按钮点击事件
  getCookieBtn.addEventListener('click', function() {
    // 显示加载状态
    cookieResult.value = "正在获取Cookie...";
    
    // 直接获取所有域名的cookie
    const domains = [".xiaohongshu.com", "as.xiaohongshu.com", "t2.xiaohongshu.com", "xiaohongshu.com", "www.xiaohongshu.com"];
    let allCookies = [];
    let completedRequests = 0;
    
    domains.forEach(domain => {
      chrome.cookies.getAll({ domain: domain }, function(cookies) {
        if (cookies && cookies.length > 0) {
          allCookies = allCookies.concat(cookies);
        }
        completedRequests++;
        
        // 所有请求完成后处理结果
        if (completedRequests === domains.length) {
          if (allCookies.length > 0) {
            // 将cookie转换为格式化字符串
            const cookieStr = allCookies.map(cookie => {
              return `${cookie.name}=${cookie.value}`;
            }).join('; ');
            
            // 显示cookie
            cookieResult.value = cookieStr;
            
            // 保存到扩展存储中
            chrome.storage.local.set({ 'xhsCookie': cookieStr });
          } else {
            cookieResult.value = "未找到Cookie，请确保您已登录小红书网站";
          }
        }
      });
    });
  });

  // 复制按钮点击事件
  copyBtn.addEventListener('click', function() {
    cookieResult.select();
    document.execCommand('copy');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '已复制!';
    setTimeout(function() {
      copyBtn.textContent = originalText;
    }, 1500);
  });

  // 检查是否有保存的cookie
  chrome.storage.local.get(['xhsCookie'], function(result) {
    if (result.xhsCookie) {
      cookieResult.value = result.xhsCookie;
    }
  });
}); 