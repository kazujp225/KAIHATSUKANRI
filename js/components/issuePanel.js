// ====================================
// Issue Detail Panel Component
// ====================================

import {
    getUserById,
    getData,
    saveData,
    getUsers
} from '../data.js';

import {
    formatDateTime,
    getStatusBadgeClass,
    getPriorityBadgeClass
} from '../utils/helpers.js';

let currentIssue = null;
let onIssueUpdateCallback = null;

export function showIssuePanel(issueId, onUpdate) {
    const data = getData();
    const issue = data.issues.find(i => i.id === issueId);

    if (!issue) {
        console.error('Issue not found:', issueId);
        return;
    }

    currentIssue = issue;
    onIssueUpdateCallback = onUpdate;

    const panel = document.getElementById('issue-detail-panel');
    const overlay = document.getElementById('panel-overlay');

    if (!panel || !overlay) {
        createPanelElements();
        return showIssuePanel(issueId, onUpdate);
    }

    renderIssuePanel(issue);

    // Show panel
    overlay.classList.add('active');
    panel.classList.add('active');
}

export function hideIssuePanel() {
    const panel = document.getElementById('issue-detail-panel');
    const overlay = document.getElementById('panel-overlay');

    if (panel && overlay) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    }

    currentIssue = null;
    onIssueUpdateCallback = null;
}

function createPanelElements() {
    // Create overlay (reuse if exists)
    let overlay = document.getElementById('panel-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'panel-overlay';
        overlay.className = 'panel-overlay';
        document.body.appendChild(overlay);
    }

    // Update overlay click handler to hide both panels
    overlay.onclick = () => {
        hideIssuePanel();
        // Also hide task panel if it exists
        const taskPanel = document.getElementById('task-detail-panel');
        if (taskPanel) {
            taskPanel.classList.remove('active');
            overlay.classList.remove('active');
        }
    };

    // Create issue panel
    let panel = document.getElementById('issue-detail-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'issue-detail-panel';
        panel.className = 'side-panel';
        document.body.appendChild(panel);
    }
}

function renderIssuePanel(issue) {
    const panel = document.getElementById('issue-detail-panel');
    const assignee = getUserById(issue.assigneeId);
    const users = getUsers();

    const isEditMode = panel.dataset.editMode === 'true';

    panel.innerHTML = `
        <div class="side-panel-header">
            <h3>Issue詳細</h3>
            <button class="icon-button" id="close-issue-panel-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
        
        <div class="side-panel-body">
            ${isEditMode ? renderEditMode(issue, users) : renderViewMode(issue, assignee)}
        </div>
        
        ${!isEditMode ? `
            <div class="side-panel-footer">
                <button class="btn btn-secondary btn-sm" id="delete-issue-btn">削除</button>
                <button class="btn btn-primary btn-sm" id="edit-issue-btn">編集</button>
            </div>
        ` : `
            <div class="side-panel-footer">
                <button class="btn btn-secondary btn-sm" id="cancel-issue-edit-btn">キャンセル</button>
                <button class="btn btn-primary btn-sm" id="save-issue-btn">保存</button>
            </div>
        `}
    `;

    attachPanelEventHandlers();
}

function renderViewMode(issue, assignee) {
    return `
        <div class="form-group">
            <label class="form-label">タイトル</label>
            <h4 style="margin-top: var(--space-xs);">${issue.title}</h4>
        </div>
        
        <div class="form-group">
            <div style="display: flex; gap: var(--space-sm);">
                <span class="badge ${getStatusBadgeClass(issue.status)}">${issue.status}</span>
                <span class="badge ${getPriorityBadgeClass(issue.priority)}">優先度: ${issue.priority}</span>
                <span class="badge badge-secondary">${issue.category}</span>
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">説明</label>
            <p class="text-sm" style="white-space: pre-wrap;">${issue.description || '-'}</p>
        </div>
        
        <div class="form-group">
            <label class="form-label">担当者</label>
            <div style="display: flex; align-items: center; gap: var(--space-sm); margin-top: var(--space-xs);">
                <img src="${assignee?.avatar}" alt="${assignee?.name}" class="avatar avatar-md">
                <span class="font-medium">${assignee?.name || '未割当'}</span>
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">再現手順</label>
            <p class="text-sm" style="white-space: pre-wrap; background: var(--color-gray-50); padding: var(--space-md); border-radius: var(--radius-md);">
                ${issue.reproduction || '-'}
            </p>
        </div>
        
        <div class="form-group">
            <label class="form-label">期待される動作</label>
            <p class="text-sm">${issue.expected || '-'}</p>
        </div>
        
        <div class="form-group">
            <label class="form-label">実際の動作</label>
            <p class="text-sm">${issue.actual || '-'}</p>
        </div>
        
        <div class="form-group">
            <label class="form-label">発生日</label>
            <p class="text-sm text-secondary">${formatDateTime(issue.createdAt)}</p>
        </div>
        
        ${issue.resolvedAt ? `
            <div class="form-group">
                <label class="form-label">解決日</label>
                <p class="text-sm text-success font-medium">${formatDateTime(issue.resolvedAt)}</p>
            </div>
        ` : ''}
    `;
}

