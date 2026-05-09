// 文件路径: /frontend/js/pages/communityTabs/SosTab.js
import { showToast } from '../../utils/toast.js';

let currentView = 'all'; // 记录当前看的是 'all' 还是 'mine'
let allPosts = [];       // 缓存所有帖子数据

export async function renderSosTab(containerId) {
    const area = document.getElementById(containerId);
    
    // 注入页面结构，包括两个全新的自定义高级弹窗
    area.innerHTML = `
        <!-- 顶部视图切换按钮 -->
        <div style="display:flex; gap:10px; margin-top:15px; margin-bottom:15px; background: white; padding: 5px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <button id="btnViewAll" style="flex:1; padding:10px; border-radius:8px; border:none; background:#E0F2FE; color:#0369A1; font-weight:bold; cursor:pointer; transition:0.3s;">🌍 Community</button>
            <button id="btnViewMine" style="flex:1; padding:10px; border-radius:8px; border:none; background:transparent; color:gray; font-weight:bold; cursor:pointer; transition:0.3s;">👤 My Beacons</button>
        </div>

        <!-- 帖子列表 -->
        <div id="sosFeedList" style="display: flex; flex-direction: column; gap: 15px;">
            <div style="text-align:center; padding:20px; color:gray;">Loading posts...</div>
        </div>

        <!-- 右下角悬浮发帖按钮 -->
        <button id="fabAddSos" style="
            position: fixed; bottom: 90px; right: 20px; 
            width: 56px; height: 56px; border-radius: 50%; 
            background: #DC2626; color: white; border: none; 
            font-size: 28px; box-shadow: 0 4px 10px rgba(220,38,38,0.4);
            cursor: pointer; z-index: 100; display: flex; justify-content: center; align-items: center; transition: transform 0.2s;
        ">+</button>

        <!-- 1. 发帖弹窗 (Modal) -->
        <div id="sosPostModal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 999; justify-content: center; align-items: center; backdrop-filter: blur(4px);">
            <div style="background: white; width: 90%; max-width: 400px; border-radius: 16px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <h3 style="margin-top:0;">🚨 New SOS Beacon</h3>
                <input id="sosInputTitle" type="text" placeholder="Problem title (e.g. Yellow Leaves)" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #ddd; box-sizing:border-box;">
                <textarea id="sosInputContent" placeholder="Describe the symptoms..." style="width:100%; padding:10px; height:80px; margin-bottom:10px; border-radius:8px; border:1px solid #ddd; box-sizing:border-box;"></textarea>
                
                <!-- 上传图片按钮 -->
                <div style="margin-bottom: 15px;">
                    <label for="sosImageUpload" style="display:inline-block; padding:8px 12px; background:#f0f0f0; border-radius:8px; cursor:pointer; font-size:0.8rem; font-weight:bold;">
                        📷 Upload Photo
                    </label>
                    <input type="file" id="sosImageUpload" accept="image/*" style="display:none;">
                    <div id="imagePreview" style="margin-top:10px; max-height:150px; overflow:hidden; border-radius:8px; text-align:center;"></div>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button id="btnCancelSos" class="btn-outline" style="flex:1;">Cancel</button>
                    <button id="btnSubmitSos" class="btn-primary" style="flex:1; background:#DC2626; border:none;">Broadcast</button>
                </div>
            </div>
        </div>

        <!-- 2. 自定义确认删除弹窗 (替代丑陋的 confirm) -->
        <div id="customConfirmModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center; backdrop-filter: blur(4px);">
            <div style="background:white; padding:20px; border-radius:16px; width:80%; max-width:300px; text-align:center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <div style="font-size: 40px; margin-bottom: 10px;">🗑️</div>
                <h4 style="margin:0 0 10px 0;">Delete Beacon?</h4>
                <p style="font-size:0.85rem; color:gray; line-height:1.4;">This action cannot be undone. Are you sure you want to remove this post?</p>
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button id="btnConfirmCancel" class="btn-outline" style="flex:1;">Keep it</button>
                    <button id="btnConfirmOk" class="btn-primary" style="flex:1; background:#DC2626; border:none;">Delete</button>
                </div>
            </div>
        </div>

        <!-- 3. 自定义打赏弹窗 (替代丑陋的 prompt) -->
        <div id="customPromptModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center; backdrop-filter: blur(4px);">
            <div style="background:white; padding:20px; border-radius:16px; width:80%; max-width:300px; text-align:center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <div style="font-size: 40px; margin-bottom: 10px;">🎁</div>
                <h4 style="margin:0 0 5px 0;">Reward Neighbor</h4>
                <p id="promptMsg" style="font-size:0.85rem; color:gray; margin-bottom:15px;">How many coins to send?</p>
                <input type="number" id="promptInput" value="10" style="width:100%; padding:12px; border-radius:8px; border:2px solid #FDE047; margin-bottom:20px; box-sizing:border-box; text-align:center; font-weight:bold; font-size:1.1rem; outline:none;">
                <div style="display:flex; gap:10px;">
                    <button id="btnPromptCancel" class="btn-outline" style="flex:1;">Cancel</button>
                    <button id="btnPromptOk" class="btn-primary" style="flex:1; background:#EAB308; color:white; border:none;">Send Coins</button>
                </div>
            </div>
        </div>
    `;

    bindLogic();
    loadFeed();
}

