// ====================================
// Dashboard View
// ====================================

import {
    getProjects,
    getClients,
    getUsers,
    getUserById,
    getClientById,
    getIssuesByProjectId,
    calculateProjectProgress
} from '../data.js';

import {
    formatDate,
    formatCurrency,
    getStatusBadgeClass,
    isOverdue
} from '../utils/helpers.js';

import { showProjectCreateModal } from '../components/modal.js';

export function renderDashboard() {
    const main = document.getElementById('app-main');

    const projects = getProjects();
    const clients = getClients();
    const users = getUsers();

    // Calculate statistics
    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === '開発中' || p.status === '検収中').length,
        estimate: projects.filter(p => p.status === '見積中').length,
        completed: projects.filter(p => p.status === '完了').length,
        onHold: projects.filter(p => p.status === '保留').length
    };

    // Calculate overdue projects
    const today = new Date();
    const overdueProjects = projects.filter(p => {
        if (!p.dueDate) return false;
        return new Date(p.dueDate) < today && p.status !== '完了';
    }).length;

    const html = `
        <div class="dashboard-header mb-2xl">
            <h1 class="text-2xl font-bold gradient-text mb-sm">ダッシュボード</h1>
            <p class="text-secondary text-lg mt-sm">
                全${projects.length}件の案件を管理しています
            </p>
        </div>
        
        <!-- Summary Stats (Simple List) -->
        <div class="stats-list mb-2xl">
            <div class="stats-item">
                <span class="stats-label">進行中</span>
                <span class="stats-value text-primary">${stats.active}</span>
                <span class="stats-desc">開発中・検収中の案件</span>
            </div>
            <div class="stats-divider"></div>
            <div class="stats-item">
                <span class="stats-label">見積中</span>
                <span class="stats-value text-warning">${stats.estimate}</span>
                <span class="stats-desc">提案フェーズの案件</span>
            </div>
            <div class="stats-divider"></div>
            <div class="stats-item">
                <span class="stats-label">完了</span>
                <span class="stats-value text-success">${stats.completed}</span>
                <span class="stats-desc">納品済みの案件</span>
            </div>
            ${overdueProjects > 0 ? `
            <div class="stats-divider"></div>
            <div class="stats-item stats-item-danger">
                <span class="stats-label text-danger">期限超過</span>
                <span class="stats-value text-danger">${overdueProjects}</span>
                <span class="stats-desc text-danger">要注意案件</span>
            </div>
            ` : ''}
        </div>

        <style>
            .stats-list {
                display: flex;
                align-items: center;
                gap: var(--space-xl);
                padding: var(--space-lg) 0;
                border-bottom: 1px solid var(--color-border);
            }
            .stats-item {
                display: flex;
                align-items: baseline;
                gap: var(--space-md);
            }
            .stats-item-danger {
                background: rgba(239, 68, 68, 0.05);
                padding: var(--space-sm) var(--space-md);
                border-radius: var(--radius-md);
            }
            .stats-label {
                font-size: 1.125rem;
                font-weight: 600;
                color: var(--color-text);
            }
            .stats-value {
                font-size: 2rem;
                font-weight: 700;
            }
            .stats-desc {
                font-size: 0.9375rem;
                color: var(--color-text-secondary);
            }
            .stats-divider {
                width: 1px;
                height: 40px;
                background: var(--color-border);
            }
            .mb-2xl { margin-bottom: var(--space-2xl); }
        </style>
        
        <!-- Filter Bar -->
        <div class="filter-bar">
            <div class="filter-group">
                <span class="filter-label">ステータス:</span>
                <select class="filter-select" id="filter-status">
                    <option value="">全件</option>
                    <option value="見積中">見積中</option>
                    <option value="開発中">開発中</option>
                    <option value="検収中">検収中</option>
                    <option value="運用中">運用中</option>
                    <option value="完了">完了</option>
                    <option value="保留">保留</option>
                </select>
            </div>
            
            <div class="filter-group">
                <span class="filter-label">担当者:</span>
                <select class="filter-select" id="filter-assignee">
                    <option value="">全員</option>
                    ${users.map(user => `
                        <option value="${user.id}">${user.name}</option>
                    `).join('')}
                </select>
            </div>
            
            <div class="filter-group">
                <span class="filter-label">顧客:</span>
                <select class="filter-select" id="filter-client">
                    <option value="">全顧客</option>
                    ${clients.map(client => `
                        <option value="${client.id}">${client.name}</option>
                    `).join('')}
                </select>
            </div>
            
            <div style="margin-left: auto;">
                <button class="btn btn-primary" id="create-project-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    新規案件を作成
                </button>
            </div>
        </div>
        
        <!-- Projects Table -->
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>案件名</th>
                        <th>ステータス</th>
                        <th style="width: 200px;">進捗</th>
                        <th>担当</th>
                        <th>納期</th>
                        <th>Issue</th>
                        <th>金額</th>
                    </tr>
                </thead>
                <tbody id="projects-table-body">
                    ${renderProjectRows(projects)}
                </tbody>
            </table>
        </div>
    `;


    main.innerHTML = html;

    // Attach filter event listeners
    document.getElementById('filter-status').addEventListener('change', handleFilterChange);
    document.getElementById('filter-assignee').addEventListener('change', handleFilterChange);
    document.getElementById('filter-client').addEventListener('change', handleFilterChange);

    // Attach create project button handler
    document.getElementById('create-project-btn').addEventListener('click', () => {
        showProjectCreateModal((newProject) => {
            window.dispatchEvent(new CustomEvent('navigate', {
                detail: { route: 'project-detail', projectId: newProject.id }
            }));
        });
    });

    // Attach row click handlers
    attachProjectRowHandlers();

    // Update issue counts dynamically
    updateIssueCountsForProjects(projects);
}