function renderEditMode(issue, users) {
    return `
        <div class="form-group">
            <label class="form-label">タイトル *</label>
            <input type="text" class="form-input" id="issue-title-input" value="${issue.title}" required>
        </div>
        
        <div class="form-group">
            <label class="form-label">説明</label>
            <textarea class="form-textarea" id="issue-description-input" rows="3">${issue.description || ''}</textarea>
        </div>
        
        <div class="form-group">
            <label class="form-label">ステータス</label>
            <select class="form-select" id="issue-status-input">
                <option value="未対応" ${issue.status === '未対応' ? 'selected' : ''}>未対応</option>
                <option value="対応中" ${issue.status === '対応中' ? 'selected' : ''}>対応中</option>
                <option value="確認待ち" ${issue.status === '確認待ち' ? 'selected' : ''}>確認待ち</option>
                <option value="クローズ" ${issue.status === 'クローズ' ? 'selected' : ''}>クローズ</option>
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">優先度</label>
            <select class="form-select" id="issue-priority-input">
                <option value="低" ${issue.priority === '低' ? 'selected' : ''}>低</option>
                <option value="中" ${issue.priority === '中' ? 'selected' : ''}>中</option>
                <option value="高" ${issue.priority === '高' ? 'selected' : ''}>高</option>
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">原因カテゴリ</label>
            <select class="form-select" id="issue-category-input">
                <option value="仕様抜け" ${issue.category === '仕様抜け' ? 'selected' : ''}>仕様抜け</option>
                <option value="実装バグ" ${issue.category === '実装バグ' ? 'selected' : ''}>実装バグ</option>
                <option value="外部要因" ${issue.category === '外部要因' ? 'selected' : ''}>外部要因</option>
                <option value="その他" ${issue.category === 'その他' ? 'selected' : ''}>その他</option>
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">担当者</label>
            <select class="form-select" id="issue-assignee-input">
                ${users.map(user => `
                    <option value="${user.id}" ${issue.assigneeId === user.id ? 'selected' : ''}>
                        ${user.name}
                    </option>
                `).join('')}
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">再現手順</label>
            <textarea class="form-textarea" id="issue-reproduction-input" rows="4">${issue.reproduction || ''}</textarea>
        </div>
        
        <div class="form-group">
            <label class="form-label">期待される動作</label>
            <textarea class="form-textarea" id="issue-expected-input" rows="2">${issue.expected || ''}</textarea>
        </div>
        
        <div class="form-group">
            <label class="form-label">実際の動作</label>
            <textarea class="form-textarea" id="issue-actual-input" rows="2">${issue.actual || ''}</textarea>
        </div>
    `;
}

function attachPanelEventHandlers() {
    const closeBtn = document.getElementById('close-issue-panel-btn');
    const editBtn = document.getElementById('edit-issue-btn');
    const deleteBtn = document.getElementById('delete-issue-btn');
    const saveBtn = document.getElementById('save-issue-btn');
    const cancelBtn = document.getElementById('cancel-issue-edit-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', hideIssuePanel);
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const panel = document.getElementById('issue-detail-panel');
            panel.dataset.editMode = 'true';
            renderIssuePanel(currentIssue);
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('このIssueを削除しますか？')) {
                deleteIssue(currentIssue.id);
            }
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveIssueChanges);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const panel = document.getElementById('issue-detail-panel');
            panel.dataset.editMode = 'false';
            renderIssuePanel(currentIssue);
        });
    }
}

function saveIssueChanges() {
    const title = document.getElementById('issue-title-input').value.trim();
    const description = document.getElementById('issue-description-input').value.trim();
    const status = document.getElementById('issue-status-input').value;
    const priority = document.getElementById('issue-priority-input').value;
    const category = document.getElementById('issue-category-input').value;
    const assigneeId = document.getElementById('issue-assignee-input').value;
    const reproduction = document.getElementById('issue-reproduction-input').value.trim();
    const expected = document.getElementById('issue-expected-input').value.trim();
    const actual = document.getElementById('issue-actual-input').value.trim();

    if (!title) {
        alert('タイトルを入力してください');
        return;
    }

    const data = getData();
    const issueIndex = data.issues.findIndex(i => i.id === currentIssue.id);

    if (issueIndex !== -1) {
        const wasOpen = data.issues[issueIndex].status !== 'クローズ';
        const nowClosed = status === 'クローズ';

        data.issues[issueIndex] = {
            ...data.issues[issueIndex],
            title,
            description,
            status,
            priority,
            category,
            assigneeId,
            reproduction,
            expected,
            actual,
            updatedAt: new Date().toISOString(),
            resolvedAt: (wasOpen && nowClosed) ? new Date().toISOString() : data.issues[issueIndex].resolvedAt
        };

        // Add activity
        data.activities.push({
            id: `act-${Date.now()}`,
            projectId: data.issues[issueIndex].projectId,
            userId: 'user-001',
            type: 'issue_updated',
            targetId: currentIssue.id,
            targetType: 'issue',
            content: `Issue「${title}」を更新`,
            timestamp: new Date().toISOString()
        });

        saveData(data);
        currentIssue = data.issues[issueIndex];

        const panel = document.getElementById('issue-detail-panel');
        panel.dataset.editMode = 'false';
        renderIssuePanel(currentIssue);

        if (onIssueUpdateCallback) {
            onIssueUpdateCallback();
        }
    }
}

