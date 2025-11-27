// ====================================
// Project Detail View
// ====================================

import {
    getProjectById,
    getClientById,
    getUserById,
    getUsers,
    getTasksByProjectId,
    getIssuesByProjectId,
    getActivitiesByProjectId,
    getHandoverNoteByProjectId,
    calculateProjectProgress,
    updateTaskStatus,
    updateIssueStatus,
    updateProjectStatus,
    getData,
    saveData
} from '../data.js';

import {
    formatDate,
    formatDateTime,
    formatCurrency,
    getStatusBadgeClass,
    getPriorityBadgeClass,
    getRelativeTime
} from '../utils/helpers.js';

import { showTaskEditModal, showProjectCreateModal } from '../components/modal.js';
import { showTaskPanel } from '../components/taskPanel.js';
import { showIssuePanel, showIssueCreateModal } from '../components/issuePanel.js';

let currentProjectId = null;
let activeTab = 'overview';

export function renderProjectDetail(projectId) {
    currentProjectId = projectId;
    const main = document.getElementById('app-main');

    const project = getProjectById(projectId);
    if (!project) {
        main.innerHTML = '<div class="empty-state"><h3>案件が見つかりません</h3></div>';
        return;
    }

    const client = getClientById(project.clientId);
    const mainAssignee = getUserById(project.mainAssignee);
    const progress = calculateProjectProgress(projectId);

    const html = `
        <!-- Project Header -->
        <div class="card" style="margin-bottom: var(--space-lg);">
            <div style="display: flex; justify-content: space-between;">
                <div style="display: flex; align-items: start; gap: var(--space-2xl); flex: 1;">
                    <!-- Left: Basic Info -->
                    <div style="flex: 1;">
                        <h2 style="margin-bottom: var(--space-sm);">${project.name}</h2>
                        <div style="display: flex; flex-direction: column; gap: var(--space-xs); color: var(--color-text-secondary); font-size: 0.875rem;">
                            <div>
                                <strong>顧客:</strong> ${client?.name || '不明'}
                                ${client?.contactPerson ? `(${client.contactPerson})` : ''}
                            </div>
                            <div>
                                <strong>連絡先:</strong> ${client?.email || '-'} / ${client?.phone || '-'}
                            </div>
                            ${project.links && project.links.length > 0 ? `
                                <div style="margin-top: var(--space-sm); display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                                    ${renderQuickLinks(project.links)}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Center: Status & Progress -->
                    <div style="flex: 1;">
                        <div class="form-group">
                            <label class="form-label">ステータス</label>
                            <select class="form-select" id="project-status">
                                <option value="見積中" ${project.status === '見積中' ? 'selected' : ''}>見積中</option>
                                <option value="開発中" ${project.status === '開発中' ? 'selected' : ''}>開発中</option>
                                <option value="検収中" ${project.status === '検収中' ? 'selected' : ''}>検収中</option>
                                <option value="運用中" ${project.status === '運用中' ? 'selected' : ''}>運用中</option>
                                <option value="完了" ${project.status === '完了' ? 'selected' : ''}>完了</option>
                                <option value="保留" ${project.status === '保留' ? 'selected' : ''}>保留</option>
                            </select>
                        </div>
                        
                        <div style="margin-top: var(--space-md);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-xs);">
                                <span class="text-sm text-secondary">進捗</span>
                                <span class="text-sm font-semibold">${progress}%</span>
                            </div>
                            <div class="progress progress-success">
                                <div class="progress-bar" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        
                        <div style="margin-top: var(--space-md); display: flex; gap: var(--space-md);">
                            <div>
                                <div class="text-xs text-tertiary">一次納期</div>
                                <div class="text-sm font-medium">${formatDate(project.primaryDueDate)}</div>
                            </div>
                            <div>
                                <div class="text-xs text-tertiary">本番納期</div>
                                <div class="text-sm font-semibold">${formatDate(project.dueDate)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right: Team -->
                    <div>
                        <div class="text-sm text-secondary" style="margin-bottom: var(--space-sm);">担当者</div>
                        <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
                            <img src="${mainAssignee?.avatar}" alt="${mainAssignee?.name}" class="avatar avatar-lg">
                            <div>
                                <div class="text-sm font-medium">${mainAssignee?.name}</div>
                                <div class="text-xs text-tertiary">メイン担当</div>
                            </div>
                        </div>
                        ${renderAssigneeAvatars(project.assignees)}
                    </div>
                </div>
                
                <!-- Project Actions Menu -->
                <div style="margin-left: var(--space-md);">
                    <button class="btn btn-secondary btn-sm" id="project-menu-btn" style="width: 40px; height: 40px; padding: 0;">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <circle cx="10" cy="4" r="1.5"/>
                            <circle cx="10" cy="10" r="1.5"/>
                            <circle cx="10" cy="16" r="1.5"/>
                        </svg>
                    </button>
                    <div id="project-menu" class="dropdown-menu" style="display: none; position: absolute; right: var(--space-lg); background: white; border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); min-width: 180px; z-index: 100;">
                        <button class="dropdown-item" id="edit-project-btn" style="width: 100%; text-align: left; padding: var(--space-sm) var(--space-md); border: none; background: none; cursor: pointer; font-size: 0.875rem;">
                            📝 案件を編集
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Tabs -->
        <div class="tabs">
            <div class="tab ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">概要</div>
            <div class="tab ${activeTab === 'tasks' ? 'active' : ''}" data-tab="tasks">タスク</div>
            <div class="tab ${activeTab === 'issues' ? 'active' : ''}" data-tab="issues">Issue / バグ</div>
            <div class="tab ${activeTab === 'activity' ? 'active' : ''}" data-tab="activity">作業ログ</div>
            <div class="tab ${activeTab === 'handover' ? 'active' : ''}" data-tab="handover">引き継ぎメモ</div>
        </div>
        
        <!-- Tab Content -->
        <div id="tab-content-container">
            ${renderTabContent(projectId, activeTab)}
        </div>
    `;

    main.innerHTML = html;
    attachTabHandlers();
}

function renderAssigneeAvatars(assigneeIds) {
    return `
        <div class="avatar-group">
            ${assigneeIds.slice(0, 4).map(id => {
        const user = getUserById(id);
        return `<img src="${user?.avatar}" alt="${user?.name}" class="avatar avatar-sm">`;
    }).join('')}
        </div>
    `;
}

function renderQuickLinks(links) {
    const linkConfig = {
        'github': { icon: '🐙', label: 'GitHub', color: '#24292e' },
        'render': { icon: '🚀', label: 'Render', color: '#46e3b7' },
        'vercel': { icon: '▲', label: 'Vercel', color: '#000000' },
        'netlify': { icon: '🔷', label: 'Netlify', color: '#00c7b7' },
        'heroku': { icon: '💜', label: 'Heroku', color: '#430098' },
        'aws': { icon: '☁️', label: 'AWS', color: '#ff9900' },
        'azure': { icon: '🌐', label: 'Azure', color: '#0078d4' },
        'docs': { icon: '📚', label: 'Docs', color: '#2563eb' },
        'staging': { icon: '🧪', label: 'Staging', color: '#f59e0b' },
        'production': { icon: '🌟', label: 'Production', color: '#10b981' },
        'other': { icon: '🔗', label: 'Link', color: '#6b7280' }
    };

    return links.map(link => {
        const config = linkConfig[link.type] || linkConfig['other'];
        return `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
               style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: white; border: 1.5px solid ${config.color}30; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; text-decoration: none; color: ${config.color}; transition: all 0.2s;"
               onmouseover="this.style.background='${config.color}'; this.style.color='white'; this.style.borderColor='${config.color}';"
               onmouseout="this.style.background='white'; this.style.color='${config.color}'; this.style.borderColor='${config.color}30';"
               title="${link.label}">
                <span style="font-size: 0.875rem;">${config.icon}</span>
                <span>${config.label}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="opacity: 0.6;">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke-width="2" stroke-linecap="round"/>
                    <polyline points="15 3 21 3 21 9" stroke-width="2" stroke-linecap="round"/>
                    <line x1="10" y1="14" x2="21" y2="3" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </a>
        `;
    }).join('');
}


function renderTabContent(projectId, tab) {
    switch (tab) {
        case 'overview':
            return renderOverviewTab(projectId);
        case 'tasks':
            return renderTasksTab(projectId);
        case 'issues':
            return renderIssuesTab(projectId);
        case 'activity':
            return renderActivityTab(projectId);
        case 'handover':
            return renderHandoverTab(projectId);
        default:
            return '';
    }
}

// ====================================
// Overview Tab
// ====================================
function renderOverviewTab(projectId) {
    const project = getProjectById(projectId);
    const tasks = getTasksByProjectId(projectId);
    const issues = getIssuesByProjectId(projectId);

    const completedTasks = tasks.filter(t => t.status === '完了').length;
    const pendingTasks = tasks.filter(t => t.status === '保留').length;
    const openIssues = issues.filter(i => i.status !== 'クローズ').length;
    const highPriorityIssues = issues.filter(i => i.priority === '高' && i.status !== 'クローズ').length;

    return `
        <div class="tab-content active">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
                <!-- Left Column: Project Info -->
                <div class="card">
                    <h3 class="card-title">案件情報</h3>
                    <div class="card-body">
                        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                            <div>
                                <div class="text-xs text-tertiary">契約種別</div>
                                <div class="font-medium">${project.contractType}</div>
                            </div>
                            <div>
                                <div class="text-xs text-tertiary">金額</div>
                                <div class="font-semibold text-lg">${formatCurrency(project.price)}</div>
                            </div>
                            <div>
                                <div class="text-xs text-tertiary">作業範囲</div>
                                <div class="text-sm">${project.description}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right Column: Summary Cards -->
                <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                    <!-- Tasks Summary -->
                    <div class="card">
                        <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: var(--space-md);">
                            タスクサマリ
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md);">
                            <div>
                                <div class="text-2xl font-bold text-primary">${tasks.length}</div>
                                <div class="text-xs text-tertiary">全タスク</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-success">${completedTasks}</div>
                                <div class="text-xs text-tertiary">完了</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-secondary">${pendingTasks}</div>
                                <div class="text-xs text-tertiary">保留</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Issues Summary -->
                    <div class="card">
                        <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: var(--space-md);">
                            Issueサマリ
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md);">
                            <div>
                                <div class="text-2xl font-bold text-danger">${openIssues}</div>
                                <div class="text-xs text-tertiary">未解決Issue</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-warning">${highPriorityIssues}</div>
                                <div class="text-xs text-tertiary">高優先度</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- External Links Section -->
            <div class="card" style="margin-top: var(--space-lg);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                    <h3 class="card-title" style="margin: 0;">🔗 関連リンク</h3>
                    <button class="btn btn-secondary btn-sm" onclick="editProjectLinks('${projectId}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        リンクを追加
                    </button>
                </div>
                <div class="card-body">
                    ${renderProjectLinks(project.links || [])}
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="card" style="margin-top: var(--space-lg);">
                <h3 class="card-title">最近のアクティビティ</h3>
                <div class="card-body">
                    ${renderRecentActivity(projectId, 5)}
                </div>
            </div>
        </div>
    `;
}

// ====================================
// Tasks Tab
// ====================================
function renderTasksTab(projectId) {
    const tasks = getTasksByProjectId(projectId);
    const users = getUsers();

    // Empty state when no tasks
    if (tasks.length === 0) {
        return `
            <div class="tab-content active">
                <div class="empty-state" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-lg);">
                    <div style="text-align: center;">
                        <h3 style="margin-bottom: var(--space-sm);">まだタスクがありません</h3>
                        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-2xl);">
                            新しいタスクを作成するか、テンプレートから一括追加してください
                        </p>
                        <div style="display: flex; gap: var(--space-md); justify-content: center;">
                            <button class="btn btn-primary" id="create-task-btn">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: var(--space-xs);">
                                    <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                新規タスクを作成
                            </button>
                            <button class="btn btn-secondary" id="add-from-template-btn">
                                📋 テンプレから追加
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="tab-content active">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
                <h3>タスク一覧 (${tasks.length}件)</h3>
                <div style="display: flex; gap: var(--space-sm);">
                    <button class="btn btn-secondary btn-sm" id="add-from-template-btn">📋 テンプレから追加</button>
                    <button class="btn btn-primary btn-sm" id="create-task-btn">＋ 新規タスク</button>
                </div>
            </div>
            
            <!-- Task Filter Bar -->
            <div class="filter-bar" style="margin-bottom: var(--space-lg);">
                <div class="filter-group">
                    <span class="filter-label">ステータス:</span>
                    <select class="filter-select" id="task-filter-status">
                        <option value="">全件</option>
                        <option value="未着手">未着手</option>
                        <option value="作業中">作業中</option>
                        <option value="レビュー待ち">レビュー待ち</option>
                        <option value="完了">完了</option>
                        <option value="保留">保留</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <span class="filter-label">担当者:</span>
                    <select class="filter-select" id="task-filter-assignee">
                        <option value="">全員</option>
                        ${users.map(user => `
                            <option value="${user.id}">${user.name}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="filter-group">
                    <span class="filter-label">並び順:</span>
                    <select class="filter-select" id="task-sort">
                        <option value="updated">更新日順</option>
                        <option value="dueDate">期限順</option>
                        <option value="status">ステータス順</option>
                    </select>
                </div>
            </div>
            
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th style="width: 40px;"></th>
                            <th>タスク名</th>
                            <th>ステータス</th>
                            <th>担当者</th>
                            <th>期限</th>
                            <th>最終更新</th>
                        </tr>
                    </thead>
                    <tbody id="tasks-table-body">
                        ${renderTaskRows(tasks)}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderTaskRows(tasks) {
    return tasks.map(task => renderTaskRow(task)).join('');
}

function renderTaskRow(task) {
    const assignee = getUserById(task.assigneeId);
    const lastUpdater = getUserById(task.lastUpdatedBy);

    return `
        <tr class="task-row task-row-clickable" data-task-id="${task.id}">
            <td onclick="event.stopPropagation()">
                <input type="checkbox" ${task.status === '完了' ? 'checked' : ''} 
                       class="task-checkbox" data-task-id="${task.id}"
                       onclick="event.stopPropagation()">
            </td>
            <td>
                <div class="font-medium">${task.title}</div>
                ${task.description ? `<div class="text-sm text-tertiary">${task.description.substring(0, 60)}...</div>` : ''}
            </td>
            <td>
                <span class="badge ${getStatusBadgeClass(task.status)}">${task.status}</span>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    <img src="${assignee?.avatar}" alt="${assignee?.name}" class="avatar avatar-sm">
                    <span class="text-sm">${assignee?.name}</span>
                </div>
            </td>
            <td>
                <span class="text-sm">${formatDate(task.dueDate)}</span>
            </td>
            <td>
                <div class="text-xs text-tertiary">
                    ${lastUpdater?.name} ・ ${getRelativeTime(task.updatedAt)}
                </div>
            </td>
        </tr>
    `;
}

// ====================================
// Issues Tab
// ====================================
function renderIssuesTab(projectId) {
    const issues = getIssuesByProjectId(projectId);
    const users = getUsers();

    return `
        <div class="tab-content active">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
                <h3>Issue一覧 (${issues.length}件)</h3>
                <button class="btn btn-primary btn-sm" id="create-issue-btn">＋ 新規Issue</button>
            </div>
            
            <!-- Issue Filter Bar -->
            <div class="filter-bar" style="margin-bottom: var(--space-lg);">
                <div class="filter-group">
                    <span class="filter-label">ステータス:</span>
                    <select class="filter-select" id="issue-filter-status">
                        <option value="">全件</option>
                        <option value="未対応">未対応</option>
                        <option value="対応中">対応中</option>
                        <option value="確認待ち">確認待ち</option>
                        <option value="クローズ">クローズ</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <span class="filter-label">優先度:</span>
                    <select class="filter-select" id="issue-filter-priority">
                        <option value="">全件</option>
                        <option value="高">高</option>
                        <option value="中">中</option>
                        <option value="低">低</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <span class="filter-label">種類:</span>
                    <select class="filter-select" id="issue-filter-category">
                        <option value="">全件</option>
                        <option value="仕様抜け">仕様抜け</option>
                        <option value="実装バグ">実装バグ</option>
                        <option value="外部要因">外部要因</option>
                        <option value="その他">その他</option>
                    </select>
                </div>
            </div>
            
            <div id="issues-container" style="display: grid; gap: var(--space-md);">
                ${renderIssueCards(issues)}
            </div>
        </div>
    `;
}

function renderIssueCards(issues) {
    if (issues.length === 0) {
        return '<div class="empty-state"><p>Issueがありません</p></div>';
    }
    return issues.map(issue => renderIssueCard(issue)).join('');
}

function renderIssueCard(issue) {
    const assignee = getUserById(issue.assigneeId);

    return `
        <div class="card card-clickable issue-card issue-card-clickable" data-issue-id="${issue.id}">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-sm);">
                <h4 style="font-size: 1rem; font-weight: 600; flex: 1;">${issue.title}</h4>
                <div style="display: flex; gap: var(--space-xs);">
                    <span class="badge ${getStatusBadgeClass(issue.status)}">${issue.status}</span>
                    <span class="badge ${getPriorityBadgeClass(issue.priority)}">優先度: ${issue.priority}</span>
                </div>
            </div>
            
            <p class="text-sm text-secondary" style="margin-bottom: var(--space-md);">
                ${issue.description}
            </p>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    <img src="${assignee?.avatar}" alt="${assignee?.name}" class="avatar avatar-sm">
                    <span class="text-sm">${assignee?.name}</span>
                    <span class="badge badge-secondary text-xs">${issue.category}</span>
                </div>
                <span class="text-xs text-tertiary">${formatDateTime(issue.createdAt)}</span>
            </div>
        </div>
    `;
}

// ====================================
// Activity Tab
// ====================================
function renderActivityTab(projectId) {
    return `
        <div class="tab-content active">
            <h3 style="margin-bottom: var(--space-lg);">作業ログ</h3>
            ${renderRecentActivity(projectId)}
        </div>
    `;
}

function renderRecentActivity(projectId, limit = null) {
    let activities = getActivitiesByProjectId(projectId);
    if (limit) activities = activities.slice(0, limit);

    if (activities.length === 0) {
        return '<div class="empty-state"><p>まだアクティビティがありません</p></div>';
    }

    return `
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
            ${activities.map(activity => {
        const user = getUserById(activity.userId);
        return `
                    <div style="display: flex; gap: var(--space-md); padding: var(--space-md); border-radius: var(--radius-md); background: var(--color-gray-50);">
                        <img src="${user?.avatar}" alt="${user?.name}" class="avatar avatar-sm">
                        <div style="flex: 1;">
                            <div class="text-sm">
                                <strong>${user?.name}</strong> ${activity.content}
                            </div>
                            <div class="text-xs text-tertiary" style="margin-top: var(--space-xs);">
                                ${formatDateTime(activity.timestamp)}
                            </div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

// ====================================
// Handover Tab
// ====================================
function renderHandoverTab(projectId) {
    const note = getHandoverNoteByProjectId(projectId);

    // Check if in edit mode
    const isEditMode = window._handoverEditMode === true;

    if (!note && !isEditMode) {
        return `
            <div class="tab-content active">
                <div class="empty-state">
                    <h3>引き継ぎメモがまだ作成されていません</h3>
                    <p>案件の引き継ぎ情報を記録しましょう</p>
                    <button class="btn btn-primary" id="create-handover-btn">引き継ぎメモを作成</button>
                </div>
            </div>
        `;
    }

    if (isEditMode || !note) {
        // Edit/Create mode
        const noteData = note || {
            purpose: '',
            customerConcerns: '',
            technicalRisks: '',
            codeEntry: '',
            manualOperations: '',
            implicitRules: '',
            messageToNext: '',
            completed: false
        };

        return `
            <div class="tab-content active">
                <div class="card">
                    <h3 class="card-title">引き継ぎメモ ${note ? '編集' : '作成'}</h3>
                    <div class="card-body" style="display: flex; flex-direction: column; gap: var(--space-lg);">
                        <div class="form-group">
                            <label class="form-label">この案件の目的を一言で</label>
                            <textarea class="form-textarea" id="handover-purpose" rows="2">${noteData.purpose}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">顧客が特に気にしているポイント</label>
                            <textarea class="form-textarea" id="handover-concerns" rows="2">${noteData.customerConcerns}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">技術的な危険ポイント</label>
                            <textarea class="form-textarea" id="handover-risks" rows="2">${noteData.technicalRisks}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">コードの入口</label>
                            <textarea class="form-textarea" id="handover-entry" rows="2">${noteData.codeEntry}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">手動オペレーションが必要なフロー</label>
                            <textarea class="form-textarea" id="handover-manual" rows="2">${noteData.manualOperations}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">暗黙ルール・注意事項</label>
                            <textarea class="form-textarea" id="handover-rules" rows="2">${noteData.implicitRules}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">次の人へのメッセージ</label>
                            <textarea class="form-textarea" id="handover-message" rows="3">${noteData.messageToNext}</textarea>
                        </div>
                        
                        <div style="padding-top: var(--space-md); border-top: 1px solid var(--color-border);">
                            <label style="display: flex; align-items: center; gap: var(--space-sm); cursor: pointer;">
                                <input type="checkbox" id="handover-completed" ${noteData.completed ? 'checked' : ''}>
                                <span class="font-medium">引き継ぎ完了とする</span>
                            </label>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: var(--space-md); padding: var(--space-lg); border-top: 1px solid var(--color-border);">
                        <button class="btn btn-secondary" id="cancel-handover-btn">キャンセル</button>
                        <button class="btn btn-primary" id="save-handover-btn">保存</button>
                    </div>
                </div>
            </div>
        `;
    }

    // View mode
    return `
        <div class="tab-content active">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">引き継ぎメモ</h3>
                    <button class="btn btn-secondary btn-sm" id="edit-handover-btn">編集</button>
                </div>
                <div class="card-body" style="display: flex; flex-direction: column; gap: var(--space-lg);">
                    ${renderHandoverField('この案件の目的を一言で', note.purpose)}
                    ${renderHandoverField('顧客が特に気にしているポイント', note.customerConcerns)}
                    ${renderHandoverField('技術的な危険ポイント', note.technicalRisks)}
                    ${renderHandoverField('コードの入口', note.codeEntry)}
                    ${renderHandoverField('手動オペレーションが必要なフロー', note.manualOperations)}
                    ${renderHandoverField('暗黙ルール・注意事項', note.implicitRules)}
                    ${renderHandoverField('次の人へのメッセージ', note.messageToNext)}
                    
                    <div style="padding-top: var(--space-md); border-top: 1px solid var(--color-border);">
                        <label style="display: flex; align-items: center; gap: var(--space-sm);">
                            <input type="checkbox" ${note.completed ? 'checked' : ''} disabled>
                            <span class="font-medium ${note.completed ? 'text-success' : ''}">
                                ${note.completed ? '✓ 引き継ぎ完了' : '引き継ぎ未完了'}
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderHandoverField(label, content) {
    return `
        <div>
            <div class="text-sm font-semibold text-secondary" style="margin-bottom: var(--space-xs);">
                ${label}
            </div>
            <div class="text-sm" style="white-space: pre-wrap;">
                ${content || '-'}
            </div>
        </div>
    `;
}

// ====================================
// Event Handlers
// ====================================
function attachTabHandlers() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            activeTab = tab.dataset.tab;
            renderProjectDetail(currentProjectId);
        });
    });

    // Project menu button
    const projectMenuBtn = document.getElementById('project-menu-btn');
    const projectMenu = document.getElementById('project-menu');
    if (projectMenuBtn && projectMenu) {
        projectMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = projectMenu.style.display === 'block';
            projectMenu.style.display = isVisible ? 'none' : 'block';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!projectMenuBtn.contains(e.target) && !projectMenu.contains(e.target)) {
                projectMenu.style.display = 'none';
            }
        });

        // Edit project button
        const editProjectBtn = document.getElementById('edit-project-btn');
        if (editProjectBtn) {
            editProjectBtn.addEventListener('click', () => {
                import('../components/modal.js').then(({ showProjectEditModal }) => {
                    const project = getProjectById(currentProjectId);
                    showProjectEditModal(project, () => {
                        projectMenu.style.display = 'none';
                        renderProjectDetail(currentProjectId);
                    });
                });
            });
        }
    }

    // Add from template button
    const addFromTemplateBtn = document.getElementById('add-from-template-btn');
    if (addFromTemplateBtn) {
        addFromTemplateBtn.addEventListener('click', () => {
            import('../components/modal.js').then(({ showTemplateSelectModal }) => {
                showTemplateSelectModal(currentProjectId, () => {
                    renderProjectDetail(currentProjectId);
                });
            });
        });
    }

    // Project status change handler
    const projectStatusSelect = document.getElementById('project-status');
    if (projectStatusSelect) {
        projectStatusSelect.addEventListener('change', (e) => {
            const newStatus = e.target.value;
            const confirmed = confirm(`案件のステータスを「${newStatus}」に変更しますか？`);

            if (confirmed) {
                updateProjectStatus(currentProjectId, newStatus, 'user-001');
                // Refresh the view to show updated status in activity log
                renderProjectDetail(currentProjectId);
            } else {
                // Revert the select to original value
                const project = getProjectById(currentProjectId);
                e.target.value = project.status;
            }
        });
    }

    // Task checkboxes
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = e.target.dataset.taskId;
            const newStatus = e.target.checked ? '完了' : '未着手';
            updateTaskStatus(taskId, newStatus, 'user-001');
            renderProjectDetail(currentProjectId);
        });
    });

    // Task row clicks - open detail panel
    const taskRows = document.querySelectorAll('.task-row-clickable');
    taskRows.forEach(row => {
        row.addEventListener('click', () => {
            const taskId = row.dataset.taskId;
            showTaskPanel(taskId, () => {
                renderProjectDetail(currentProjectId);
            });
        });
    });

    // Create task button
    const createTaskBtn = document.getElementById('create-task-btn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', () => {
            import('../components/modal.js').then(({ showTaskCreateModal }) => {
                showTaskCreateModal(currentProjectId, () => {
                    renderProjectDetail(currentProjectId);
                });
            });
        });
    }

    // Task filter handlers
    const taskFilterStatus = document.getElementById('task-filter-status');
    const taskFilterAssignee = document.getElementById('task-filter-assignee');
    const taskSort = document.getElementById('task-sort');

    if (taskFilterStatus && taskFilterAssignee && taskSort) {
        const handleTaskFilter = () => {
            let tasks = getTasksByProjectId(currentProjectId);

            // Apply filters
            const statusFilter = taskFilterStatus.value;
            const assigneeFilter = taskFilterAssignee.value;

            if (statusFilter) {
                tasks = tasks.filter(t => t.status === statusFilter);
            }

            if (assigneeFilter) {
                tasks = tasks.filter(t => t.assigneeId === assigneeFilter);
            }

            // Apply sorting
            const sortBy = taskSort.value;
            if (sortBy === 'updated') {
                tasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            } else if (sortBy === 'dueDate') {
                tasks.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
            } else if (sortBy === 'status') {
                const statusOrder = { '未着手': 0, '作業中': 1, 'レビュー待ち': 2, '保留': 3, '完了': 4 };
                tasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            }

            // Re-render task rows
            const tbody = document.getElementById('tasks-table-body');
            if (tbody) {
                tbody.innerHTML = renderTaskRows(tasks);

                // Re-attach task row handlers
                const taskRows = tbody.querySelectorAll('.task-row-clickable');
                taskRows.forEach(row => {
                    row.addEventListener('click', () => {
                        const taskId = row.dataset.taskId;
                        showTaskPanel(taskId, () => {
                            renderProjectDetail(currentProjectId);
                        });
                    });
                });

                // Re-attach checkbox handlers
                const taskCheckboxes = tbody.querySelectorAll('.task-checkbox');
                taskCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', (e) => {
                        const taskId = e.target.dataset.taskId;
                        const newStatus = e.target.checked ? '完了' : '未着手';
                        updateTaskStatus(taskId, newStatus, 'user-001');
                        handleTaskFilter(); // Re-filter after update
                    });
                });
            }
        };

        taskFilterStatus.addEventListener('change', handleTaskFilter);
        taskFilterAssignee.addEventListener('change', handleTaskFilter);
        taskSort.addEventListener('change', handleTaskFilter);
    }

    // Create issue button
    const createIssueBtn = document.getElementById('create-issue-btn');
    if (createIssueBtn) {
        createIssueBtn.addEventListener('click', () => {
            showIssueCreateModal(currentProjectId, () => {
                renderProjectDetail(currentProjectId);
            });
        });
    }

    // Issue card clicks - open detail panel
    const issueCards = document.querySelectorAll('.issue-card-clickable');
    issueCards.forEach(card => {
        card.addEventListener('click', () => {
            const issueId = card.dataset.issueId;
            showIssuePanel(issueId, () => {
                renderProjectDetail(currentProjectId);
            });
        });
    });

    // Issue filter handlers
    const issueFilterStatus = document.getElementById('issue-filter-status');
    const issueFilterPriority = document.getElementById('issue-filter-priority');
    const issueFilterCategory = document.getElementById('issue-filter-category');

    if (issueFilterStatus && issueFilterPriority && issueFilterCategory) {
        const handleIssueFilter = () => {
            let issues = getIssuesByProjectId(currentProjectId);

            // Apply filters
            const statusFilter = issueFilterStatus.value;
            const priorityFilter = issueFilterPriority.value;
            const categoryFilter = issueFilterCategory.value;

            if (statusFilter) {
                issues = issues.filter(i => i.status === statusFilter);
            }

            if (priorityFilter) {
                issues = issues.filter(i => i.priority === priorityFilter);
            }

            if (categoryFilter) {
                issues = issues.filter(i => i.category === categoryFilter);
            }

            // Re-render issue cards
            const container = document.getElementById('issues-container');
            if (container) {
                container.innerHTML = renderIssueCards(issues);

                // Re-attach issue card handlers
                const cards = container.querySelectorAll('.issue-card-clickable');
                cards.forEach(card => {
                    card.addEventListener('click', () => {
                        const issueId = card.dataset.issueId;
                        showIssuePanel(issueId, () => {
                            renderProjectDetail(currentProjectId);
                        });
                    });
                });
            }
        };

        issueFilterStatus.addEventListener('change', handleIssueFilter);
        issueFilterPriority.addEventListener('change', handleIssueFilter);
        issueFilterCategory.addEventListener('change', handleIssueFilter);
    }

    // Handover note handlers
    const createHandoverBtn = document.getElementById('create-handover-btn');
    const editHandoverBtn = document.getElementById('edit-handover-btn');
    const saveHandoverBtn = document.getElementById('save-handover-btn');
    const cancelHandoverBtn = document.getElementById('cancel-handover-btn');

    if (createHandoverBtn) {
        createHandoverBtn.addEventListener('click', () => {
            window._handoverEditMode = true;
            renderProjectDetail(currentProjectId);
        });
    }

    if (editHandoverBtn) {
        editHandoverBtn.addEventListener('click', () => {
            window._handoverEditMode = true;
            renderProjectDetail(currentProjectId);
        });
    }

    if (saveHandoverBtn) {
        saveHandoverBtn.addEventListener('click', () => {
            saveHandoverNote(currentProjectId);
        });
    }

    if (cancelHandoverBtn) {
        cancelHandoverBtn.addEventListener('click', () => {
            window._handoverEditMode = false;
            renderProjectDetail(currentProjectId);
        });
    }
}

