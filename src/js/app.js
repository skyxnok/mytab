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
  "navConfig": [
    {
      "id": "1",
      "name": "主页",
      "icon": "home",
      "children": [
        {
          "name": "i天气",
          "component": "weather",
          "type": "component",
          "size": "medium",
          "id": "boeg77UMK",
          "view": 18
        },
        {
          "name": "i日历",
          "component": "calendar",
          "type": "component",
          "size": "medium",
          "id": "gSZZkzSIL",
          "view": 13
        },
        {
          "name": "i壁纸",
          "component": "wallpaper",
          "type": "icon",
          "size": "small",
          "id": "fu2M-S9yd",
          "view": 41,
          "src": "https://files.codelife.cc/tools-icon/wallpaper.svg"
        },
        {
          "component": "daysMatter",
          "name": "倒计时",
          "size": "2x2",
          "type": "component",
          "config": {
            "name": "life long",
            "title": "你在世界已经",
            "target": "2000-01-20",
            "repeat": "",
            "bgColor": "#f4eee6",
            "textColor": "#efabc4",
            "family": "Arial",
            "icon": "",
            "mask": "",
            "isLunar": "",
            "isEdit": true
          },
          "id": "xhR8EruVG8RpD7Mi-WM3i0732",
          "view": 9
        },
        {
          "component": "daysMatter",
          "name": "倒计时",
          "size": "1x2",
          "type": "component",
          "config": {
            "name": "纪念日",
            "title": "毕业",
            "target": "2023-06-20",
            "repeat": "",
            "bgColor": "#f4eee6",
            "textColor": "#daccfd",
            "family": "",
            "icon": "",
            "mask": "",
            "isLunar": ""
          },
          "id": "W0rXxmcyPAZ80W_m9gzUR6817",
          "view": 5
        },
        {
          "component": "daysMatter",
          "insetType": "",
          "name": "倒数日",
          "src": "https://files.codelife.cc/tools-icon/daysMatter.svg",
          "type": "component",
          "config": {
            "name": "毛映雪",
            "title": "相遇",
            "target": "2025-02-22",
            "repeat": "",
            "bgColor": "#372128",
            "textColor": "#9de5fe",
            "family": "HarmonyOS_Sans",
            "icon": "",
            "mask": "",
            "isLunar": ""
          },
          "size": "1x2",
          "id": "BZpcjWsZhjCNjU1bcl_kJ7897",
          "view": 1
        }
      ]
    },
    {
      "name": "程序员",
      "icon": "code",
      "children": [
        {
          "id": "sjmy48HJcVe7fL4BgWYRt1385",
          "url": "https://3.jetbra.in/",
          "name": "jetbrain激活",
          "src": "https://files.codelife.cc/user-website-icon/20240511/fLe8Sh4qJpIzZ9kbikRki4967.png",
          "type": "icon",
          "iconText": "",
          "backgroundColor": "transparent",
          "view": 12
        },
        {
          "id": "eop9UR_4d-I2Fr2dXWGzG8408",
          "url": "https://github.com/bgvioletsky",
          "name": "bgvioletsky",
          "src": "https://files.codelife.cc/user-website-icon/20250622/6oZsST6p9ftzpIsoiarI43277.svg",
          "type": "icon",
          "iconText": "Web",
          "backgroundColor": "#000000",
          "view": 20
        },
        {
          "url": "https://github.com/shyxnok",
          "type": "icon",
          "name": "ShyXnok",
          "src": "https://files.codelife.cc/icons/github.svg",
          "backgroundColor": "#080000",
          "id": "v2gpV-7c3t7tuDZ4FvViT6697",
          "iconText": "Web",
          "view": 15
        },
        {
          "id": "yYA1PFztssB4dUaYDt3nQ0176",
          "url": "https://docs.github.com/zh/",
          "name": "GitHub Docs",
          "src": "https://docs.github.com/assets/cb-345/images/site/favicon.png",
          "type": "icon",
          "iconText": "Git",
          "backgroundColor": "transparent",
          "view": 6
        },
        {
          "type": "icon",
          "id": "jb6HyAmZAYTgwHWcacBwr",
          "url": "https://www.runoob.com/",
          "name": "菜鸟教程",
          "src": "https://files.codelife.cc/website/5aa7bf315ee1024fd62dcaed.png",
          "iconText": "菜鸟教",
          "backgroundColor": "transparent",
          "view": 268
        },
        {
          "id": "A42bDc-uHfgXYZa8opSWG9248",
          "url": "https://chat.oaichat.cc/",
          "name": "chatgpt",
          "src": "https://files.codelife.cc/user-website-icon/20240511/jIaRPrsJbu4eZNdjeJPQn9743.png",
          "type": "icon",
          "iconText": "Ope",
          "backgroundColor": "#ee3b3b",
          "view": 38
        },
        {
          "id": "klEOqEQHDRbWLa7u3_uSX6834",
          "url": "https://mycolor.space/",
          "name": "颜色",
          "src": "https://mycolor.space/favicon5.png",
          "type": "icon",
          "iconText": "Col",
          "backgroundColor": "#FFFFFF",
          "view": 12
        },
        {
          "id": "mtIWCHoC4Ndza9M8XpAJ31732",
          "url": "https://csdiy.wiki/",
          "name": "CS自学指南",
          "src": "https://csdiy.wiki/images/favicon.ico",
          "type": "text",
          "iconText": "CS自",
          "backgroundColor": "#FFFFFF",
          "view": 12
        },
        {
          "id": "zGsb_kZ9_",
          "url": "https://leetcode-cn.com/",
          "type": "icon",
          "name": "力扣",
          "src": "https://files.codelife.cc/website/leetcode.svg",
          "view": 7
        },
        {
          "id": "mI-JmDQ3sK7Vz4NCAIf638504",
          "url": "https://xkaifv.aitianhu1.top/#/chat/1002",
          "name": "chatgpt",
          "src": "",
          "type": "text",
          "iconText": "",
          "backgroundColor": "#372128",
          "view": 16
        },
        {
          "id": "Z4-lvgD8hrF_A8WKb99HK0466",
          "url": "https://chat18.aichatos68.com/",
          "name": "AIchatOS",
          "src": "https://chat18.aichatos68.com/favicon.svg",
          "type": "icon",
          "iconText": "AIc",
          "backgroundColor": "#D0C4C4",
          "view": 50
        },
        {
          "id": "7K1MPh4bbfFspYZY0NOtU5035",
          "url": "https://zh.learnlayout.com/",
          "name": "CSS布局",
          "src": "https://files.codelife.cc/website/5a0e8c1c4e7ac15bfc85d61b.png",
          "type": "icon",
          "iconText": "CSS",
          "view": 5
        },
        {
          "id": "KqJSzEMPhAdN5F1am4-xl5888",
          "url": "https://developer.mozilla.org/zh-CN/docs/Learn",
          "name": "MDN",
          "src": "https://files.codelife.cc/icons/mdn-web-docs.svg",
          "type": "icon",
          "iconText": "MDN",
          "backgroundColor": "#10E2E6",
          "view": 6
        },
        {
          "id": "5Cxkd9gIAaGbOvbDFFsNf2161",
          "url": "https://www.iconfont.cn/",
          "name": "Iconfont",
          "src": "https://files.codelife.cc/icons/iconfont.svg",
          "type": "icon",
          "iconText": "Ico",
          "backgroundColor": "#ffffff",
          "view": 33
        },
        {
          "id": "W6DBO7OgVN2VhTJZ3fQrh4427",
          "url": "https://hub.hhboard.top/#/dashboard",
          "name": "Hentai Home",
          "src": "https://files.codelife.cc/user-website-icon/20250130/VCyZAFD1ondwUKn6MfEwF6489.png",
          "type": "icon",
          "iconText": "Hen",
          "backgroundColor": "transparent",
          "view": 26
        },
        {
          "id": "pdr74rEuzRItR78TQ6b8u7784",
          "url": "https://chat.deepseek.com/a/chat/s/dd786321-2ff2-4a34-a430-9c0bcfbc737d",
          "name": "DeepSeek",
          "src": "https://chat.deepseek.com/favicon.svg",
          "type": "text",
          "iconText": "Dee",
          "backgroundColor": "transparent",
          "view": 16
        },
        {
          "id": "A9E3U8dVGmLJ4f66EGZMA7961",
          "url": "https://tool.imyun.com.cn/",
          "name": "IMYUN在线工具箱 - 简单实",
          "src": "",
          "type": "text",
          "iconText": "IMY",
          "backgroundColor": "#023373",
          "view": 14
        },
        {
          "id": "XBJqiQr7B2T3GUE-3yh9h3596",
          "url": "https://share.lanol.cn/#/send",
          "name": "文件快递柜 - FileCode",
          "src": "https://share.lanol.cn/assets/logo_small.png",
          "type": "text",
          "iconText": "文件快",
          "backgroundColor": "transparent",
          "view": 3
        },
        {
          "id": "zuyoUScIIOlAYHloEk9Kr7712",
          "url": "https://www.doubao.com?channel=itab2&source=hw_db_itab&type=tab&theme=wangzjh",
          "name": "豆包-你的AI朋友",
          "src": "https://files.codelife.cc/icons/doubao.com.webp",
          "type": "icon",
          "iconText": "豆包-",
          "backgroundColor": "#ffffff",
          "view": 267
        },
        {
          "id": "UUowtjJVJ8WcuRohkwGQj9907",
          "url": "https://cloudfisher.top/web/",
          "name": "cloudfisher",
          "src": "https://cloudfisher.top/web/favicon.ico",
          "type": "text",
          "iconText": "cl",
          "backgroundColor": "transparent",
          "view": 1
        },
        {
          "id": "caTZ3mrVAIQqF_0cE7rZz0657",
          "url": "https://icomoon.io/docs",
          "name": "IcoMoon",
          "src": "https://files.codelife.cc/icons/5c04990f2af0ed1d8a34871e.png",
          "type": "icon",
          "iconText": "Ico",
          "backgroundColor": "#054092",
          "view": 2
        },
        {
          "url": "https://chat.deepseek.com/",
          "type": "icon",
          "name": "DeepSeek",
          "src": "https://chat.deepseek.com/favicon.svg",
          "backgroundColor": "#ffffff",
          "id": "mP1X3XTDP_3CLn3MrPT9Y1342",
          "view": 7,
          "iconText": "Dee"
        },
        {
          "url": "https://www.xiaohongshu.com/explore?m_source=itab",
          "type": "icon",
          "name": "小红书",
          "src": "https://files.codelife.cc/icons/xiaohongshu.svg",
          "backgroundColor": "#ff2442",
          "id": "L_TZnMtYswVeakFl_IWFp7909"
        },
        {
          "url": "https://twitter.com/",
          "type": "icon",
          "name": "Twitter",
          "src": "https://files.codelife.cc/icons/x.com.svg",
          "backgroundColor": "#000000",
          "id": "XeKcz7J-bpemne_WxEU6d7928"
        },
        {
          "url": "https://www.youtube.com/",
          "type": "icon",
          "name": "YouTube",
          "src": "https://files.codelife.cc/icons/youtube.svg",
          "backgroundColor": "#ff0000",
          "id": "tpjQmaZIKO-MtrNrOK1sC9584"
        },
        {
          "url": "https://www.douyin.com",
          "type": "icon",
          "name": "抖音",
          "src": "https://files.codelife.cc/website/douyin.svg",
          "backgroundColor": "#1c0b1a",
          "id": "Nc5dwflbnLExUUmumuG3h4042"
        },
        {
          "url": "https://z-library.sk/",
          "type": "icon",
          "name": "Zlibrary",
          "src": "https://files.codelife.cc/icons/zhbooksc.svg",
          "backgroundColor": "#ffffff",
          "id": "53hkPGhNFdboZibABuwTc2823",
          "view": 3,
          "iconText": ""
        },
        {
          "url": "https://www.crxsoso.com/?utm=itab",
          "type": "icon",
          "name": "扩展搜搜",
          "src": "https://files.codelife.cc/icons/crxsoso.com.svg",
          "backgroundColor": "#fff",
          "id": "Xx2KX6zcWKPQBpDCvVQzV9398",
          "view": 1
        },
        {
          "url": "https://sci-hub.et-fine.com/",
          "type": "icon",
          "name": "sci-hub",
          "src": "https://files.codelife.cc/icons/sci-hub.svg",
          "backgroundColor": "#efebe3",
          "id": "dWladUAbJzzyAKMyanoGm4665"
        },
        {
          "url": "https://gmail.com/",
          "type": "icon",
          "name": "Gmail",
          "src": "https://files.codelife.cc/icons/gmail.svg",
          "backgroundColor": "#fff",
          "id": "FlUQgyolH0b_rDb3LdRHI1229",
          "view": 1
        },
        {
          "url": "https://jimeng.jianying.com/ai-tool/home/?utm_medium=aitools&utm_source=itab&utm_campaign=null&utm_content=49220815g",
          "type": "icon",
          "name": "即梦AI",
          "src": "https://files.codelife.cc/icons/jimeng.jianying.png",
          "backgroundColor": "",
          "id": "UWLmg2Yx-qtK-sBy5s_S55085",
          "view": 1
        },
        {
          "id": "_eI8j9iioqb5gTE4vP1mx2266",
          "url": "https://uiverse.io/tooltips",
          "name": "UI",
          "src": "",
          "type": "text",
          "iconText": "UI",
          "backgroundColor": "transparent",
          "view": 2
        },
        {
          "id": "79SnVQ4FEQjfycX_WqoKb6403",
          "url": "https://fontawesome.com/search?q=email&o=r",
          "name": "Awesome 中文网 – | ",
          "src": "https://files.codelife.cc/icons/5a644f673a5802727b0b3662.png",
          "type": "icon",
          "iconText": "Awe",
          "backgroundColor": "transparent",
          "view": 1
        },
        {
          "id": "27AfaPDACSt7NYV3RzvaB3842",
          "url": "http://patorjk.com/software/taag/#p=testall&f=FoGG&t=",
          "name": "Text to ASCII ",
          "src": "",
          "type": "text",
          "iconText": "艺术字",
          "backgroundColor": "#a3ddb9",
          "view": 4
        },
        {
          "url": "https://www.cloudflare.com/",
          "type": "icon",
          "name": "Cloudflare - The Web",
          "src": "https://files.codelife.cc/icons/60b9ec4dae5a9ba4024b3e17.png",
          "backgroundColor": "#ffffff",
          "id": "9WyTDJtbph7t4kvGAzOLm7014",
          "view": 6
        },
        {
          "id": "XF21XVDzoQc_Vuk72yxQR4176",
          "url": "https://dash.domain.digitalplat.org/panel/main?page=%2Fpanel%2Foverview",
          "name": "digitalplat.org",
          "src": "",
          "type": "text",
          "iconText": "",
          "backgroundColor": "#054092"
        },
        {
          "type": "text",
          "id": "S30liRtY_OSv_4B5XrCxf6507",
          "url": "https://www.spaceship.com/",
          "name": "Launch into the fu",
          "src": "",
          "iconText": "Lau",
          "backgroundColor": "#fc4548"
        },
        {
          "type": "icon",
          "id": "1mH0xRxFlls9KlTkesyXk4323",
          "url": "https://www.itdog.cn/",
          "name": "ITDOG - 在线ping_在线t",
          "src": "https://www.itdog.cn/favicon.ico",
          "iconText": "A"
        }
      ],
      "id": "2"
    },
    {
      "id": "nav_CXfTc1F_SYNV0MGfZziNd",
      "name": "学习",
      "icon": "learn",
      "children": [
        {
          "type": "icon",
          "id": "Vdtk-2pFiIG2J6t0iqwo3",
          "url": "https://passport2.chaoxing.com/login?loginType=4&fid=30528&newversion=true&refer=",
          "name": "超星",
          "src": "https://files.codelife.cc/website/5a09045da99e6317ffaae0c7.png",
          "iconText": "超星",
          "backgroundColor": "#e7c669",
          "view": 99
        },
        {
          "type": "icon",
          "id": "7a8eull4PVDiXmCw6wqR9",
          "url": "https://jwgl.cmc.edu.cn/default2.aspx",
          "name": "教务管理",
          "src": "https://files.codelife.cc/website/user_nTLkFFYWuI4VGvOIY5kJW.png",
          "iconText": "",
          "backgroundColor": "transparent",
          "view": 25
        },
        {
          "type": "text",
          "id": "dcq2bmXLhLsc23zl8WIGT",
          "url": "http://utu.cmc.utuweb.utuedu.com:9000/login",
          "name": "文献",
          "src": "",
          "iconText": "文献",
          "backgroundColor": "#f1c40f",
          "view": 35
        },
        {
          "type": "text",
          "id": "dH89zmFfAJClMMet4Z2Bi6605",
          "url": "https://vgms.fanyu.com/",
          "name": "维普毕业论文管理系统",
          "src": "",
          "iconText": "维普毕",
          "backgroundColor": "#054092",
          "view": 30
        },
        {
          "id": "f6GXYh4Vv1M1__yrV9fla6223",
          "url": "https://vpcs.fanyu.com/upload",
          "name": "查重",
          "src": "",
          "type": "text",
          "iconText": "",
          "backgroundColor": ""
        },
        {
          "type": "text",
          "id": "EdtGPL_nZv4r3wDgYYB38",
          "url": "http://cet.neea.edu.cn/xhtml1/folder/22023/595-1.htm",
          "name": "英语四、六级",
          "src": "",
          "iconText": "英语四、六级",
          "backgroundColor": "#5a81d8",
          "view": 20
        },
        {
          "type": "text",
          "id": "l4Bxj-ShvU4CFaGy5o9AH",
          "url": "https://zhenti.burningvocabulary.com/",
          "name": "英语真题在线 - Burning Voc",
          "src": "https://zhenti.burningvocabulary.com//apple-touch-icon.png",
          "iconText": "英语真",
          "backgroundColor": "#ab2e16",
          "view": 30
        },
        {
          "type": "text",
          "id": "l-Bp-4_8W3kKqwVWCR6mx",
          "url": "https://www.chinacdc.cn/",
          "name": "中国疾病预防控制中心",
          "src": "",
          "iconText": "中国疾病预防",
          "backgroundColor": "#e0deb6",
          "view": 4
        },
        {
          "type": "text",
          "id": "hOu0ovcROX916JQ9P1RLa1288",
          "url": "https://www.phsciencedata.cn/Share/",
          "name": "公共卫生科学数据中心",
          "src": "",
          "iconText": "卫生科学数据",
          "backgroundColor": "#b88a39",
          "view": 3
        },
        {
          "type": "icon",
          "id": "hOda7zGEG-SekgsuvhsM-",
          "url": "https://translate.google.cn/?sl=auto&tl=zh-CN&op=translate",
          "name": "Google翻译",
          "src": "https://files.codelife.cc/website/translate-google.svg",
          "iconText": "Goo",
          "backgroundColor": "#187a7b"
        },
        {
          "id": "hZPBS6zW7tV7cf1692raX8702",
          "url": "http://www.90tsg.com",
          "name": "90图书馆",
          "src": "https://files.codelife.cc/icons/baidu.svg",
          "type": "icon",
          "iconText": "90图",
          "backgroundColor": "#2ecc71",
          "view": 6
        },
        {
          "id": "7ylm_xvRgmnPB7dY7HEGp0255",
          "url": "https://1lib.sk/",
          "name": "图书",
          "src": "https://files.codelife.cc/user-website-icon/20241125/PXIKwV8aambaZ00nOOJW-0816.svg",
          "type": "icon",
          "iconText": "",
          "backgroundColor": "#1681ff",
          "view": 43
        },
        {
          "id": "c2a9F9itgIdphRdTDwBMn6493",
          "url": "https://sci-hub.org.cn/",
          "name": "Sci-Hub文献检索 | 科学是照亮世",
          "src": "https://sci-hub.org.cn/static/favicon-png.ico",
          "type": "text",
          "iconText": "Sci",
          "backgroundColor": "#33c5c5",
          "view": 10
        },
        {
          "id": "IydIr7q1Zjm4_pT7EqX9C9162",
          "url": "https://www.wellesu.com/",
          "name": "sci-hub",
          "src": "https://www.wellesu.com/favicon.ico",
          "type": "icon",
          "iconText": "sci",
          "backgroundColor": "#372128",
          "view": 10
        },
        {
          "id": "GyBAfrQ_I4k7TmV8HN78e6152",
          "url": "https://vpnlib.cmc.edu.cn/",
          "name": "图书馆",
          "src": "",
          "type": "text",
          "iconText": "",
          "backgroundColor": "#023373",
          "view": 4
        },
        {
          "id": "eczaoDAZEXWRvkzluqEgf9816",
          "url": "https://www.52pojie.cn/thread-1547855-1-1.html",
          "name": "spss",
          "src": "https://files.codelife.cc/icons/52pojie.svg",
          "type": "icon",
          "iconText": "吾爱破",
          "backgroundColor": "transparent",
          "view": 2
        },
        {
          "id": "mZpshyAIK6a070Dm3eYaz6654",
          "url": "https://excalidraw.com/",
          "name": "思维导图",
          "src": "https://excalidraw.com/favicon-32x32.png",
          "type": "text",
          "iconText": "Exc",
          "backgroundColor": "transparent",
          "view": 6
        },
        {
          "id": "tpsXAvTNubV8t09_Ooxg26506",
          "url": "https://www.pikaso.top/",
          "name": "皮卡搜索",
          "src": "",
          "type": "text",
          "iconText": "",
          "backgroundColor": "#c8ac70",
          "view": 1
        },
        {
          "id": "6WzIXSP6PNlloL9rli1aB7006",
          "url": "https://www.niceso.net/",
          "name": "千帆搜索 - 资源超丰富的聚合网",
          "src": "",
          "type": "text",
          "iconText": "千帆搜",
          "backgroundColor": "#c8ac70",
          "view": 1
        },
        {
          "id": "SksYYvM5BdN0TxSR-ad7g5199",
          "url": "https://yiso.fun/",
          "name": "易搜-强大的网盘搜索引擎|百度|",
          "src": "https://yiso.fun/./static/img/logo.png",
          "type": "icon",
          "iconText": "易搜-",
          "backgroundColor": "transparent",
          "view": 2
        },
        {
          "id": "51aQOgjpraFDxBXJZs13c3775",
          "url": "https://www.xuebapan.com/",
          "name": "学霸盘 - 百度网盘学习资料搜索",
          "src": "https://www.xuebapan.com/static/img/logo.png",
          "type": "icon",
          "iconText": "学霸盘",
          "backgroundColor": "transparent",
          "view": 2
        },
        {
          "id": "ogxUDiGkwnm9dHSH41z_i8027",
          "url": "https://www.iizhi.cn/",
          "name": "毕方铺-网盘资源搜索神器。",
          "src": "https://cdn.iizhi.cn/zhi/mlogo.png",
          "type": "icon",
          "iconText": "毕方铺",
          "backgroundColor": "transparent",
          "view": 2
        },
        {
          "id": "Ej4Ul4moRJR-nxNS4Z6Yh5273",
          "url": "http://www.panmeme.com/",
          "name": "小白盘",
          "src": "",
          "type": "text",
          "iconText": "",
          "backgroundColor": "transparent",
          "view": 1
        },
        {
          "id": "tNpr8OSMzQOq4tVZjoIMo0908",
          "url": "https://www.xiaobaipan.com/",
          "name": "小白盘",
          "src": "https://files.codelife.cc/icons/5b989643e96f9b1f8315d707.png",
          "type": "icon",
          "iconText": "小白盘",
          "backgroundColor": "transparent",
          "view": 1
        },
        {
          "id": "MALbT0pn56CFKojtgvVxM1857",
          "url": "https://www.pearson.com/en-us/pearsonplus/search.html/Engineering",
          "name": "皮尔森",
          "src": "https://www.pearson.com/apps/settings/wcm/designs/global-store/pearsonplus/favicon.ico",
          "type": "text",
          "iconText": "ISB",
          "backgroundColor": "transparent"
        }
      ]
    },
    {
      "name": "tool",
      "icon": "code",
      "children": [
        {
          "id": "bpyMy3KIcyQtc0eso6Y9J6825",
          "url": "https://dplayer.diygod.dev/zh/guide.html#bilibili-%E5%BC%B9%E5%B9%95",
          "name": "指南 | DPlayer",
          "src": "https://dplayer.diygod.dev/logo.png",
          "type": "icon",
          "iconText": "指南 ",
          "backgroundColor": "transparent",
          "view": 20
        },
        {
          "id": "op4bghUeRJks8EtxG2wKa3598",
          "url": "https://artplayer.org/document/#%E4%BD%BF%E7%94%A8",
          "name": "安装使用 | Artplayer",
          "src": "https://artplayer.org/document/favicon.ico",
          "type": "icon",
          "iconText": "安装使",
          "backgroundColor": "transparent",
          "view": 12
        },
        {
          "type": "icon",
          "id": "ugptAw0HA5x_sfXVtGyZ82075",
          "url": "https://codebglh.github.io/",
          "name": "视频解析播放器",
          "src": "https://files.codelife.cc/user-website-icon/20221122/6RHeY7XtPEjeopXF4b3eq1217.png",
          "iconText": "视频解",
          "backgroundColor": "transparent",
          "view": 93
        },
        {
          "name": "渐变色",
          "component": "webGradients",
          "backgroundColor": "#fff",
          "type": "icon",
          "insetType": "iframe",
          "src": "https://files.codelife.cc/tools-icon/webGradients.svg",
          "size": "1x1",
          "id": "7MSI9WeUFMOefjYDT43_G0899",
          "view": 12
        },
        {
          "url": "https://wallhaven.cc/",
          "type": "icon",
          "name": "Wallhaven",
          "src": "https://files.codelife.cc/icons/wallhave.svg",
          "backgroundColor": "#0c4061",
          "id": "ZmNL19cCsMl3Z7B99FlgO5696",
          "view": 14
        },
        {
          "id": "dufdf5CQ1wBa3uAJyrdXW4189",
          "url": "https://mvnrepository.com/",
          "name": "Maven 仓库",
          "src": "https://files.codelife.cc/icons/60b9eb35ae5a9ba4024b3a9a.png",
          "type": "icon",
          "iconText": "Mav",
          "backgroundColor": "#ffffff",
          "view": 11
        },
        {
          "name": "加密工具",
          "backgroundColor": "#fff",
          "component": "encryptionTools",
          "type": "icon",
          "insetType": "iframe",
          "src": "https://files.codelife.cc/tools-icon/encryptionTools.svg",
          "size": "1x1",
          "id": "cEE3gy__Me7hIqDgzIH7x8653",
          "view": 21
        },
        {
          "id": "lsqHMrh3feDBNV8UeR5f_0605",
          "url": "https://www.freeconvert.com/zh",
          "name": "图片转化",
          "src": "https://www.freeconvert.com/favicon.ico",
          "type": "icon",
          "iconText": "视频到",
          "backgroundColor": "transparent",
          "view": 1
        },
        {
          "id": "4WDMbS3-L1F_lLhZucx-y2727",
          "url": "https://github.com/OdysseusYuan/LKY_OfficeTools/releases/tag/v1.3.0",
          "name": "office",
          "src": "https://files.codelife.cc/icons/6ca1ae6688979383.png",
          "type": "icon",
          "iconText": "Web",
          "backgroundColor": "transparent",
          "view": 1
        },
        {
          "id": "--1_CLpmwLb_v-pswQ67w5934",
          "url": "https://www.qijishow.com/",
          "name": "奇迹秀",
          "src": "https://files.codelife.cc/icons/60b9f0baae5a9ba4024b4c49.png",
          "type": "icon",
          "iconText": "绘画艺",
          "backgroundColor": "#000000",
          "view": 2
        },
        {
          "id": "Lp9FA1YJrC5na0U2nzO4J6347",
          "url": "https://birdfont.org/",
          "name": "字体设计",
          "src": "https://files.codelife.cc/user-website-icon/20250130/XcOOMAnvMMTEikWv1tBoJ0327.png",
          "type": "icon",
          "iconText": "Bir",
          "backgroundColor": "transparent",
          "view": 2
        }
      ],
      "id": "nav_2h-OA1jCHtKoY-A5mywsM6523"
    },
    {
      "id": "nav_k2b7ZixDW4Cd3l0I06Fkg6818",
      "name": "黑苹果",
      "icon": "code",
      "children": [
        {
          "type": "icon",
          "id": "44bedMrWf-Dz5bIwFK0Dg9275",
          "url": "https://github.com/USBToolBox/tool/releases",
          "name": "USBToolBox",
          "src": "https://files.codelife.cc/icons/github.svg",
          "iconText": "Rel",
          "backgroundColor": "#000",
          "view": 12
        },
        {
          "type": "icon",
          "id": "vXuQm01m7rVOBPJ7IBQsi5139",
          "url": "https://github.com/ic005k/OCAuxiliaryTools/releases",
          "name": "OCAuxiliaryTools",
          "src": "https://files.codelife.cc/icons/github.svg",
          "iconText": "Rel",
          "backgroundColor": "#7dac68",
          "view": 7
        },
        {
          "type": "icon",
          "id": "xpmM47zoR8L4mumBUTXKh0112",
          "url": "https://github.com/oldj/SwitchHosts/releases",
          "name": "SwitchHosts",
          "src": "https://files.codelife.cc/icons/github.svg",
          "iconText": "Rel",
          "backgroundColor": "#c82c34",
          "view": 1
        },
        {
          "type": "icon",
          "id": "Myn6JHvlMvVzZq0CfB2Xx8672",
          "url": "https://github.com/corpnewt/ProperTree",
          "name": "ProperTree",
          "src": "https://files.codelife.cc/icons/github.svg",
          "iconText": "cor",
          "backgroundColor": "#c8ac70",
          "view": 4
        },
        {
          "type": "icon",
          "id": "fHH6kOdpUdyNCUiUCo0tm",
          "url": "https://dortania.github.io/OpenCore-Install-Guide/",
          "name": "OpenCore Install Gui",
          "src": "https://files.codelife.cc/website/user_y9KLPuu1TjTNolWmxekoz.png",
          "iconText": "Ope",
          "backgroundColor": "transparent",
          "view": 34
        },
        {
          "id": "caojF0srUjyMEeLKmbt0B9572",
          "url": "https://fliqlo.com/",
          "name": "Fliqlo - Flip Clock ",
          "src": "https://fliqlo.com/images/favicon.ico",
          "type": "icon",
          "iconText": "Fli",
          "backgroundColor": "#054092",
          "view": 3
        },
        {
          "id": "tdo61Kc7dZo6UXPfcCIsb4253",
          "url": "https://shop.pockyt.io/pc/back?orderNo=AEHN3DPFAYYMGJ&source=pc",
          "name": "Pockyt Shop",
          "src": "https://oss.yuansfer.com/svg/logo/pockyt-logo-192.svg",
          "type": "icon",
          "iconText": "Poc",
          "backgroundColor": "transparent",
          "view": 4
        },
        {
          "id": "wN3bAwAQ8jHdoY-1yRIAb5628",
          "url": "https://macwk.com.cn/",
          "name": "MacWk媒体工具 - 精品ma",
          "src": "https://macwk.com.cn/favicon-32x32.ico",
          "type": "text",
          "iconText": "Mac",
          "backgroundColor": "#FFFFFF",
          "view": 15
        },
        {
          "id": "NXkKq8g_CiVoSLTJ4ATUq8043",
          "url": "https://rutracker.org/forum/index.php",
          "name": "RuTracker",
          "src": "https://files.codelife.cc/website/5a5f4cba9910c87294c2a12c.png",
          "type": "icon",
          "iconText": "RuT",
          "view": 2
        },
        {
          "id": "pDIilp1zgbWHIb850Nov81793",
          "url": "https://byrut.org/",
          "name": "Cкачать игры на ",
          "src": "https://byrut.org/favicon-120x120.png",
          "type": "text",
          "iconText": "Cка",
          "backgroundColor": "transparent"
        },
        {
          "id": "snPlOAtzvOfg76eSfQeTk5547",
          "url": "https://jcnrrzydsb4q.feishu.cn/docx/GUUGd6kTgo0ZRAxgFKbcOxxHnde",
          "name": "anki",
          "src": "",
          "type": "text",
          "iconText": "anki软件",
          "backgroundColor": "#a3ddb9"
        }
      ]
    },
    {
      "id": "nav_Hr5jxjNFJZ3-SlX-dK32A5563",
      "name": "海阔源",
      "icon": "code",
      "children": [
        {
          "id": "-roXgSQgBem9fzgo3_Dsl2093",
          "url": "https://yang-1989.eu.org/",
          "name": "电视源",
          "src": "",
          "type": "text",
          "iconText": "电视源",
          "backgroundColor": "transparent",
          "view": 9
        },
        {
          "id": "NS4FRMfJ289HoGKzqDQg84795",
          "url": "https://live.fanmingming.com/tv/m3u/ipv6.m3u",
          "name": "范明明电视源",
          "src": "",
          "type": "text",
          "iconText": "",
          "backgroundColor": "#f1c40f",
          "view": 8
        },
        {
          "id": "xlaMLNkZR7F9D7JP4I5kc7355",
          "url": "http://tvbox.clbug.com/",
          "name": "TVBox官网",
          "src": "http://tvbox.clbug.com/app_icon.png",
          "type": "icon",
          "iconText": "TVB",
          "backgroundColor": "transparent",
          "view": 4
        },
        {
          "id": "iVH2EFmog-go5L7Z4bbDF0792",
          "url": "https://www.yckceo.com/",
          "name": "源仓库",
          "src": "https://files.codelife.cc/user-website-icon/20250108/RJHLkeMLUrzdJ-MZK7hya5217.png",
          "type": "icon",
          "iconText": "源仓库",
          "backgroundColor": "#054092",
          "view": 7
        },
        {
          "id": "EI7emdrcuvUBr3GCIyi-f4605",
          "url": "https://github.com/aoaostar/legado",
          "name": "书源",
          "src": "https://files.codelife.cc/icons/6ca1ae6688979383.png",
          "type": "icon",
          "iconText": "Web",
          "backgroundColor": "#a3ddb9",
          "view": 5
        },
        {
          "id": "HMNmO9W4VCCNfdFt6XsYD9816",
          "url": "https://ysqbbs.com/portal.php",
          "name": "源社区-门户 -  Powere",
          "src": "",
          "type": "text",
          "iconText": "源社区",
          "backgroundColor": "#4b3c36",
          "view": 10
        }
      ]
    },
    {
      "id": "nav_tAX-hLfXVk8PqOUySHjqJ3273",
      "name": "life",
      "icon": "fitness",
      "children": [
        {
          "id": "mlRuw_SvIFKySwht8zOOI9417",
          "url": "https://www.16personalities.com/ch",
          "name": "免费性格测试、类型描述、人际关系",
          "src": "https://www.16personalities.com/static/images/favicons/favicon-96x96.png",
          "type": "icon",
          "iconText": "免费性",
          "backgroundColor": "#FFFFFF",
          "view": 6
        },
        {
          "id": "-_vlsIIkWi8z_htX4XEtl2657",
          "url": "http://192.168.1.4:5244",
          "name": "本机alist网盘",
          "src": "https://files.codelife.cc/user-website-icon/20240712/3KF5FeqM8KeEXnizlmVny4396.png",
          "type": "icon",
          "iconText": "",
          "backgroundColor": "transparent",
          "view": 13
        },
        {
          "id": "N_xiaqbqI_4G6pZbJrcAg2725",
          "url": "https://gravatar.com/shyxnok",
          "name": "Gravatar ",
          "src": "https://files.codelife.cc/website/59f0bdb82cd2d96916f0f8f3.png",
          "type": "icon",
          "iconText": "Gra",
          "backgroundColor": "transparent",
          "view": 2
        },
        {
          "id": "G9Za4G1K0ggibVugIN9d84424",
          "url": "https://shyxnok.xyz/",
          "name": "ShyXnok",
          "src": "https://shyxnok.xyz/res/img/favicon.png",
          "type": "icon",
          "iconText": "Shy",
          "backgroundColor": "transparent"
        }
      ]
    },
    {
      "id": "nav_ZWbmS3iz4zczWKkngpVw_0202",
      "name": "work",
      "icon": "tool",
      "children": [
        {
          "id": "UFoy4uPjYFPed8Sfd29Ot4439",
          "url": "http://www.dzrsks.com.cn/",
          "name": "达州市考试网",
          "src": "https://files.codelife.cc/user-website-icon/20240511/b_xoX8nkeRRXOwwB-UtZm0067.png",
          "type": "icon",
          "iconText": "",
          "backgroundColor": "#a3ddb9",
          "view": 186
        },
        {
          "id": "jcBWkCVDe4to02Fw80W3z5134",
          "url": "http://zp.cpta.com.cn/tyzpwb/stulogout/logout.htm?jsessionid=",
          "name": "全国人事网",
          "src": "",
          "type": "text",
          "iconText": "全国",
          "backgroundColor": "#c82c34",
          "view": 26
        },
        {
          "id": "HnWpMVuG0J-y2lUp3z44W3476",
          "url": "https://ggfw.rlsbj.cq.gov.cn/wsbm/ksbm/bkui/business/webcenter/home/cqksNotice.html?xmtype=04",
          "name": "重庆考试",
          "src": "",
          "type": "text",
          "iconText": "重庆",
          "backgroundColor": "#372128",
          "view": 18
        },
        {
          "id": "KBAWyRS0MwQXfbxHoxr4I1522",
          "url": "https://www.fenbi.com/spa/tiku/guide/catalog/ylzp?prefix=ylzp",
          "name": "粉笔机考练习",
          "src": "https://files.codelife.cc/icons/www.fenbi.com.svg",
          "type": "icon",
          "iconText": "粉笔机",
          "backgroundColor": "#fff",
          "view": 53
        },
        {
          "id": "bjYoCf1qaNhuosG2oCXuJ9603",
          "url": "https://www.scpta.com.cn/qssydwzt.html",
          "name": "四川省",
          "src": "",
          "type": "text",
          "iconText": "考试",
          "backgroundColor": "#c82c34",
          "view": 5
        },
        {
          "id": "UNnd7Z4h99R5iMKy55OrE6676",
          "url": "https://www.sczwfw.gov.cn/",
          "name": "注册",
          "src": "",
          "type": "text",
          "iconText": "注册",
          "backgroundColor": "transparent",
          "view": 2
        },
        {
          "id": "kNozBzaO-B1jl0aq6xeXA4471",
          "url": "https://mp.weixin.qq.com",
          "name": "微信公众平台",
          "src": "https://files.codelife.cc/icons/mp-weixin-qq.svg",
          "type": "icon",
          "iconText": "微信公",
          "backgroundColor": "#fff",
          "view": 4
        }
      ]
    },
    {
      "id": "nav_L4-BLb3P3Y5XRVKwfT0dU2649",
      "name": "营养",
      "icon": "learn",
      "children": [
        {
          "id": "CfXmkT_YGgx2mQ0i8EGHn2092",
          "url": "https://nutrimp.chinanutri.cn/index.html#/login",
          "name": "营养测评",
          "src": "https://nutrimp.chinanutri.cn/favicon.ico",
          "type": "icon",
          "iconText": "",
          "backgroundColor": "transparent",
          "view": 8
        },
        {
          "id": "N7N_VXR9bjMNOG5ltqIV33336",
          "url": "https://nlc.chinanutri.cn/fq/",
          "name": "食物营养成分查询平台",
          "src": "https://nlc.chinanutri.cn/images/favarite_icon.png",
          "type": "icon",
          "iconText": "食物营",
          "backgroundColor": "transparent",
          "view": 6
        }
      ]
    },
    {
      "id": "nav_iuSoDWq4LBrqK-e_om48t0573",
      "name": "装机",
      "icon": "tool",
      "children": [
        {
          "id": "qgQ0NP2TqGsrbqkMtDr_e2893",
          "url": "https://www.drivergenius.com/",
          "name": "驱动",
          "src": "",
          "type": "text",
          "iconText": "驱动",
          "backgroundColor": "transparent",
          "view": 3
        },
        {
          "id": "0TRlzq4J48QzF1yNF_YQ_3925",
          "url": "http://www.szxinmeng.com.cn/Uploads/file/202403/20240313142240_2694.zip",
          "name": "鼠标软件",
          "src": "",
          "type": "text",
          "iconText": "新盟",
          "backgroundColor": "",
          "view": 4
        },
        {
          "id": "EzgTIwI5F9ti4eZqcVkPd6668",
          "url": "https://www.ruancang.net/",
          "name": "软仓 | RuanCang.Ne",
          "src": "https://www.ruancang.net/wp-content/uploads/attachment/2025/04/20250428035000_cang-yuan-512.png",
          "type": "icon",
          "iconText": "软仓 ",
          "backgroundColor": "transparent"
        }
      ]
    },
    {
      "id": "nav_P1uGGiGcu3Dowf0md42U64678",
      "name": "design",
      "icon": "Darw",
      "children": [
        {
          "id": "RwmCQPeYdO0JyjULdvUkL8063",
          "url": "https://www.ccopyright.com.cn/",
          "name": "软著登记",
          "src": "https://files.codelife.cc/website/5b15f52b7e1e6443a74fe2da.png",
          "type": "icon",
          "iconText": "软著登",
          "view": 1
        },
        {
          "id": "SHvDKd0H-H6EhzBvyfHfh1134",
          "url": "https://github.com/fontforge/fontforge",
          "name": "开源",
          "src": "https://files.codelife.cc/user-website-icon/20250130/vwlsXKc4HMkIGeHalVaJF0478.png",
          "type": "icon",
          "iconText": "Web",
          "backgroundColor": "transparent",
          "view": 3
        },
        {
          "id": "fFn3mwD8FLWzezDZFohEG4219",
          "url": "https://fontforge.org/en-US/",
          "name": "字体设计",
          "src": "https://files.codelife.cc/user-website-icon/20250130/luygQM_nUI7ZdsNoRvXvG9095.png",
          "type": "icon",
          "iconText": "",
          "backgroundColor": "transparent",
          "view": 3
        },
        {
          "id": "3f7pBHcZ8mpVBtD57wqPs2637",
          "url": "https://square.github.io/okhttp/5.x/okhttp/okhttp3/",
          "name": "okhttp3",
          "src": "",
          "type": "text",
          "iconText": "ok文档",
          "backgroundColor": "transparent"
        },
        {
          "id": "xcvTKWPAsyFHn_iRlmzcQ3688",
          "url": "https://www.hackingwithswift.com/",
          "name": "swfit",
          "src": "",
          "type": "text",
          "iconText": "",
          "backgroundColor": "#c82c34",
          "view": 1
        },
        {
          "id": "nsBZ6WgVXnG4N7cikFkH-9642",
          "url": "https://www.youtube.com/c/PaulHudson",
          "name": "YouTube",
          "src": "https://files.codelife.cc/icons/youtube.svg",
          "type": "icon",
          "iconText": "You",
          "backgroundColor": "#ff0000"
        },
        {
          "id": "EQY5q9c41h2OIOLFdxymy5743",
          "url": "https://www.jlc.com/",
          "name": "PCB打样-PCB报价-专业PC",
          "src": "https://www.jlc.com/portal/favicon.ico",
          "type": "icon",
          "iconText": "PCB",
          "backgroundColor": "transparent"
        }
      ]
    },
    {
      "id": "nav_lmJGXvoZGmxc21uyKN4Gu0953",
      "name": "SD",
      "icon": "Photo",
      "children": [
        {
          "id": "AjuHClYnoJZeZ9O5Ef0ER8996",
          "url": "https://www.liblib.art/",
          "name": "LiblibAI-哩布哩布AI ",
          "src": "https://files.codelife.cc/user-website-icon/20250623/Xmj8YhHEuWcMqlQhFejvB5754.svg",
          "type": "icon",
          "iconText": "Lib",
          "backgroundColor": "transparent",
          "view": 12
        },
        {
          "id": "wV6_ypBjuFT-NP2irFtyG7897",
          "url": "https://civitai.com/",
          "name": "civita",
          "src": "https://files.codelife.cc/user-website-icon/20250623/L5dI_V4wcq_1lCpKjvFFh5504.svg",
          "type": "icon",
          "iconText": "civita",
          "backgroundColor": "transparent",
          "view": 25
        },
        {
          "id": "69r3al5uDrUXqVodg_B8c0955",
          "url": "https://huggingface.co",
          "name": "模型站",
          "src": "https://files.codelife.cc/user-website-icon/20250623/jfoD_ntrG9MZK7nu6oZf25937.svg",
          "type": "icon",
          "iconText": "",
          "backgroundColor": "transparent",
          "view": 3
        },
        {
          "id": "DgMOr0S-FGRfnt6CBSAt59657",
          "url": "https://hf-mirror.com/",
          "name": "HF-Mirror",
          "src": "https://files.codelife.cc/user-website-icon/20250623/VSz3Gc-x3uoALYfGgrn6F4365.svg",
          "type": "icon",
          "iconText": "HF-",
          "backgroundColor": "transparent",
          "view": 3
        },
        {
          "id": "Jhyvh-_dtTr41NfTiCeyr9092",
          "url": "https://spell.novelai.dev/",
          "name": "Stable Diffusion",
          "src": "https://files.codelife.cc/user-website-icon/20250623/_GMtCXgVnlOsS_2MF1Lgw6655.svg",
          "type": "icon",
          "iconText": "Sta",
          "backgroundColor": "transparent",
          "view": 11
        },
        {
          "id": "RFMlqn5M5HI57n9ImJ5S13113",
          "url": "https://comfyui-wiki.com/zh",
          "name": "ComfyUI Wiki 百科在",
          "src": "https://comfyui-wiki.com/favicon.ico",
          "type": "text",
          "iconText": "Com",
          "backgroundColor": "transparent",
          "view": 1
        },
        {
          "id": "O9Fr20_CNKdJZlkv8FUfm0386",
          "url": "https://tags.novelai.dev/",
          "name": "提示词",
          "src": "https://files.codelife.cc/user-website-icon/20250623/8tUIZDUGWu4ilu5kvS12f8118.svg",
          "type": "icon",
          "iconText": "",
          "backgroundColor": "",
          "view": 4
        },
        {
          "id": "FdvV05WQFUzIBLujnBAC-8914",
          "url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRa2HjzocajlsPLH1e5QsJumnEShfooDdeHqcAuxjPKBIVVTHbOYWASAQyfmrQhUtoZAKPri2s_tGxx/pubhtml#",
          "name": "魔法书",
          "src": "https://files.codelife.cc/user-website-icon/20250623/KnulHyWnZAWmmh1fGiqP34864.svg",
          "type": "icon",
          "iconText": "Goo",
          "backgroundColor": "transparent",
          "view": 2
        },
        {
          "id": "0tqx1b9eyg6eAXkZZyab-7664",
          "url": "http://127.0.0.1:8188/",
          "name": "comfyUI",
          "src": "https://files.codelife.cc/user-website-icon/20250627/Sbu1qE4Y7RdVgb84gitTW0147.svg",
          "type": "icon",
          "iconText": "",
          "backgroundColor": "transparent",
          "view": 27
        },
        {
          "url": "https://www.doubao.com?channel=itab2&source=hw_db_itab&type=tab&theme=wangzjh",
          "type": "icon",
          "name": "豆包-你的AI朋友",
          "src": "https://files.codelife.cc/icons/doubao.com.webp",
          "backgroundColor": "#ffffff",
          "id": "buU4X6njomFn89PU2xErP4606",
          "view": 1
        },
        {
          "url": "https://chat.deepseek.com/",
          "type": "icon",
          "name": "DeepSeek",
          "src": "https://chat.deepseek.com/favicon.svg",
          "backgroundColor": "#fffaf5",
          "id": "FnT2qdEDpQpsQbWXnu_yO2275",
          "view": 2,
          "iconText": "Dee"
        }
      ]
    },
    {
      "id": "nav_zYFbvlbKiLG4NG4qanhSX9682",
      "name": "无人机",
      "icon": "Plane",
      "children": [
        {
          "id": "PL-0-KKK4aNsWvmKJmJv27766",
          "url": "https://oscarliang.com/fpv-shopping-list/",
          "name": "The Ultimate FPV",
          "src": "https://oscarliang.com/wp-content/uploads/2021/06/favicon.ico",
          "type": "icon",
          "iconText": "The",
          "backgroundColor": "transparent",
          "view": 1
        }
      ]
    }
  ],
  "notes": [
    {
      "id": "1",
      "title": "iTab操作小技巧",
      "content": "1. 切换搜索引擎: 点击搜索框左侧图标可快速切换搜索引擎\n2. 快速翻译: 点击搜索框联想列表第一项可快速翻译文本\n3. 右键菜单: 在桌面空白处点击右键可快速添加图标、切换壁纸、设置、备份等操作\n4. 极简模式: 点击标签页时间快速切换到极简模式\n5. 动态壁纸: 点击【i壁纸】 打开壁纸应用 - 动态壁纸,选择壁纸",
      "fixed": false,
      "ct": 1634357234543
    }
  ],
  "todo": []
}
      // const a=json.stringify(pluginData);

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