function bindLogic() {
    // 切换标签页视觉效果
    document.getElementById('btnViewAll').addEventListener('click', (e) => {
        currentView = 'all';
        e.target.style.background = '#E0F2FE'; e.target.style.color = '#0369A1';
        document.getElementById('btnViewMine').style.background = 'transparent'; document.getElementById('btnViewMine').style.color = 'gray';
        renderList();
    });

    document.getElementById('btnViewMine').addEventListener('click', (e) => {
        currentView = 'mine';
        e.target.style.background = '#FEE2E2'; e.target.style.color = '#DC2626';
        document.getElementById('btnViewAll').style.background = 'transparent'; document.getElementById('btnViewAll').style.color = 'gray';
        renderList();
    });

    // 发帖弹窗逻辑与图片上传
    const modal = document.getElementById('sosPostModal');
    const imgUpload = document.getElementById('sosImageUpload');
    const preview = document.getElementById('imagePreview');
    let base64Image = null;

    document.getElementById('fabAddSos').addEventListener('click', () => modal.style.display = 'flex');
    document.getElementById('btnCancelSos').addEventListener('click', () => modal.style.display = 'none');

    // 图片转 Base64 预览
    imgUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                base64Image = e.target.result;
                preview.innerHTML = `<img src="${base64Image}" style="max-width:100%; max-height:150px; border-radius:8px; object-fit:contain;">`;
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('btnSubmitSos').addEventListener('click', async () => {
        const title = document.getElementById('sosInputTitle').value;
        const content = document.getElementById('sosInputContent').value;
        const btnSubmit = document.getElementById('btnSubmitSos');

        // 使用炫酷的 showToast 替代 alert
        if (!title || !content) return showToast('warning', 'Please fill in both title and description!');

        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Broadcasting...';

        try {
            await fetch('http://localhost:3000/api/community/posts/sos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, author: 'MyFarm', image: base64Image })
            });
            modal.style.display = 'none';
            document.getElementById('sosInputTitle').value = '';
            document.getElementById('sosInputContent').value = '';
            preview.innerHTML = '';
            base64Image = null;
            showToast('success', 'SOS broadcasted successfully!');
            loadFeed(); 
        } catch (err) {
            showToast('error', 'Network error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Broadcast';
        }
    });
}

// 从后端拉取所有数据
async function loadFeed() {
    try {
        const res = await fetch('http://localhost:3000/api/community/posts');
        allPosts = await res.json();
        renderList();
    } catch (err) {
        document.getElementById('sosFeedList').innerHTML = '<div style="color:red; text-align:center;">Failed to load posts.</div>';
    }
}

