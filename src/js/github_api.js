/**
 * GitHub API 工具类
 * 支持：创建仓库、文件增删改查、Token 验证
 * 适配 Chrome 扩展环境，Promise 风格，带完整异常处理
 */
class GitHubApiUtil {
  /**
   * 初始化
   * @param {string} token GitHub 个人访问令牌（PAT）
   */
  constructor(token) {
    this.token = token;
    this.baseUrl = 'https://api.github.com';
    // 请求公共头信息
    this.headers = {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
  }

  /**
   * 更新 Token（比如从存储中读取后更新）
   * @param {string} newToken 新的 GitHub Token
   */
  updateToken(newToken) {
    this.token = newToken;
    this.headers.Authorization = `token ${newToken}`;
  }

  /**
   * 验证 Token 是否有效
   * @returns {Promise<{valid: boolean, user?: object, error?: string}>} 验证结果
   */
  async validateToken() {
    if (!this.token) {
      return { valid: false, error: 'Token 不能为空' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: this.headers
      });

      if (response.ok) {
        const userInfo = await response.json();
        return { valid: true, user: userInfo };
      } else {
        const errorData = await response.json();
        return { valid: false, error: errorData.message || 'Token 无效或权限不足' };
      }
    } catch (error) {
      return { valid: false, error: `网络错误：${error.message}` };
    }
  }

  /**
   * 创建新仓库
   * @param {object} repoConfig 仓库配置
   * @param {string} repoConfig.name 仓库名称（必填）
   * @param {string} [repoConfig.description=''] 仓库描述
   * @param {boolean} [repoConfig.private=false] 是否私有仓库
   * @param {boolean} [repoConfig.auto_init=true] 是否自动初始化（创建 README）
   * @returns {Promise<{success: boolean, data?: object, error?: string}>} 创建结果
   */
  async createRepository(repoConfig) {
    if (!this.token) {
      return { success: false, error: '请先设置有效的 GitHub Token' };
    }
    if (!repoConfig.name) {
      return { success: false, error: '仓库名称不能为空' };
    }

    // 默认配置
    const config = {
      name: repoConfig.name,
      description: repoConfig.description || '',
      private: repoConfig.private || false,
      auto_init: repoConfig.auto_init !== false, // 默认自动初始化
      ...repoConfig
    };

    try {
      const response = await fetch(`${this.baseUrl}/user/repos`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(config)
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || '创建仓库失败' };
      }
    } catch (error) {
      return { success: false, error: `网络错误：${error.message}` };
    }
  }

  /**
   * 获取仓库内文件内容
   * @param {string} owner 仓库所有者（用户名）
   * @param {string} repo 仓库名称
   * @param {string} path 文件路径（如：README.md、docs/test.txt）
   * @returns {Promise<{success: boolean, content?: string, sha?: string, error?: string}>} 文件信息
   */
  async getFile(owner, repo, path) {
    if (!this.token) {
      return { success: false, error: '请先设置有效的 GitHub Token' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`, {
        method: 'GET',
        headers: this.headers
      });

      const data = await response.json();
      if (response.ok) {
        // GitHub 返回的内容是 Base64 编码的，需要解码
        const content = atob(data.content);
        return { success: true, content, sha: data.sha };
      } else {
        return { success: false, error: data.message || '获取文件失败' };
      }
    } catch (error) {
      return { success: false, error: `网络错误：${error.message}` };
    }
  }

  /**
   * 创建/更新仓库文件
   * @param {string} owner 仓库所有者
   * @param {string} repo 仓库名称
   * @param {string} path 文件路径
   * @param {object} fileData 文件数据
   * @param {string} fileData.content 文件内容（明文，会自动 Base64 编码）
   * @param {string} [fileData.message='Update file'] 提交信息
   * @param {string} [fileData.sha] 文件 SHA（更新文件时必填，创建时不需要）
   * @returns {Promise<{success: boolean, data?: object, error?: string}>} 操作结果
   */
  async createOrUpdateFile(owner, repo, path, fileData) {
    if (!this.token) {
      return { success: false, error: '请先设置有效的 GitHub Token' };
    }
    if (!fileData.content) {
      return { success: false, error: '文件内容不能为空' };
    }

    // 对文件内容进行 Base64 编码（GitHub API 要求）
    const encodedContent = btoa(unescape(encodeURIComponent(fileData.content)));

    const requestData = {
      message: fileData.message || 'Update file',
      content: encodedContent,
      ...(fileData.sha && { sha: fileData.sha }) // 更新文件时必须传 sha
    };

    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || '创建/更新文件失败' };
      }
    } catch (error) {
      return { success: false, error: `网络错误：${error.message}` };
    }
  }

  /**
   * 删除仓库文件
   * @param {string} owner 仓库所有者
   * @param {string} repo 仓库名称
   * @param {string} path 文件路径
   * @param {object} deleteData 删除配置
   * @param {string} deleteData.sha 文件 SHA（必填）
   * @param {string} [deleteData.message='Delete file'] 提交信息
   * @returns {Promise<{success: boolean, data?: object, error?: string}>} 操作结果
   */
  async deleteFile(owner, repo, path, deleteData) {
    if (!this.token) {
      return { success: false, error: '请先设置有效的 GitHub Token' };
    }
    if (!deleteData.sha) {
      return { success: false, error: '文件 SHA 不能为空（删除文件必须传）' };
    }

    const requestData = {
      message: deleteData.message || 'Delete file',
      sha: deleteData.sha
    };

    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`, {
        method: 'DELETE',
        headers: this.headers,
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || '删除文件失败' };
      }
    } catch (error) {
      return { success: false, error: `网络错误：${error.message}` };
    }
  }

  /**
   * 列出仓库文件/目录
   * @param {string} owner 仓库所有者
   * @param {string} repo 仓库名称
   * @param {string} [path=''] 目录路径（空表示根目录）
   * @returns {Promise<{success: boolean, data?: array, error?: string}>} 目录列表
   */
  async listFiles(owner, repo, path = '') {
    if (!this.token) {
      return { success: false, error: '请先设置有效的 GitHub Token' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`, {
        method: 'GET',
        headers: this.headers
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || '获取文件列表失败' };
      }
    } catch (error) {
      return { success: false, error: `网络错误：${error.message}` };
    }
  }
}

// 全局实例（初始无 Token，使用前需通过 updateToken 设置）
const githubApi = new GitHubApiUtil('');