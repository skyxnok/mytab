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

/**
 * 保存 GitHub 配置（兼容方法）
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
 * 获取 GitHub 配置（兼容方法）
 * @returns {Promise<Object>}
 */
async function getSettings() {
    return await config.get(['githubToken', 'gistId']);
}

/**
 * 检查是否配置了 GitHub 同步
 * @returns {Promise<boolean>}
 */
async function hasGithubConfig() {
    const settings = await getSettings();
    return !!(settings.githubToken && settings.gistId);
}

/**
 * 智能保存配置
 * 如果有 GitHub 配置，同步到 Gist；否则保存到本地
 * @param {string} key - 配置键名
 * @param {*} value - 配置值
 * @returns {Promise<boolean>}
 */
async function smartSet(key, value) {
    // 先保存到本地
    await config.set(key, value);
    
    // 如果有 GitHub 配置，同步到云端
    if (await hasGithubConfig()) {
        try {
            await syncToGithub();
            console.log('配置已保存并同步到 GitHub');
        } catch (error) {
            console.error('同步到 GitHub 失败:', error);
            // 本地已保存，不影响使用
        }
    }
    return true;
}

/**
 * 智能批量保存配置
 * @param {Object} configObj - 配置对象
 * @returns {Promise<boolean>}
 */
async function smartSetMultiple(configObj) {
    // 先保存到本地
    await config.setMultiple(configObj);
    
    // 如果有 GitHub 配置，同步到云端
    if (await hasGithubConfig()) {
        try {
            await syncToGithub();
            console.log('配置已保存并同步到 GitHub');
        } catch (error) {
            console.error('同步到 GitHub 失败:', error);
        }
    }
    return true;
}

/**
 * 从 GitHub Gist 同步配置到本地
 * @returns {Promise<boolean>}
 */
