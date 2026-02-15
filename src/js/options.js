/**
 * 显示状态提示
 * @param {string} message - 提示消息
 * @param {string} elementId - 状态元素ID，默认为 'status'
 */
function showStatus(message, elementId = 'status') {
    const status = document.getElementById(elementId);
    if (!status) return;
    status.textContent = message;
    status.style.color = '#2ea44f';
    setTimeout(() => { status.textContent = ''; }, 2000);
}

/**
 * 加载 GitHub 同步设置
 */
async function loadSyncSettings() {
    const items = await config.get(['githubToken', 'gistId']);
    if (items.githubToken) document.getElementById('token').value = items.githubToken;
    if (items.gistId) document.getElementById('gistId').value = items.gistId;
}

/**
 * 保存 GitHub 同步设置
 */
async function saveSyncSettings() {
    const token = document.getElementById('token').value.trim();
    const gistId = document.getElementById('gistId').value.trim();

    if (!token || !gistId) {
        alert('请完整填写信息！');
        return;
    }

    // 简单的 Token 格式验证
    if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
        if (!confirm('Token 格式看起来不正确，确定要保存吗？')) {
            return;
        }
    }

    // GitHub 配置只存本地，不上传到 Gist
    await config.setMultiple({
        githubToken: token,
        gistId: gistId
    });

    showStatus('GitHub 配置已保存！', 'status');
}

/**
 * 加载外观设置
 */
async function loadAppearanceSettings() {
    const res = await config.get(['bgMode', 'wallpaper']);
    
    if (res.bgMode) {
        document.getElementById('bg-mode').value = res.bgMode;
        toggleBgOptions(res.bgMode);
    }
    
    if (res.wallpaper && !res.wallpaper.startsWith('data:')) {
        document.getElementById('bg-url').value = res.wallpaper;
    }
}

/**
 * 切换背景选项显示
 * @param {string} mode - 背景模式
 */
function toggleBgOptions(mode) {
    const fixedOptions = document.getElementById('fixed-bg-options');
    fixedOptions.style.display = mode === 'fixed' ? 'block' : 'none';
}

/**
 * 保存外观设置
 */
async function saveAppearanceSettings() {
    const mode = document.getElementById('bg-mode').value;
    const url = document.getElementById('bg-url').value.trim();
    const fileInput = document.getElementById('bg-upload');

    try {
        // 如果有文件上传，优先处理文件
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            
            // 验证文件类型和大小
            if (!file.type.startsWith('image/')) {
                alert('请选择图片文件！');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('图片大小不能超过 5MB！');
                return;
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                // 使用智能保存，有 GitHub 配置时会自动同步
                await smartSetMultiple({ 
                    bgMode: 'fixed',
                    wallpaper: e.target.result 
                });
                showStatus('外观设置已保存！', 'appearance-status');
                // 清空文件输入
                fileInput.value = '';
            };
            reader.readAsDataURL(file);
        } else if (mode === 'fixed' && url) {
            // 使用 URL
            await smartSetMultiple({ 
                bgMode: 'fixed',
                wallpaper: url 
            });
            showStatus('外观设置已保存！', 'appearance-status');
        } else {
            // 随机模式或其他
            await smartSet('bgMode', mode);
            showStatus('外观设置已保存！', 'appearance-status');
        }
    } catch (error) {
        console.error('保存外观设置失败:', error);
        alert('保存失败，请重试！');
    }
}

// ========== 事件绑定 ==========

document.addEventListener('DOMContentLoaded', () => {
    // 加载设置
    loadSyncSettings();
    loadAppearanceSettings();

    // GitHub 同步设置
    document.getElementById('save').addEventListener('click', saveSyncSettings);

    // 外观设置
    document.getElementById('save-appearance').addEventListener('click', saveAppearanceSettings);
    document.getElementById('bg-mode').addEventListener('change', (e) => {
        toggleBgOptions(e.target.value);
    });
});