function deleteIssue(issueId) {
    const data = getData();
    const issueIndex = data.issues.findIndex(i => i.id === issueId);

    if (issueIndex !== -1) {
        const issue = data.issues[issueIndex];
        data.issues.splice(issueIndex, 1);

        // Add activity
        data.activities.push({
            id: `act-${Date.now()}`,
            projectId: issue.projectId,
            userId: 'user-001',
            type: 'issue_deleted',
            targetId: issueId,
            targetType: 'issue',
            content: `Issue「${issue.title}」を削除`,
            timestamp: new Date().toISOString()
        });

        saveData(data);
        hideIssuePanel();

        if (onIssueUpdateCallback) {
            onIssueUpdateCallback();
        }
    }
}

// ====================================
// Issue Creation Modal
// ====================================

export function showIssueCreateModal(projectId, onCreated) {
    const users = getUsers();

    const modalOverlay = document.getElementById('modal-overlay');
    const modalContainer = document.getElementById('modal-container');

    modalContainer.innerHTML = `
        <div class="modal-header">
            <h3 class="modal-title">新規Issue作成</h3>
            <button class="modal-close" id="close-create-issue-modal">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
        
        <div class="modal-body">
            <div class="form-group">
                <label class="form-label">タイトル *</label>
                <input type="text" class="form-input" id="new-issue-title" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">説明</label>
                <textarea class="form-textarea" id="new-issue-description" rows="3"></textarea>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                <div class="form-group">
                    <label class="form-label">優先度</label>
                    <select class="form-select" id="new-issue-priority">
                        <option value="低">低</option>
                        <option value="中" selected>中</option>
                        <option value="高">高</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">原因カテゴリ</label>
                    <select class="form-select" id="new-issue-category">
                        <option value="仕様抜け">仕様抜け</option>
                        <option value="実装バグ" selected>実装バグ</option>
                        <option value="外部要因">外部要因</option>
                        <option value="その他">その他</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">担当者</label>
                <select class="form-select" id="new-issue-assignee">
                    ${users.map(user => `
                        <option value="${user.id}">${user.name}</option>
                    `).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">再現手順</label>
                <textarea class="form-textarea" id="new-issue-reproduction" rows="4" 
                          placeholder="1. ～にアクセス&#10;2. ～をクリック&#10;3. ～が発生"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">期待される動作</label>
                <textarea class="form-textarea" id="new-issue-expected" rows="2"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">実際の動作</label>
                <textarea class="form-textarea" id="new-issue-actual" rows="2"></textarea>
            </div>
        </div>
        
        <div class="modal-footer">
            <button class="btn btn-secondary" id="cancel-create-issue">キャンセル</button>
            <button class="btn btn-primary" id="submit-create-issue">作成</button>
        </div>
    `;

    modalOverlay.classList.add('active');

    // Event handlers
    document.getElementById('close-create-issue-modal').addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    document.getElementById('cancel-create-issue').addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    document.getElementById('submit-create-issue').addEventListener('click', () => {
        const title = document.getElementById('new-issue-title').value.trim();
        const description = document.getElementById('new-issue-description').value.trim();
        const priority = document.getElementById('new-issue-priority').value;
        const category = document.getElementById('new-issue-category').value;
        const assigneeId = document.getElementById('new-issue-assignee').value;
        const reproduction = document.getElementById('new-issue-reproduction').value.trim();
        const expected = document.getElementById('new-issue-expected').value.trim();
        const actual = document.getElementById('new-issue-actual').value.trim();

        if (!title) {
            alert('タイトルを入力してください');
            return;
        }

        const data = getData();
        const newIssue = {
            id: `issue-${Date.now()}`,
            projectId,
            title,
            description,
            status: '未対応',
            priority,
            category,
            assigneeId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            resolvedAt: null,
            reproduction,
            expected,
            actual
        };

        data.issues.push(newIssue);

        // Add activity
        data.activities.push({
            id: `act-${Date.now()}`,
            projectId,
            userId: 'user-001',
            type: 'issue_created',
            targetId: newIssue.id,
            targetType: 'issue',
            content: `Issue「${title}」を作成`,
            timestamp: new Date().toISOString()
        });

        saveData(data);
        modalOverlay.classList.remove('active');

        if (onCreated) {
            onCreated();
        }
    });
}