function updateIssueCountsForProjects(projects) {
    import('./projectDetail.js').then(() => {
        projects.forEach(project => {
            const issues = getIssuesByProjectId(project.id);
            const openIssues = issues.filter(i => i.status !== 'クローズ').length;
            const totalIssues = issues.length;

            const cell = document.getElementById(`issue-count-${project.id}`);
            if (cell) {
                if (openIssues > 0) {
                    cell.innerHTML = `
                        <span class="badge badge-danger">${openIssues}</span>
                        <span class="text-tertiary text-xs"> / ${totalIssues}</span>
                    `;
                } else if (totalIssues > 0) {
                    cell.innerHTML = `
                        <span class="text-sm text-success">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            ${totalIssues}
                        </span>
                    `;
                } else {
                    cell.innerHTML = `<span class="text-sm text-tertiary">-</span>`;
                }
            }
        });
    });
}

function renderProjectRows(projects) {
    return projects.map(project => {
        const client = getClientById(project.clientId);
        const mainAssignee = getUserById(project.mainAssignee);
        const progress = calculateProjectProgress(project.id);
        const progressClass = progress >= 70 ? 'progress-success' : progress >= 40 ? 'progress' : 'progress-warning';
        const isDateOverdue = isOverdue(project.dueDate);

        // Calculate issue counts
        import('../data.js').then(({ getIssuesByProjectId }) => {
            const issues = getIssuesByProjectId(project.id);
            const openIssues = issues.filter(i => i.status !== 'クローズ').length;
            const totalIssues = issues.length;

            // Store for use in rendering
            project._issueStats = { open: openIssues, total: totalIssues };
        });

        return `
            <tr class="project-row" data-project-id="${project.id}">
                <td>
                    <div style="font-weight: 600; color: var(--color-text); margin-bottom: 4px;">
                        ${project.name}
                    </div>
                    <div class="text-sm text-tertiary">
                        ${client?.name || '不明な顧客'}
                    </div>
                </td>
                <td>
                    <span class="badge ${getStatusBadgeClass(project.status)}">
                        ${project.status}
                    </span>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                        <div class="${progressClass}" style="flex: 1;">
                            <div class="progress-bar" style="width: ${progress}%"></div>
                        </div>
                        <span class="text-sm font-medium">${progress}%</span>
                    </div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                        <img src="${mainAssignee?.avatar}" alt="${mainAssignee?.name}" 
                             class="avatar avatar-sm">
                        <span class="text-sm">${mainAssignee?.name || '未割当'}</span>
                    </div>
                </td>
                <td>
                    <span class="text-sm ${isDateOverdue ? 'text-danger font-semibold' : ''}">
                        ${formatDate(project.dueDate)}
                    </span>
                </td>
                <td id="issue-count-${project.id}">
                    <span class="text-sm text-tertiary">...</span>
                </td>
                <td>
                    <span class="text-sm font-medium">
                        ${formatCurrency(project.price)}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

function handleFilterChange() {
    const statusFilter = document.getElementById('filter-status').value;
    const assigneeFilter = document.getElementById('filter-assignee').value;
    const clientFilter = document.getElementById('filter-client').value;

    let projects = getProjects();

    if (statusFilter) {
        projects = projects.filter(p => p.status === statusFilter);
    }

    if (assigneeFilter) {
        projects = projects.filter(p => p.assignees.includes(assigneeFilter));
    }

    if (clientFilter) {
        projects = projects.filter(p => p.clientId === clientFilter);
    }

    const tbody = document.getElementById('projects-table-body');
    tbody.innerHTML = renderProjectRows(projects);
    attachProjectRowHandlers();
}

function attachProjectRowHandlers() {
    const rows = document.querySelectorAll('.project-row');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            const projectId = row.dataset.projectId;
            window.dispatchEvent(new CustomEvent('navigate', {
                detail: { route: 'project-detail', projectId }
            }));
        });
    });
}

// ====================================
// Export
// ====================================
export default renderDashboard;
