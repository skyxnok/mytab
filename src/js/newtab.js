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

// 可选：点击句子刷新
document.getElementById('hitokoto-container').addEventListener('click', fetchHitokoto);


// 在 DOMContentLoaded 中初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchHitokoto();
});

async function applyWallpaper() {
    const res = await chrome.storage.local.get(['bgMode', 'wallpaper']);
    const bgElement = document.querySelector('.wallpaper');
    
    if (res.bgMode === 'random') {
        // 如果是随机模式，每次打开新标签页都换一张
        const randomUrl = `https://source.unsplash.com/random/1920x1080?nature,vibe&t=${Date.now()}`;
        bgElement.style.backgroundImage = `url(${randomUrl})`;
    } else if (res.wallpaper) {
        // 如果是固定模式
        bgElement.style.backgroundImage = `url(${res.wallpaper})`;
    } else {
        // 默认壁纸
        bgElement.style.backgroundImage = `url('https://picsum.photos/1920/1080')`;
    }
}

// 在 DOMContentLoaded 中调用
document.addEventListener('DOMContentLoaded', () => {
    applyWallpaper();
    // ... 其他初始化函数
});
