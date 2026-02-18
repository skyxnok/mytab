// app.js - 插件业务逻辑（含下载功能）
document.addEventListener('DOMContentLoaded', () => {
  // 工具函数：显示操作结果
  function showResult(msg, isSuccess = true) {
    const resultEl = document.getElementById('result');
    resultEl.textContent = msg;
    resultEl.style.color = isSuccess ? 'green' : 'red';
  }

  // 新增：生成下载链接并触发下载
  function downloadTabFile(tabBytes, fileName = 'encrypted_data.tab') {
    try {
      // 1. 将字节数组转为Blob（MIME类型设为application/octet-stream）
      const blob = new Blob([tabBytes], { type: 'application/octet-stream' });
      
      // 2. 生成临时下载URL
      const downloadUrl = URL.createObjectURL(blob);
      
      // 3. 创建隐藏的<a>标签并触发下载
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName; // 下载后的文件名
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click(); // 模拟点击下载
      
      // 4. 清理资源
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl); // 销毁临时URL
      
      return true;
    } catch (error) {
      console.error('生成下载链接失败：', error);
      showResult(`下载失败：${error.message}`, false);
      return false;
    }
  }

  // 1. 加密插件数据（新增下载）
  function handleEncrypt() {
    try {
      // 模拟插件数据
      const pluginData = {
  "baseConfig": {
    "lang": "zh-CN",
    "searchEngine": [
      {
        "key": "baidu",
        "title": "百度",
        "href": "https://www.baidu.com/s?wd=%s&tn=15007414_23_dg&ie=utf-8"
      },
      {
        "key": "google",
        "title": "Google",
        "href": "https://www.google.com/search?q="
      },
      {
        "key": "github",
        "title": "GitHub",
        "href": "https://github.com/search?q="
      },
      {
        "key": "bing",
        "title": "必应",
        "href": "https://www.bing.com/search?form=QBLH&q="
      },
      {
        "key": "xiaohongshu",
        "title": "小红书",
        "href": "https://www.xiaohongshu.com/search_result/?&m_source=itab&keyword="
      },
      {
        "key": "stackoverflow",
        "title": "StackOverflow",
        "href": "https://stackoverflow.com/nocaptcha?s="
      },
      {
        "key": "bilibili",
        "title": "哔哩哔哩",
        "href": "https://search.bilibili.com/all?keyword="
      }
    ],
    "useSearch": "google",
    "search": {
      "show": true,
      "history": false,
      "height": 52,
      "radius": 39,
      "bgColor": 0.5,
      "translate": "https://translate.volcengine.com/translate?",
      "translateHide": false
    },
    "theme": {
      "mode": "light",
      "system": false,
      "color": "#1890ff"
    },
    "sidebar": {
      "placement": "right",
      "autoHide": true,
      "width": 50,
      "lastGroup": true,
      "mouseGroup": true,
      "opacity": 0.5
    },
    "wallpaper": {
      "mask": 0,
      "blur": 0,
      "type": 1,
      "name": "x6128o",
      "src": "https://files.codelife.cc/wallhaven/full/83/wallhaven-839zjk.jpg?x-oss-process=image/resize,limit_0,m_fill,w_2560,h_1440/quality,Q_92/format,webp",
      "thumb": "https://files.codelife.cc/wallhaven/full/83/wallhaven-839zjk.jpg?x-oss-process=image/resize,limit_0,m_fill,w_307,h_158/quality,Q_92/format,webp",
      "time": 0,
      "source": ""
    },
    "layout": {
      "view": "widget",
      "yiyan": true
    },
    "time": {
      "show": true,
      "size": 111,
      "color": "#b8ceff",
      "fontWeight": "600",
      "font": "Arial",
      "hour24": true,
      "sec": true,
      "month": "inline",
      "week": "inline",
      "lunar": "inline"
    },
    "open": {
      "searchBlank": true,
      "iconBlank": true
    },
    "icon": {
      "name": 1,
      "nameSize": 12,
      "nameColor": "#fff",
      "startAnimation": false,
      "iconRadius": 14,
      "iconSize": 60,
      "iconX": 30,
      "iconY": 30,
      "opactiy": 1,
      "unit": "px",
      "width": 1350,
      "xysync": true
    },
    "topSearch": [
      {
        "name": "百度",
        "id": "Jb0vmloB1G"
      },
      {
        "name": "微博",
        "id": "KqndgxeLl9"
      },
      {
        "name": "知乎",
        "id": "mproPpoq6O"
      }
    ]
  },
}
    
      // 加密流程
      const jsonBytes = TabEncrypt.byteTools.jsonObjToUint8Array(pluginData);
      const tabBytes = TabEncrypt.TabTools.Json2Tab(jsonBytes);
      const tabBase64 = btoa(String.fromCharCode(...tabBytes));

      // 存储数据
      chromeStorage.setItem('local', 'encrypted_tab_data', tabBase64).then(() => {
        showResult(`加密成功！
Tab数据长度：${tabBytes.length}字节
加密时间：${new Date().toLocaleString()}
已生成下载链接，文件将自动下载`, true);
        
        // 触发文件下载（文件名带时间戳，避免重复）
        const timestamp = new Date().getTime();
        downloadTabFile(tabBytes, `encrypted_data_${timestamp}.tab`);
      });
    } catch (error) {
      showResult(`加密失败：${error.message}`, false);
      console.error('加密错误:', error);
    }
  }

  // 2. 解密插件数据
  function handleDecrypt() {
    // 读取存储的加密数据
    chromeStorage.getItem('local', 'encrypted_tab_data', '').then(tabBase64 => {
      if (!tabBase64) {
        showResult('暂无加密数据，请先点击「加密插件数据」', false);
        return;
      }

      try {
        // 解密流程
        const tabBytes = new Uint8Array(atob(tabBase64).split('').map(char => char.charCodeAt(0)));
        const decryptResult = TabEncrypt.TabTools.Tab2Json(tabBytes);
        const pluginData = TabEncrypt.byteTools.uint8Array2JsonObj(decryptResult.jsonBytes);

        // 显示结果
        showResult(
          `解密成功！
加密时间：${decryptResult.date.toLocaleString()}
解密数据：${JSON.stringify(pluginData, null, 2)}`, true
        );

        // 恢复数据到存储
        chromeStorage.setItem('sync', 'shortcuts', pluginData.shortcuts);
        chromeStorage.setItem('sync', 'todos', pluginData.todos);
      } catch (error) {
        showResult(`解密失败：${error.message}`, false);
        console.error('解密错误:', error);
      }
    });
  }

  // 3. 新增：手动触发下载（可选，单独的下载按钮）
  function handleDownload() {
    chromeStorage.getItem('local', 'encrypted_tab_data', '').then(tabBase64 => {
      if (!tabBase64) {
        showResult('暂无加密数据，请先加密', false);
        return;
      }
      // 转字节数组并下载
      const tabBytes = new Uint8Array(atob(tabBase64).split('').map(char => char.charCodeAt(0)));
      const timestamp = new Date().getTime();
      if (downloadTabFile(tabBytes, `encrypted_data_${timestamp}.tab`)) {
        showResult('下载链接已生成，文件正在下载...', true);
      }
    });
  }

  // 绑定按钮事件
  document.getElementById('encryptBtn').addEventListener('click', handleEncrypt);
  document.getElementById('decryptBtn').addEventListener('click', handleDecrypt);
  document.getElementById('downloadBtn').addEventListener('click', handleDownload); // 新增下载按钮绑定
});