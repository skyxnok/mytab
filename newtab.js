// 获取书签并显示
function renderBookmarks() {
    chrome.bookmarks.getTree((tree) => {
        const list = document.getElementById('bookmark-list');
        // 递归遍历书签树的简单示例
        processNodes(tree[0].children);
        console.log(list);
    });
}

function processNodes(nodes) {
    const container = document.getElementById('bookmark-list');
    nodes.forEach(node => {
        if (node.url) { // 如果是链接
            const div = document.createElement('div');
            div.className = 'bookmark-item';
            div.innerHTML = `<a href="${node.url}">${node.title || node.url}</a>`;
            container.appendChild(div);
        }
        if (node.children) { // 如果是文件夹
            processNodes(node.children);
        }
    });
}
// 保存配置到 Chrome 存储
function saveSettings(token, gistId) {
    chrome.storage.sync.set({
        githubToken: token,
        gistId: gistId
    }, () => {
        console.log('配置已保存');
    });
}

// 获取配置
function getSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['githubToken', 'gistId'], (items) => {
            resolve(items);
        });
    });
}
async function pushBookmarksToGithub() {
    const settings = await getSettings();
    if (!settings.githubToken || !settings.gistId) {
        alert('请先在设置中配置 Token 和 Gist ID');
        return;
    }

    // 1. 获取本地全量书签树
    const bookmarkTree = await new Promise(resolve => chrome.bookmarks.getTree(resolve));
    const content = JSON.stringify(bookmarkTree, null, 2);

    // 2. 调用 GitHub API 更新 Gist
    const response = await fetch(`https://api.github.com/gists/${settings.gistId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${settings.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                "bookmarks.json": { "content": content }
            }
        })
    });

    if (response.ok) {
        alert('同步成功！书签已上传至 GitHub');
    } else {
        const err = await response.json();
        console.error(err);
        alert('同步失败: ' + err.message);
    }
}

async function pullBookmarksFromGithub() {
    const settings = await getSettings();
    const response = await fetch(`https://api.github.com/gists/${settings.gistId}`, {
        headers: { 'Authorization': `token ${settings.githubToken}` }
    });

    const data = await response.json();
    const remoteContent = data.files["bookmarks.json"].content;
    const remoteBookmarks = JSON.parse(remoteContent);

    // 警告：以下操作会清除本地书签并替换
    // 实际开发中建议增加“确认”弹窗
    await clearLocalBookmarks();
    await importBookmarks(remoteBookmarks[0].children);

    location.reload(); // 刷新页面查看新书签
}

// 辅助函数：递归导入书签
async function importBookmarks(nodes, parentId = '1') {
    for (const node of nodes) {
        if (node.url) {
            await chrome.bookmarks.create({ parentId, title: node.title, url: node.url });
        } else if (node.children) {
            const folder = await chrome.bookmarks.create({ parentId, title: node.title });
            await importBookmarks(node.children, folder.id);
        }
    }
}
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



function processNodes(nodes) {
    const grid = document.getElementById('bookmark-grid');
    nodes.forEach(node => {
        if (node.url) {
            const domain = new URL(node.url).hostname;
            const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

            const anchor = document.createElement('a');
            anchor.className = 'icon-item';
            anchor.href = node.url;
            anchor.innerHTML = `
                <div class="icon-img">
                    <img src="${iconUrl}" alt="">
                </div>
                <span class="icon-name">${node.title.substring(0, 6)}</span>
            `;
            grid.appendChild(anchor);
        }
        // 如果需要显示文件夹，可以在这里递归处理或点击进入分类
    });
}

// // 搜索引擎配置
// const engines = {
//     google: {
//         name: 'Google',
//         url: 'https://www.google.com/search?q=',
//         icon: 'https://www.google.com/favicon.ico'
//     },
//     baidu: {
//         name: 'Baidu',
//         url: 'https://www.baidu.com/s?wd=',
//         icon: 'https://www.baidu.com/favicon.ico'
//     },   
//      bing: {
//         name: 'Bing',
//         url: 'https://www.bing.com/search?q=',
//         icon: 'https://www.bing.com/favicon.ico'
//     }
// };

