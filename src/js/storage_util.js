/**
 * Chrome 扩展存储工具类
 * 支持 chrome.storage.local（本地存储）和 chrome.storage.sync（同步存储）
 * 封装增删改查，Promise 风格，带异常处理和权限校验
 */
class ChromeStorageUtil {
  /**
   * 初始化校验：检查 chrome.storage 是否可用（扩展环境）
   */
  constructor() {
    // 校验是否在 Chrome 扩展环境中
    if (!chrome || !chrome.storage) {
      console.error('ChromeStorageUtil: 非 Chrome 扩展环境，storage 不可用');
      this.isAvailable = false;
    } else {
      this.isAvailable = true;
    }
  }

  /**
   * 新增/修改数据（单条）
   * @param {string} type 存储类型：'local' 或 'sync'
   * @param {string} key 键名
   * @param {any} value 任意类型的值（自动序列化）
   * @returns {Promise<boolean>} 操作是否成功
   */
  async setItem(type, key, value) {
    if (!this.isAvailable) return false;
    if (!['local', 'sync'].includes(type)) {
      console.error('ChromeStorageUtil: type 必须是 local 或 sync');
      return false;
    }
    if (!key || typeof key !== 'string') {
      console.error('ChromeStorageUtil: 键名必须是非空字符串');
      return false;
    }

    try {
      const data = { [key]: value };
      await chrome.storage[type].set(data);
      return true;
    } catch (error) {
      console.error(`ChromeStorageUtil ${type} setItem 失败:`, error);
      return false;
    }
  }

  /**
   * 批量新增/修改数据
   * @param {string} type 存储类型：'local' 或 'sync'
   * @param {object} data 键值对对象（如 { key1: val1, key2: val2 }）
   * @returns {Promise<boolean>} 操作是否成功
   */
  async setItems(type, data) {
    if (!this.isAvailable) return false;
    if (!['local', 'sync'].includes(type)) {
      console.error('ChromeStorageUtil: type 必须是 local 或 sync');
      return false;
    }
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      console.error('ChromeStorageUtil: data 必须是普通对象');
      return false;
    }

    try {
      await chrome.storage[type].set(data);
      return true;
    } catch (error) {
      console.error(`ChromeStorageUtil ${type} setItems 失败:`, error);
      return false;
    }
  }

  /**
   * 查询单个数据
   * @param {string} type 存储类型：'local' 或 'sync'
   * @param {string} key 键名
   * @param {any} defaultValue 无数据时的默认值（默认 null）
   * @returns {Promise<any>} 查询结果或默认值
   */
  async getItem(type, key, defaultValue = null) {
    if (!this.isAvailable) return defaultValue;
    if (!['local', 'sync'].includes(type)) {
      console.error('ChromeStorageUtil: type 必须是 local 或 sync');
      return defaultValue;
    }
    if (!key || typeof key !== 'string') {
      console.error('ChromeStorageUtil: 键名必须是非空字符串');
      return defaultValue;
    }

    try {
      const result = await chrome.storage[type].get(key);
      return result[key] !== undefined ? result[key] : defaultValue;
    } catch (error) {
      console.error(`ChromeStorageUtil ${type} getItem 失败:`, error);
      return defaultValue;
    }
  }

  /**
   * 批量查询数据
   * @param {string} type 存储类型：'local' 或 'sync'
   * @param {string[]} keys 键名数组（如 ['key1', 'key2']）
   * @returns {Promise<object>} 键值对结果（如 { key1: val1, key2: val2 }）
   */
  async getItems(type, keys) {
    if (!this.isAvailable) return {};
    if (!['local', 'sync'].includes(type)) {
      console.error('ChromeStorageUtil: type 必须是 local 或 sync');
      return {};
    }
    if (!Array.isArray(keys) || keys.length === 0) {
      console.error('ChromeStorageUtil: keys 必须是非空数组');
      return {};
    }

    try {
      return await chrome.storage[type].get(keys);
    } catch (error) {
      console.error(`ChromeStorageUtil ${type} getItems 失败:`, error);
      return {};
    }
  }

  /**
   * 查询所有数据
   * @param {string} type 存储类型：'local' 或 'sync'
   * @returns {Promise<object>} 所有键值对
   */
  async getAll(type) {
    if (!this.isAvailable) return {};
    if (!['local', 'sync'].includes(type)) {
      console.error('ChromeStorageUtil: type 必须是 local 或 sync');
      return {};
    }

    try {
      return await chrome.storage[type].get(null); // get(null) 获取所有数据
    } catch (error) {
      console.error(`ChromeStorageUtil ${type} getAll 失败:`, error);
      return {};
    }
  }

  /**
   * 删除单个数据
   * @param {string} type 存储类型：'local' 或 'sync'
   * @param {string} key 键名
   * @returns {Promise<boolean>} 操作是否成功
   */
  async removeItem(type, key) {
    if (!this.isAvailable) return false;
    if (!['local', 'sync'].includes(type)) {
      console.error('ChromeStorageUtil: type 必须是 local 或 sync');
      return false;
    }
    if (!key || typeof key !== 'string') {
      console.error('ChromeStorageUtil: 键名必须是非空字符串');
      return false;
    }

    try {
      await chrome.storage[type].remove(key);
      return true;
    } catch (error) {
      console.error(`ChromeStorageUtil ${type} removeItem 失败:`, error);
      return false;
    }
  }

  /**
   * 批量删除数据
   * @param {string} type 存储类型：'local' 或 'sync'
   * @param {string[]} keys 键名数组
   * @returns {Promise<boolean>} 操作是否成功
   */
  async removeItems(type, keys) {
    if (!this.isAvailable) return false;
    if (!['local', 'sync'].includes(type)) {
      console.error('ChromeStorageUtil: type 必须是 local 或 sync');
      return false;
    }
    if (!Array.isArray(keys) || keys.length === 0) {
      console.error('ChromeStorageUtil: keys 必须是非空数组');
      return false;
    }

    try {
      await chrome.storage[type].remove(keys);
      return true;
    } catch (error) {
      console.error(`ChromeStorageUtil ${type} removeItems 失败:`, error);
      return false;
    }
  }

  /**
   * 清空所有数据
   * @param {string} type 存储类型：'local' 或 'sync'
   * @returns {Promise<boolean>} 操作是否成功
   */
  async clear(type) {
    if (!this.isAvailable) return false;
    if (!['local', 'sync'].includes(type)) {
      console.error('ChromeStorageUtil: type 必须是 local 或 sync');
      return false;
    }

    try {
      await chrome.storage[type].clear();
      return true;
    } catch (error) {
      console.error(`ChromeStorageUtil ${type} clear 失败:`, error);
      return false;
    }
  }
}

// 实例化工具类，全局可用
const chromeStorage = new ChromeStorageUtil();