// 渲染列表 (自动过滤看别人的/看自己的)
function renderList() {
    const feedList = document.getElementById('sosFeedList');
    const currentUser = 'MyFarm'; 
    
    // 如果是 'mine'，只过滤出作者是我自己的帖子
    const displayPosts = currentView === 'all' 
        ? allPosts 
        : allPosts.filter(p => p.author === currentUser);

    if (displayPosts.length === 0) {
        feedList.innerHTML = `<div style="text-align:center; color:gray; padding:40px 20px;">
            <div style="font-size:40px; margin-bottom:10px;">🍃</div>
            No beacons found here.<br>You are all good!
        </div>`;
        return;
    }

    feedList.innerHTML = displayPosts.map(post => {
        const isMine = post.author === currentUser;
        const likesCount = post.likes || 0;

        return `
        <div class="card" style="border-radius:16px; padding: 18px; border: 1px solid #f0f0f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); background: white;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:36px; height:36px; background:${isMine ? '#FEE2E2' : '#E0E7FF'}; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px;">${isMine ? '👤' : '👩‍🌾'}</div>
                    <span style="font-weight:bold; font-size:0.95rem; color:#1f2937;">${post.author}</span>
                </div>
                <span style="color:#9CA3AF; font-size:0.75rem;">${post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}</span>
            </div>
            
            <h4 style="margin: 0 0 6px 0; color:#111827; font-size:1.05rem;">${post.title}</h4>
            <p style="font-size:0.9rem; color:#4B5563; line-height:1.5; margin-bottom:12px;">${post.content}</p>
            
            <!-- 如果有图片，渲染图片 -->
            ${post.image ? `<img src="${post.image}" style="width:100%; border-radius:12px; margin-bottom:12px; object-fit:cover;">` : ''}
            
            <!-- 帖子操作区 -->
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <button class="btn-outline" style="padding:6px 12px; font-size:0.8rem; border-color:#10B981; color:#10B981; border-radius:20px; display:flex; align-items:center; gap:5px;" onclick="window.likePost('${post.id}')">
                    🍃 <span style="font-weight:bold;">${likesCount}</span>
                </button>
                <!-- 重点：只有是自己的帖子，才显示删除按钮 -->
                ${isMine ? `<button class="btn-outline" style="padding:6px 12px; font-size:0.8rem; border-color:#FCA5A5; color:#DC2626; border-radius:20px; display:flex; align-items:center; gap:5px;" onclick="window.deletePost('${post.id}')">🗑️ Delete</button>` : ''}
            </div>

            <!-- 评论区 -->
            <div style="background:#F9FAFB; padding:12px; border-radius:12px; margin-bottom:12px;">
                <div style="font-size:0.75rem; font-weight:bold; margin-bottom:8px; color:#6B7280; letter-spacing:0.5px;">SUGGESTIONS (${post.comments ? post.comments.length : 0})</div>
                ${(post.comments || []).map((c) => `
                    <div style="font-size:0.85rem; margin-bottom:8px; display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 1px solid #F3F4F6; padding-bottom:8px;">
                        <div style="line-height:1.4;"><b style="color:#374151;">${c.author}:</b> <span style="color:#4B5563;">${c.text}</span></div>
                        <!-- 如果是我的帖子，且评论不是我发的，可以打赏 -->
                        ${isMine && c.author !== currentUser ? `
                            <button style="background:#FEF08A; color:#854D0E; border:none; padding:4px 10px; border-radius:12px; font-size:0.75rem; cursor:pointer; font-weight:bold;" onclick="window.rewardComment('${post.id}', '${c.author}')">
                                🎁 Tip
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>

            <!-- 发表评论 -->
            <div style="display:flex; gap:8px;">
                <input type="text" id="commentInput_${post.id}" placeholder="Type your suggestion..." style="flex:1; border-radius:20px; border:1px solid #E5E7EB; padding:8px 15px; font-size:0.85rem; outline:none; background:#F9FAFB;">
                <button class="btn-primary" style="padding:8px 18px; border-radius:20px; font-size:0.85rem;" onclick="window.submitComment('${post.id}')">Send</button>
            </div>
        </div>
    `}).join('');
}


// === 全局操作 API (彻底移除原生 prompt/confirm) ===

// 1. 发送评论
window.submitComment = async function(postId) {
    const input = document.getElementById(`commentInput_${postId}`);
    if (!input.value) return showToast('warning', 'Comment cannot be empty!');
    try {
        await fetch(`http://localhost:3000/api/community/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input.value, author: 'HelpfulNeighbor' }) // 模拟是邻居留的言
        });
        showToast('success', 'Suggestion added!');
        loadFeed(); 
    } catch (err) { showToast('error', 'Failed to send comment'); }
}

// 2. 自定义漂亮弹窗：删除帖子
window.deletePost = function(postId) {
    const modal = document.getElementById('customConfirmModal');
    modal.style.display = 'flex'; // 显示我们手写的漂亮的删除确认框
    
    // 取消按钮
    document.getElementById('btnConfirmCancel').onclick = () => {
        modal.style.display = 'none';
    };
    
    // 确认删除按钮
    document.getElementById('btnConfirmOk').onclick = async () => {
        modal.style.display = 'none';
        try {
            await fetch(`http://localhost:3000/api/community/posts/${postId}`, { method: 'DELETE' });
            showToast('success', 'Beacon removed from community');
            loadFeed(); // 刷新列表
        } catch (err) { 
            showToast('error', 'Error deleting beacon'); 
        }
    };
}

// 3. 点绿叶
window.likePost = async function(postId) {
    try {
        await fetch(`http://localhost:3000/api/community/posts/${postId}/like`, { method: 'POST' });
        loadFeed(); // 刷新数字
    } catch (err) { showToast('error', 'Network error'); }
}

// 4. 自定义漂亮弹窗：给热心邻居打赏
window.rewardComment = function(postId, receiverName) {
    const modal = document.getElementById('customPromptModal');
    document.getElementById('promptMsg').innerText = `Send coins to ${receiverName} as a thank you!`;
    document.getElementById('promptInput').value = '10'; // 默认金额
    modal.style.display = 'flex'; // 显示自定义的打赏输入框
    
    // 取消按钮
    document.getElementById('btnPromptCancel').onclick = () => {
        modal.style.display = 'none';
    };
    
    // 确认打赏按钮
    document.getElementById('btnPromptOk').onclick = async () => {
        const amountStr = document.getElementById('promptInput').value;
        const amount = Number(amountStr);
        modal.style.display = 'none';
        
        if (!amount || isNaN(amount) || amount <= 0) {
            return showToast('warning', 'Invalid coin amount!');
        }
        
        try {
            const res = await fetch(`http://localhost:3000/api/community/posts/${postId}/reward`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amount, receiver: receiverName })
            });
            const data = await res.json();
            
            if(res.ok) {
                showToast('success', `Awesome! Sent ${amount} 🍃 to ${receiverName}!`);
                // 实时刷新顶部金币显示
                const currentCoinsStr = document.getElementById('myCoinsDisplay').innerText;
                const currentCoins = parseInt(currentCoinsStr.replace(/[^0-9]/g, ''));
                document.getElementById('myCoinsDisplay').innerText = `🍃 ${currentCoins - amount} Coins`;
            } else {
                showToast('warning', data.message); // 余额不足时提示
            }
        } catch (err) { 
            showToast('error', 'Failed to send reward'); 
        }
    };
}