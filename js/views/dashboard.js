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
        
        <!-- Enhanced Summary Cards -->
        <!-- Enhanced Summary Cards -->
        <div class="grid-cards mb-2xl">
            <!-- Active Projects Card -->
            <div class="card animate-scale-in hover-glow-primary" style="animation-delay: 0s; border-color: rgba(37, 99, 235, 0.2);">
                <div class="card-bg-gradient" style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, transparent 100%);"></div>
                <div class="relative z-10">
                    <div class="flex justify-between items-center mb-md">
                        <div class="text-xs font-semibold text-tertiary uppercase tracking-wider">進行中</div>
                        <div class="icon-box bg-primary-subtle text-xl">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="text-4xl font-bold text-primary leading-none mb-xs">${stats.active}</div>
                    <div class="text-xs text-secondary">開発中・検収中の案件</div>
                </div>
            </div>
            
            <!-- Estimate Projects Card -->
            <div class="card animate-scale-in hover-glow-warning" style="animation-delay: 0.1s; border-color: rgba(245, 158, 11, 0.2);">
                <div class="card-bg-gradient" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%);"></div>
                <div class="relative z-10">
                    <div class="flex justify-between items-center mb-md">
                        <div class="text-xs font-semibold text-tertiary uppercase tracking-wider">見積中</div>
                        <div class="icon-box bg-warning-subtle text-xl">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="text-4xl font-bold text-warning leading-none mb-xs">${stats.estimate}</div>
                    <div class="text-xs text-secondary">提案フェーズの案件</div>
                </div>
            </div>
            
            <!-- Completed Projects Card -->
            <div class="card animate-scale-in hover-glow-success" style="animation-delay: 0.2s; border-color: rgba(16, 185, 129, 0.2);">
                <div class="card-bg-gradient" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%);"></div>
                <div class="relative z-10">
                    <div class="flex justify-between items-center mb-md">
                        <div class="text-xs font-semibold text-tertiary uppercase tracking-wider">完了</div>
                        <div class="icon-box bg-success-subtle text-xl">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="text-4xl font-bold text-success leading-none mb-xs">${stats.completed}</div>
                    <div class="text-xs text-secondary">納品済みの案件</div>
                </div>
            </div>
            
            ${overdueProjects > 0 ? `
                <!-- Overdue Projects Card with Alert -->
                <div class="card animate-scale-in animate-pulse hover-glow-danger" style="animation-delay: 0.3s; border-color: rgba(239, 68, 68, 0.3);">
                    <div class="card-bg-gradient" style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%);"></div>
                    <div class="relative z-10">
                        <div class="flex justify-between items-center mb-md">
                            <div class="text-xs font-bold text-danger uppercase tracking-wider">
                                <span style="display: inline-flex; vertical-align: middle; margin-right: 4px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </span>
                                期限超過
                            </div>
                            <div class="icon-box bg-danger-subtle text-xl">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                        </div>
                        <div class="text-4xl font-bold text-danger leading-none mb-xs">${overdueProjects}</div>
                        <div class="text-xs text-danger font-semibold">要注意案件</div>
                    </div>
                </div>
            ` : ''}
        </div>
        
        <style>
            .grid-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: var(--space-lg);
            }
            .card-bg-gradient {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
            }
            .icon-box {
                width: 40px;
                height: 40px;
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .bg-primary-subtle { background: rgba(37, 99, 235, 0.1); color: var(--color-primary); }
            .bg-warning-subtle { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
            .bg-success-subtle { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
            .bg-danger-subtle { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); }
            
            .text-4xl { font-size: 2.5rem; }
            .leading-none { line-height: 1; }
            .tracking-wider { letter-spacing: 0.05em; }
            .uppercase { text-transform: uppercase; }
            .relative { position: relative; }
            .z-10 { z-index: 10; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .mb-xs { margin-bottom: var(--space-xs); }
            .mb-sm { margin-bottom: var(--space-sm); }
            .mb-md { margin-bottom: var(--space-md); }
            .mb-2xl { margin-bottom: var(--space-2xl); }
            .mt-sm { margin-top: var(--space-sm); }
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
