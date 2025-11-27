// ====================================
// Task Detail Panel Component
// ====================================

import {
    getTasksByProjectId,
    getUserById,
    getData,
    saveData,
    getUsers
} from '../data.js';

import {
    formatDate,
    formatDateTime,
    getStatusBadgeClass
} from '../utils/helpers.js';

let currentTask = null;
let onTaskUpdateCallback = null;

export function showTaskPanel(taskId, onUpdate) {
    const data = getData();
    const task = data.tasks.find(t => t.id === taskId);

    if (!task) {
        console.error('Task not found:', taskId);
        return;
    }

    currentTask = task;
    onTaskUpdateCallback = onUpdate;

    const panel = document.getElementById('task-detail-panel');
    const overlay = document.getElementById('panel-overlay');

    if (!panel || !overlay) {
        createPanelElements();
        return showTaskPanel(taskId, onUpdate);
    }

    renderTaskPanel(task);

    // Show panel
    overlay.classList.add('active');
    panel.classList.add('active');
}

export function hideTaskPanel() {
    const panel = document.getElementById('task-detail-panel');
    const overlay = document.getElementById('panel-overlay');

    if (panel && overlay) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    }

    currentTask = null;
    onTaskUpdateCallback = null;
}

function createPanelElements() {
    // Create overlay
    let overlay = document.getElementById('panel-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'panel-overlay';
        overlay.className = 'panel-overlay';
        overlay.addEventListener('click', hideTaskPanel);
        document.body.appendChild(overlay);
    }

    // Create panel
    let panel = document.getElementById('task-detail-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'task-detail-panel';
        panel.className = 'side-panel';
        document.body.appendChild(panel);
    }
}

function renderTaskPanel(task) {
    const panel = document.getElementById('task-detail-panel');
    const assignee = getUserById(task.assigneeId);
    const lastUpdater = getUserById(task.lastUpdatedBy);
    const users = getUsers();

    const isEditMode = panel.dataset.editMode === 'true';

    panel.innerHTML = `
        <div class="side-panel-header">
            <h3>タスク詳細</h3>
            <button class="icon-button" id="close-panel-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
        
        <div class="side-panel-body">
            ${isEditMode ? renderEditMode(task, users) : renderViewMode(task, assignee, lastUpdater, users)}
        </div>
        
        ${!isEditMode ? `
            <div class="side-panel-footer">
                <button class="btn btn-secondary btn-sm" id="delete-task-btn">削除</button>
                <button class="btn btn-primary btn-sm" id="edit-task-btn">編集</button>
            </div>
        ` : `
            <div class="side-panel-footer">
                <button class="btn btn-secondary btn-sm" id="cancel-edit-btn">キャンセル</button>
                <button class="btn btn-primary btn-sm" id="save-task-btn">保存</button>
            </div>
        `}
    `;

    attachPanelEventHandlers();
}

function renderViewMode(task, assignee, lastUpdater, users) {
    return `
        <div class="form-group">
            <label class="form-label">タスク名</label>
            <h4 style="margin-top: var(--space-xs);">${task.title}</h4>
        </div>
        
        <div class="form-group">
            <label class="form-label">説明</label>
            <p class="text-sm" style="white-space: pre-wrap;">${task.description || '説明なし'}</p>
        </div>
        
        <div class="form-group">
            <label class="form-label">ステータス</label>
            <div style="margin-top: var(--space-xs);">
                <span class="badge ${getStatusBadgeClass(task.status)}">${task.status}</span>
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">担当者</label>
            <div style="display: flex; align-items: center; gap: var(--space-sm); margin-top: var(--space-xs);">
                <img src="${assignee?.avatar}" alt="${assignee?.name}" class="avatar avatar-md">
                <span class="font-medium">${assignee?.name || '未割当'}</span>
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">期限</label>
            <p class="text-sm" style="margin-top: var(--space-xs);">${formatDate(task.dueDate)}</p>
        </div>
        
        <div class="form-group">
            <label class="form-label">最終更新</label>
            <p class="text-sm text-secondary" style="margin-top: var(--space-xs);">
                ${lastUpdater?.name} ・ ${formatDateTime(task.updatedAt)}
            </p>
        </div>
        
        <div class="form-group">
            <label class="form-label">作成日</label>
            <p class="text-sm text-secondary" style="margin-top: var(--space-xs);">
                ${formatDateTime(task.createdAt)}
            </p>
        </div>
        
        <div class="form-group" style="margin-top: var(--space-2xl);">
            <h4 class="text-sm font-semibold" style="margin-bottom: var(--space-md);">変更履歴</h4>
            ${renderTaskHistory(task)}
        </div>
    `;
}