function saveHandoverNote(projectId) {
    const purpose = document.getElementById('handover-purpose').value.trim();
    const customerConcerns = document.getElementById('handover-concerns').value.trim();
    const technicalRisks = document.getElementById('handover-risks').value.trim();
    const codeEntry = document.getElementById('handover-entry').value.trim();
    const manualOperations = document.getElementById('handover-manual').value.trim();
    const implicitRules = document.getElementById('handover-rules').value.trim();
    const messageToNext = document.getElementById('handover-message').value.trim();
    const completed = document.getElementById('handover-completed').checked;

    const data = getData();
    const existingNoteIndex = data.handoverNotes.findIndex(n => n.projectId === projectId);

    const noteData = {
        purpose,
        customerConcerns,
        technicalRisks,
        codeEntry,
        manualOperations,
        implicitRules,
        messageToNext,
        completed,
        writtenBy: 'user-001',
        updatedAt: new Date().toISOString()
    };

    if (existingNoteIndex !== -1) {
        // Update existing note
        data.handoverNotes[existingNoteIndex] = {
            ...data.handoverNotes[existingNoteIndex],
            ...noteData
        };
    } else {
        // Create new note
        data.handoverNotes.push({
            id: `handover-${Date.now()}`,
            projectId,
            createdAt: new Date().toISOString(),
            ...noteData
        });
    }

    // Add activity
    data.activities.push({
        id: `act-${Date.now()}`,
        projectId,
        userId: 'user-001',
        type: 'handover_updated',
        targetId: projectId,
        targetType: 'handover',
        content: `引き継ぎメモを${existingNoteIndex !== -1 ? '更新' : '作成'}`,
        timestamp: new Date().toISOString()
    });

    saveData(data);
    window._handoverEditMode = false;
    renderProjectDetail(projectId);
}

