

// 获取一言数据的函数
async function fetchHitokoto() {
    const hitokotoElement = document.getElementById('hitokoto-text');
    const url = 'https://txt.201562.xyz/?type=All&encode=json';

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            text = data.yiyan
            let from = data.from
            hitokotoElement.innerText = `「  ${text} 」- ${from} - `;
        } else {
            hitokotoElement.innerText = "保持热爱，奔赴山海。"; // 失败时的备选
        }
    } catch (err) {
        console.error('获取一言失败:', err);
        hitokotoElement.innerText = "此时无声胜有声。";
    }
}
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    // 获取当前选中的搜索引擎
    const engineIcon = document.getElementById('engine-icon');
    const engineUrl = getEngineUrl(engineIcon.alt); // 假设有一个函数根据图标获取对应搜索引擎的URL

    // 构造搜索链接并跳转
    const searchUrl = `${engineUrl}${encodeURIComponent(query)}`;
    window.location.href = searchUrl;
}



function handleEncrypt(data) {
    try {
        const jsonBytes = byteTools.jsonObjToUint8Array(data);
        return TabTools.Json2Tab(jsonBytes);
    } catch (e) {
        console.error(e);
        alert("加密失败：" + e.message);
    }
}

function handleDecrypt(data) {
    try {
        const decryptResult = TabTools.Tab2Json(data);
        return byteTools.uint8Array2JsonObj(decryptResult.jsonBytes);
    } catch (e) {
        console.error(e);
        alert("解密失败：" + e.message);
    }
}

// 在 DOMContentLoaded 中初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchHitokoto();
    // 可选：点击句子刷新
    document.getElementById('hitokoto-container').addEventListener('click', fetchHitokoto);
    document.getElementById('search-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});
    document.getElementById('search-submit').addEventListener('click', function() {performSearch();});
    document.getElementById('arrow-down').addEventListener('click', function() {

    });
});

function showTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const timeStr = `${h}:${m}:${s}`;

  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  document.getElementById('time').innerText = timeStr;
  document.getElementById('date').innerText = dateStr;
}

// 立即显示一次
showTime();
// 每秒刷新
setInterval(showTime, 1000);

