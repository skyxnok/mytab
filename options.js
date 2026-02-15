// 当页面加载时，自动填充已保存的配置
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['githubToken', 'gistId'], (items) => {
        if (items.githubToken) document.getElementById('token').value = items.githubToken;
        if (items.gistId) document.getElementById('gistId').value = items.gistId;
    });
});

// 保存按钮点击事件
document.getElementById('save').addEventListener('click', () => {
    const token = document.getElementById('token').value.trim();
    const gistId = document.getElementById('gistId').value.trim();

    if (!token || !gistId) {
        alert('请完整填写信息！');
        return;
    }

    chrome.storage.sync.set({
        githubToken: token,
        gistId: gistId
    }, () => {
        const status = document.getElementById('status');
        status.textContent = '设置已保存！';
        setTimeout(() => { status.textContent = ''; }, 2000);
    });
});