function renderEditMode(task, users) {
    return `
        <div class="form-group">
            <label class="form-label">タスク名 *</label>
            <input type="text" class="form-input" id="task-title-input" value="${task.title}" required>
        </div>
        
        <div class="form-group">
            <label class="form-label">説明</label>
            <textarea class="form-textarea" id="task-description-input" rows="4">${task.description || ''}</textarea>
        </div>
        
        <div class="form-group">
            <label class="form-label">ステータス</label>
            <select class="form-select" id="task-status-input">
                <option value="未着手" ${task.status === '未着手' ? 'selected' : ''}>未着手</option>
                <option value="作業中" ${task.status === '作業中' ? 'selected' : ''}>作業中</option>
                <option value="レビュー待ち" ${task.status === 'レビュー待ち' ? 'selected' : ''}>レビュー待ち</option>
                <option value="完了" ${task.status === '完了' ? 'selected' : ''}>完了</option>
                <option value="保留" ${task.status === '保留' ? 'selected' : ''}>保留</option>
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">担当者</label>
            <select class="form-select" id="task-assignee-input">
                ${users.map(user => `
                    <option value="${user.id}" ${task.assigneeId === user.id ? 'selected' : ''}>
                        ${user.name}
                    </option>
                `).join('')}
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">期限</label>
            <input type="date" class="form-input" id="task-duedate-input" 
                   value="${task.dueDate ? task.dueDate.split('T')[0] : ''}">
        </div>
    `;
}

function renderTaskHistory(task) {
    // For now, just show the last update
    // In a real app, this would show a full history from a separate table
    const lastUpdater = getUserById(task.lastUpdatedBy);

    return `
        <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
            <div style="padding: var(--space-sm); background: var(--color-gray-50); border-radius: var(--radius-md);">
                <div class="text-sm">
                    <strong>${lastUpdater?.name}</strong> が更新
                </div>
                <div class="text-xs text-tertiary" style="margin-top: var(--space-xs);">
                    ${formatDateTime(task.updatedAt)}
                </div>
            </div>
            <div style="padding: var(--space-sm); background: var(--color-gray-50); border-radius: var(--radius-md);">
                <div class="text-sm">
                    タスクが作成されました
                </div>
                <div class="text-xs text-tertiary" style="margin-top: var(--space-xs);">
                    ${formatDateTime(task.createdAt)}
                </div>
            </div>
        </div>
    `;
}

function attachPanelEventHandlers() {
    const closeBtn = document.getElementById('close-panel-btn');
    const editBtn = document.getElementById('edit-task-btn');
    const deleteBtn = document.getElementById('delete-task-btn');
    const saveBtn = document.getElementById('save-task-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', hideTaskPanel);
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const panel = document.getElementById('task-detail-panel');
            panel.dataset.editMode = 'true';
            renderTaskPanel(currentTask);
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('このタスクを削除しますか？')) {
                deleteTask(currentTask.id);
            }
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveTaskChanges);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const panel = document.getElementById('task-detail-panel');
            panel.dataset.editMode = 'false';
            renderTaskPanel(currentTask);
        });
    }
}

function saveTaskChanges() {
    const title = document.getElementById('task-title-input').value.trim();
    const description = document.getElementById('task-description-input').value.trim();
    const status = document.getElementById('task-status-input').value;
    const assigneeId = document.getElementById('task-assignee-input').value;
    const dueDate = document.getElementById('task-duedate-input').value;

    if (!title) {
        alert('タスク名を入力してください');
        return;
    }

    const data = getData();
    const taskIndex = data.tasks.findIndex(t => t.id === currentTask.id);

    if (taskIndex !== -1) {
        data.tasks[taskIndex] = {
            ...data.tasks[taskIndex],
            title,
            description,
            status,
            assigneeId,
            dueDate,
            updatedAt: new Date().toISOString(),
            lastUpdatedBy: 'user-001' // TODO: Get current user
        };

        // Add activity
        data.activities.push({
            id: `act-${Date.now()}`,
            projectId: data.tasks[taskIndex].projectId,
            userId: 'user-001',
            type: 'task_updated',
            targetId: currentTask.id,
            targetType: 'task',
            content: `タスク「${title}」を更新`,
            timestamp: new Date().toISOString()
        });

        saveData(data);
        currentTask = data.tasks[taskIndex];

        const panel = document.getElementById('task-detail-panel');
        panel.dataset.editMode = 'false';
        renderTaskPanel(currentTask);

        if (onTaskUpdateCallback) {
            onTaskUpdateCallback();
        }
    }
}

function deleteTask(taskId) {
    const data = getData();
    const taskIndex = data.tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        const task = data.tasks[taskIndex];
        data.tasks.splice(taskIndex, 1);

        // Add activity
        data.activities.push({
            id: `act-${Date.now()}`,
            projectId: task.projectId,
            userId: 'user-001',
            type: 'task_deleted',
            targetId: taskId,
            targetType: 'task',
            content: `タスク「${task.title}」を削除`,
            timestamp: new Date().toISOString()
        });

        saveData(data);
        hideTaskPanel();

        if (onTaskUpdateCallback) {
            onTaskUpdateCallback();
        }
    }
}
