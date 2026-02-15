
/**
 * 配置管理类 - 提供完整的增删改查功能
 */
class ConfigManager {
    constructor() {
        this.storageKey = 'app_config';
    }

    /**
     * 创建/更新配置（增/改）
     * @param {string} key - 配置键名
     * @param {*} value - 配置值
     * @returns {Promise<boolean>}
     */
    async set(key, value) {
        return new Promise((resolve, reject) => {
            const data = { [key]: value };
            chrome.storage.sync.set(data, () => {
                if (chrome.runtime.lastError) {
                    console.error('保存配置失败:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    console.log(`配置已保存: ${key}`);
                    resolve(true);
                }
            });
        });
    }

    /**
     * 批量设置配置
     * @param {Object} configObj - 配置对象
     * @returns {Promise<boolean>}
     */
    async setMultiple(configObj) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set(configObj, () => {
                if (chrome.runtime.lastError) {
                    console.error('批量保存配置失败:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    console.log('批量配置已保存:', Object.keys(configObj));
                    resolve(true);
                }
            });
        });
    }

    /**
     * 读取配置（查）
     * @param {string|Array<string>} keys - 单个键名或键名数组
     * @returns {Promise<Object>}
     */
    async get(keys) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(keys, (items) => {
                if (chrome.runtime.lastError) {
                    console.error('读取配置失败:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(items);
                }
            });
        });
    }

    /**
     * 获取单个配置值
     * @param {string} key - 配置键名
     * @param {*} defaultValue - 默认值
     * @returns {Promise<*>}
     */
    async getOne(key, defaultValue = null) {
        const result = await this.get([key]);
        return result[key] !== undefined ? result[key] : defaultValue;
    }

    /**
     * 删除配置（删）
     * @param {string|Array<string>} keys - 单个键名或键名数组
     * @returns {Promise<boolean>}
     */
    async remove(keys) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.remove(keys, () => {
                if (chrome.runtime.lastError) {
                    console.error('删除配置失败:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    const keyList = Array.isArray(keys) ? keys.join(', ') : keys;
                    console.log(`配置已删除: ${keyList}`);
                    resolve(true);
                }
            });
        });
    }

    /**
     * 清空所有配置
     * @returns {Promise<boolean>}
     */
    async clear() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.clear(() => {
                if (chrome.runtime.lastError) {
                    console.error('清空配置失败:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    console.log('所有配置已清空');
                    resolve(true);
                }
            });
        });
    }

    /**
     * 获取所有配置
     * @returns {Promise<Object>}
     */
    async getAll() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, (items) => {
                if (chrome.runtime.lastError) {
                    console.error('获取所有配置失败:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(items);
                }
            });
        });
    }

    /**
     * 检查配置是否存在
     * @param {string} key - 配置键名
     * @returns {Promise<boolean>}
     */
    async has(key) {
        const result = await this.get([key]);
        return result.hasOwnProperty(key);
    }

    /**
     * 监听配置变化
     * @param {Function} callback - 回调函数 (changes, areaName) => {}
     */
    onChanged(callback) {
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'sync') {
                callback(changes, areaName);
            }
        });
    }
}

// 创建全局配置管理实例
const config = new ConfigManager();

// ========== 兼容旧方法的封装 ==========

/**
 * 保存 GitHub 配置（兼容旧代码）
 * @param {string} token - GitHub Token
 * @param {string} gistId - Gist ID
 */
async function saveSettings(token, gistId) {
    await config.setMultiple({
        githubToken: token,
        gistId: gistId
    });
    console.log('配置已保存');
}

/**
 * 获取 GitHub 配置（兼容旧代码）
 * @returns {Promise<Object>}
 */
async function getSettings() {
    return await config.get(['githubToken', 'gistId']);
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

// 在 DOMContentLoaded 中初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchHitokoto();
});