// ====================================
// Project Links Functions
// ====================================
function renderProjectLinks(links) {
    if (!links || links.length === 0) {
        return `
            <div style="text-align: center; padding: var(--space-2xl); color: var(--color-text-secondary);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin: 0 auto var(--space-md); opacity: 0.3;">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>外部リンクが登録されていません</p>
                <p style="font-size: 0.875rem; margin-top: var(--space-xs);">GitHub、Render、その他のサービスへのリンクを追加できます</p>
            </div>
        `;
    }

    const linkIcons = {
        'github': '🐙',
        'render': '🚀',
        'vercel': '▲',
        'netlify': '🔷',
        'heroku': '💜',
        'aws': '☁️',
        'azure': '🌐',
        'docs': '📚',
        'staging': '🧪',
        'production': '🌟',
        'other': '🔗'
    };

    return `
        <div style="display: grid; gap: var(--space-sm);">
            ${links.map((link, index) => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--color-gray-50); border: 1px solid var(--color-border); border-radius: var(--radius-md); text-decoration: none; transition: all 0.2s; color: inherit;">
                    <div style="font-size: 1.5rem; flex-shrink: 0;">
                        ${linkIcons[link.type] || linkIcons['other']}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 600; font-size: 0.9375rem; margin-bottom: 2px;">${link.label}</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${link.url}</div>
                    </div>
                    <div style="flex-shrink: 0;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <polyline points="15 3 21 3 21 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <line x1="10" y1="14" x2="21" y2="3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </a>
            `).join('')}
        </div>
        
        <style>
            a:hover {
                background: var(--color-primary) !important;
                color: white !important;
                border-color: var(--color-primary) !important;
                transform: translateX(4px);
            }
            a:hover div {
                color: white !important;
            }
        </style>
    `;
}

window.editProjectLinks = function (projectId) {
    import('../components/modal.js').then(({ showModal, closeModal }) => {
        import('../data.js').then(({ getData, saveData, getProjectById }) => {
            const project = getProjectById(projectId);
            if (!project) return;

            const links = project.links || [];

            const content = `
                <form id="project-links-form">
                    <div id="links-container">
                        ${links.map((link, index) => `
                            <div class="link-row" style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md);">
                                <div class="form-group" style="flex: 1; margin: 0;">
                                    <label class="form-label">種別</label>
                                    <select class="form-select" name="link-type-${index}">
                                        <option value="github" ${link.type === 'github' ? 'selected' : ''}>🐙 GitHub</option>
                                        <option value="render" ${link.type === 'render' ? 'selected' : ''}>🚀 Render</option>
                                        <option value="vercel" ${link.type === 'vercel' ? 'selected' : ''}>▲ Vercel</option>
                                        <option value="netlify" ${link.type === 'netlify' ? 'selected' : ''}>🔷 Netlify</option>
                                        <option value="heroku" ${link.type === 'heroku' ? 'selected' : ''}>💜 Heroku</option>
                                        <option value="aws" ${link.type === 'aws' ? 'selected' : ''}>☁️ AWS</option>
                                        <option value="azure" ${link.type === 'azure' ? 'selected' : ''}>🌐 Azure</option>
                                        <option value="docs" ${link.type === 'docs' ? 'selected' : ''}>📚 Docs</option>
                                        <option value="staging" ${link.type === 'staging' ? 'selected' : ''}>🧪 Staging</option>
                                        <option value="production" ${link.type === 'production' ? 'selected' : ''}>🌟 Production</option>
                                        <option value="other" ${link.type === 'other' ? 'selected' : ''}>🔗 その他</option>
                                    </select>
                                </div>
                                <div class="form-group" style="flex: 2; margin: 0;">
                                    <label class="form-label">ラベル</label>
                                    <input type="text" class="form-input" name="link-label-${index}" value="${link.label}" placeholder="例: GitHub Repository">
                                </div>
                                <div class="form-group" style="flex: 3; margin: 0;">
                                    <label class="form-label">URL</label>
                                    <input type="url" class="form-input" name="link-url-${index}" value="${link.url}" placeholder="https://...">
                                </div>
                                <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.link-row').remove()" style="align-self: flex-end; height: 38px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button type="button" class="btn btn-secondary" onclick="addNewLinkRow()" style="width: 100%;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        リンクを追加
                    </button>
                </form>
            `;

            const footer = `
                <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
                <button class="btn btn-primary" onclick="saveProjectLinks('${projectId}')">保存</button>
            `;

            showModal('🔗 関連リンクを編集', content, footer);

            // Add new link row function
            window.addNewLinkRow = () => {
                const container = document.getElementById('links-container');
                const newIndex = container.children.length;
                const newRow = document.createElement('div');
                newRow.className = 'link-row';
                newRow.style.cssText = 'display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md);';
                newRow.innerHTML = `
                    <div class="form-group" style="flex: 1; margin: 0;">
                        <label class="form-label">種別</label>
                        <select class="form-select" name="link-type-${newIndex}">
                            <option value="github">🐙 GitHub</option>
                            <option value="render">🚀 Render</option>
                            <option value="vercel">▲ Vercel</option>
                            <option value="netlify">🔷 Netlify</option>
                            <option value="heroku">💜 Heroku</option>
                            <option value="aws">☁️ AWS</option>
                            <option value="azure">🌐 Azure</option>
                            <option value="docs">📚 Docs</option>
                            <option value="staging">🧪 Staging</option>
                            <option value="production">🌟 Production</option>
                            <option value="other">🔗 その他</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 2; margin: 0;">
                        <label class="form-label">ラベル</label>
                        <input type="text" class="form-input" name="link-label-${newIndex}" placeholder="例: GitHub Repository">
                    </div>
                    <div class="form-group" style="flex: 3; margin: 0;">
                        <label class="form-label">URL</label>
                        <input type="url" class="form-input" name="link-url-${newIndex}" placeholder="https://...">
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.link-row').remove()" style="align-self: flex-end; height: 38px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                `;
                container.appendChild(newRow);
            };

            // Save links function
            window.saveProjectLinks = (projectId) => {
                const form = document.getElementById('project-links-form');
                const linkRows = form.querySelectorAll('.link-row');
                const newLinks = [];

                linkRows.forEach((row, index) => {
                    const type = form.querySelector(`[name="link-type-${index}"]`)?.value;
                    const label = form.querySelector(`[name="link-label-${index}"]`)?.value;
                    const url = form.querySelector(`[name="link-url-${index}"]`)?.value;

                    if (url && url.trim()) {
                        newLinks.push({
                            type: type || 'other',
                            label: label || url,
                            url: url.trim()
                        });
                    }
                });

                const data = getData();
                const projectIndex = data.projects.findIndex(p => p.id === projectId);

                if (projectIndex !== -1) {
                    data.projects[projectIndex].links = newLinks;
                    saveData(data);
                    closeModal();
                    renderProjectDetail(projectId);
                }
            };
        });
    });
};

export default renderProjectDetail;