async function syncFromGithub() {
    const settings = await getSettings();
    if (!settings.githubToken || !settings.gistId) {
        console.log('未配置 GitHub，跳过同步');
        return false;
    }

    try {
        const response = await fetch(`https://api.github.com/gists/${settings.gistId}`, {
            headers: { 
                'Authorization': `token ${settings.githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API 错误: ${response.status}`);
        }

        const data = await response.json();
        const configFile = data.files['mytab-config.json'];
        
        if (configFile && configFile.content) {
            const remoteConfig = JSON.parse(configFile.content);
            // 合并到本地配置
            await config.setMultiple(remoteConfig);
            console.log('已从 GitHub 同步配置');
            return true;
        }
        return false;
    } catch (error) {
        console.error('从 GitHub 同步失败:', error);
        return false;
    }
}

/**
 * 同步本地配置到 GitHub Gist
 * @returns {Promise<boolean>}
 */
async function syncToGithub() {
    const settings = await getSettings();
    if (!settings.githubToken || !settings.gistId) {
        console.log('未配置 GitHub，仅保存到本地');
        return false;
    }

    // 获取所有本地配置（排除敏感信息）
    const allConfig = await config.getAll();
    const syncData = {};
    
    // 过滤掉敏感配置
    const sensitiveKeys = ['githubToken', 'gistId'];
    for (const key in allConfig) {
        if (!sensitiveKeys.includes(key)) {
            syncData[key] = allConfig[key];
        }
    }

    const response = await fetch(`https://api.github.com/gists/${settings.gistId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${settings.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                'mytab-config.json': {
                    content: JSON.stringify(syncData, null, 2)
                }
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '同步失败');
    }

    console.log('配置已同步到 GitHub Gist');
    return true;
}

/**
 * 智能读取配置
 * 先检查是否有 GitHub 配置，有则尝试同步最新配置
 * @param {string|Array<string>} keys - 配置键名
 * @returns {Promise<Object>}
 */
async function smartGet(keys) {
    // 如果有 GitHub 配置，先尝试从云端同步
    if (await hasGithubConfig()) {
        try {
            await syncFromGithub();
        } catch (error) {
            console.error('从 GitHub 同步失败，使用本地配置:', error);
        }
    }
    
    // 返回本地配置
    return await config.get(keys);
}

/**
 * 智能删除配置
 * @param {string|Array<string>} keys - 配置键名
 * @returns {Promise<boolean>}
 */
async function smartRemove(keys) {
    await config.remove(keys);
    
    // 如果有 GitHub 配置，同步删除操作
    if (await hasGithubConfig()) {
        try {
            await syncToGithub();
        } catch (error) {
            console.error('同步删除操作到 GitHub 失败:', error);
        }
    }
    return true;
}

/**
 * GitHub Gist 管理类 - 提供完整的增删改查功能
 */
class GistManager {
    constructor() {
        this.baseUrl = 'https://api.github.com';
    }

    /**
     * 获取 GitHub 配置
     * @private
     * @returns {Promise<{token: string, gistId: string}>}
     */
    async _getAuth() {
        const settings = await getSettings();
        if (!settings.githubToken || !settings.gistId) {
            throw new Error('未配置 GitHub Token 或 Gist ID');
        }
        return { token: settings.githubToken, gistId: settings.gistId };
    }

    /**
     * 构建请求头
     * @private
     * @param {string} token - GitHub Token
     * @returns {Object}
     */
    _getHeaders(token) {
        return {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
    }

    /**
     * 创建新的 Gist（增）
     * @param {string} description - Gist 描述
     * @param {Object} files - 文件对象 {filename: {content: string}}
     * @param {boolean} isPublic - 是否公开
     * @returns {Promise<Object>} 创建的 Gist 信息
     */
    async create(description, files, isPublic = false) {
        const { token } = await this._getAuth();
        
        const response = await fetch(`${this.baseUrl}/gists`, {
            method: 'POST',
            headers: this._getHeaders(token),
            body: JSON.stringify({
                description,
                public: isPublic,
                files
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`创建 Gist 失败: ${error.message}`);
        }

        const data = await response.json();
        console.log('Gist 创建成功:', data.id);
        return data;
    }

    /**
     * 读取 Gist 内容（查）
     * @param {string} gistId - Gist ID（可选，默认使用配置中的）
     * @returns {Promise<Object>} Gist 内容
     */
    async read(gistId = null) {
        const { token, gistId: configGistId } = await this._getAuth();
        const targetGistId = gistId || configGistId;
        
        const response = await fetch(`${this.baseUrl}/gists/${targetGistId}`, {
            headers: this._getHeaders(token)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`读取 Gist 失败: ${error.message}`);
        }

        return await response.json();
    }

    /**
     * 更新 Gist（改）
     * @param {Object} files - 文件对象 {filename: {content: string}} 或 {filename: null} 删除文件
     * @param {string} description - 新的描述（可选）
     * @param {string} gistId - Gist ID（可选，默认使用配置中的）
     * @returns {Promise<Object>} 更新后的 Gist 信息
     */
    async update(files, description = null, gistId = null) {
        const { token, gistId: configGistId } = await this._getAuth();
        const targetGistId = gistId || configGistId;
        
        const body = { files };
        if (description) body.description = description;

        const response = await fetch(`${this.baseUrl}/gists/${targetGistId}`, {
            method: 'PATCH',
            headers: this._getHeaders(token),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`更新 Gist 失败: ${error.message}`);
        }

        const data = await response.json();
        console.log('Gist 更新成功');
        return data;
    }

    /**
     * 删除 Gist（删）
     * @param {string} gistId - Gist ID（可选，默认使用配置中的）
     * @returns {Promise<boolean>}
     */
    async delete(gistId = null) {
        const { token, gistId: configGistId } = await this._getAuth();
        const targetGistId = gistId || configGistId;
        
        const response = await fetch(`${this.baseUrl}/gists/${targetGistId}`, {
            method: 'DELETE',
            headers: this._getHeaders(token)
        });

        if (!response.ok && response.status !== 204) {
            const error = await response.json();
            throw new Error(`删除 Gist 失败: ${error.message}`);
        }

        console.log('Gist 删除成功');
        return true;
    }

    /**
     * 列出用户的所有 Gist
     * @param {number} perPage - 每页数量
     * @param {number} page - 页码
     * @returns {Promise<Array>} Gist 列表
     */
    async list(perPage = 30, page = 1) {
        const { token } = await this._getAuth();
        
        const response = await fetch(
            `${this.baseUrl}/gists?per_page=${perPage}&page=${page}`,
            { headers: this._getHeaders(token) }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`获取 Gist 列表失败: ${error.message}`);
        }

        return await response.json();
    }

    /**
     * 读取 Gist 中的特定文件内容
     * @param {string} filename - 文件名
     * @param {string} gistId - Gist ID（可选）
     * @returns {Promise<string>} 文件内容
     */
    async readFile(filename, gistId = null) {
        const gist = await this.read(gistId);
        const file = gist.files[filename];
        
        if (!file) {
            throw new Error(`文件 ${filename} 不存在`);
        }

        return file.content;
    }

    /**
     * 更新或创建 Gist 中的特定文件
     * @param {string} filename - 文件名
     * @param {string} content - 文件内容
     * @param {string} gistId - Gist ID（可选）
     * @returns {Promise<Object>}
     */
    async writeFile(filename, content, gistId = null) {
        return await this.update({
            [filename]: { content }
        }, null, gistId);
    }

    /**
     * 删除 Gist 中的特定文件
     * @param {string} filename - 文件名
     * @param {string} gistId - Gist ID（可选）
     * @returns {Promise<Object>}
     */
    async deleteFile(filename, gistId = null) {
        return await this.update({
            [filename]: null
        }, null, gistId);
    }

    /**
     * 检查 Gist 是否存在
     * @param {string} gistId - Gist ID（可选）
     * @returns {Promise<boolean>}
     */
    async exists(gistId = null) {
        try {
            await this.read(gistId);
            return true;
        } catch (error) {
            if (error.message.includes('404')) {
                return false;
            }
            throw error;
        }
    }
}

// 创建 Gist 管理实例
const gist = new GistManager();

// 导出模块（如果在模块环境中使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        ConfigManager, 
        config, 
        GistManager,
        gist,
        saveSettings, 
        getSettings,
        hasGithubConfig,
        smartSet,
        smartSetMultiple,
        smartGet,
        smartRemove,
        syncToGithub,
        syncFromGithub
    };
}