// let currentEngine = 'google'; // 默认引擎

// function initSearch() {
//     const input = document.getElementById('search-input');
//     const engineIcon = document.getElementById('engine-icon');

//     // 1. 监听回车键
//     input.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter') {
//             const query = input.value.trim();
//             if (query) {
//                 // 如果输入的是 URL，直接跳转
//                 if (query.startsWith('http') || query.includes('.com')) {
//                     window.location.href = query.startsWith('http') ? query : `https://${query}`;
//                 } else {
//                     // 否则使用搜索引擎
//                     window.location.href = engines[currentEngine].url + encodeURIComponent(query);
//                 }
//             }
//         }
//     });

//     // 2. 点击图标切换引擎
//     engineIcon.addEventListener('click', () => {
//         currentEngine = currentEngine === 'google' ? 'bing' : 'google';
//         engineIcon.src = engines[currentEngine].icon;
//         input.placeholder = `正在使用 ${engines[currentEngine].name} 搜索...`;

//         // 保存用户偏好到存储
//         chrome.storage.sync.set({ preferredEngine: currentEngine });
//     });

//     // 3. 加载用户之前的引擎偏好
//     chrome.storage.sync.get(['preferredEngine'], (res) => {
//         if (res.preferredEngine) {
//             currentEngine = res.preferredEngine;
//             engineIcon.src = engines[currentEngine].icon;
//         }
//     });
// }

// 在 DOMContentLoaded 中初始化
document.addEventListener('DOMContentLoaded', () => {
    // initSearch();
    renderBookmarks();
    fetchHitokoto();
    // ... 之前的 renderBookmarks 和 fetchHitokoto
});

// 可选：点击句子刷新
 document.getElementById('hitokoto-container').addEventListener('click', fetchHitokoto);
// 默认引擎列表
let userEngines = [
    { id: 'bing', name: '必应', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' },
    { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
    { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=', icon: 'https://www.baidu.com/favicon.ico' }
];

let currentEngineIdx = 0;

function renderEngineMenu() {
    const list = document.getElementById('engine-list');
    list.innerHTML = '';

    userEngines.forEach((engine, index) => {
        const item = document.createElement('div');
        item.className = 'engine-item';
        item.innerHTML = `
            <div class="engine-icon-wrapper">
                <img src="${engine.icon}">
            </div>
            <span>${engine.name}</span>
            <div class="delete-icon" data-index="${index}">×</div>
        `;

        // 切换引擎逻辑
        item.addEventListener('click', (e) => {
            if (e.target.className === 'delete-icon') return; // 避开删除按钮
            currentEngineIdx = index;
            updateSearchBar();
            toggleMenu(false);
        });

        // 删除逻辑
        item.querySelector('.delete-icon').addEventListener('click', (e) => {
            userEngines.splice(index, 1);
            saveAndRender();
        });

        list.appendChild(item);
    });
}

function updateSearchBar() {
    const engine = userEngines[currentEngineIdx];
    document.getElementById('engine-icon').src = engine.icon;
    document.getElementById('search-input').placeholder = `使用 ${engine.name} 搜索内容`;
}

function toggleMenu(show) {
    document.getElementById('engine-menu').classList.toggle('show', show);
    renderEngineMenu();
}

// 绑定触发事件
document.getElementById('arrow-down').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

// 添加新引擎（简单示例）
document.getElementById('add-engine').addEventListener('click', () => {
    const name = prompt("输入引擎名称:");
    const url = prompt("输入搜索链接 (用 %s 代替搜索词):");
    if (name && url) {
        userEngines.push({ 
            id: Date.now().toString(), 
            name, 
            url: url.replace('%s', ''), 
            icon: 'default_icon.png' 
        });
        saveAndRender();
    }
});

// 点击空白处关闭菜单
document.addEventListener('click', () => toggleMenu(false));

function saveAndRender() {
    chrome.storage.sync.set({ customEngines: userEngines });
    renderEngineMenu();
}