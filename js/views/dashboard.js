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
        <div class="dashboard-header" style="margin-bottom: var(--space-2xl);">
            <h1 style="font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: var(--space-sm);">ダッシュボード</h1>
            <p class="text-secondary" style="margin-top: var(--space-sm); font-size: 1rem;">
                全${projects.length}件の案件を管理しています
            </p>
        </div>
        
        <!-- Enhanced Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-2xl);">
            <!-- Active Projects Card -->
            <div class="card animate-scale-in" style="padding: var(--space-lg); border: 2px solid #2563eb30; position: relative; overflow: hidden; animation-delay: 0s;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, #2563eb08 0%, transparent 100%); pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                        <div style="font-size: 0.8125rem; font-weight: 600; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">進行中</div>
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #2563eb15 0%, #2563eb08 100%); border: 2px solid #2563eb30; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">💻</div>
                    </div>
                    <div style="font-size: 2.5rem; font-weight: 800; color: #2563eb; line-height: 1; margin-bottom: var(--space-xs);">${stats.active}</div>
                    <div style="font-size: 0.8125rem; color: var(--color-text-secondary);">開発中・検収中の案件</div>
                </div>
            </div>
            
            <!-- Estimate Projects Card -->
            <div class="card animate-scale-in" style="padding: var(--space-lg); border: 2px solid #f59e0b30; position: relative; overflow: hidden; animation-delay: 0.1s;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, #f59e0b08 0%, transparent 100%); pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                        <div style="font-size: 0.8125rem; font-weight: 600; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">見積中</div>
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b15 0%, #f59e0b08 100%); border: 2px solid #f59e0b30; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">📊</div>
                    </div>
                    <div style="font-size: 2.5rem; font-weight: 800; color: #f59e0b; line-height: 1; margin-bottom: var(--space-xs);">${stats.estimate}</div>
                    <div style="font-size: 0.8125rem; color: var(--color-text-secondary);">提案フェーズの案件</div>
                </div>
            </div>
            
            <!-- Completed Projects Card -->
            <div class="card animate-scale-in" style="padding: var(--space-lg); border: 2px solid #10b98130; position: relative; overflow: hidden; animation-delay: 0.2s;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, #10b98108 0%, transparent 100%); pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                        <div style="font-size: 0.8125rem; font-weight: 600; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">完了</div>
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b98115 0%, #10b98108 100%); border: 2px solid #10b98130; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">✅</div>
                    </div>
                    <div style="font-size: 2.5rem; font-weight: 800; color: #10b981; line-height: 1; margin-bottom: var(--space-xs);">${stats.completed}</div>
                    <div style="font-size: 0.8125rem; color: var(--color-text-secondary);">納品済みの案件</div>
                </div>
            </div>
            
            ${overdueProjects > 0 ? `
                <!-- Overdue Projects Card with Alert -->
                <div class="card animate-scale-in animate-pulse" style="padding: var(--space-lg); border: 2px solid #ef444440; position: relative; overflow: hidden; animation-delay: 0.3s;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                            <div style="font-size: 0.8125rem; font-weight: 700; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">⚠️ 期限超過</div>
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ef444420 0%, #ef444410 100%); border: 2px solid #ef444450; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">🚨</div>
                        </div>
                        <div style="font-size: 2.5rem; font-weight: 800; color: #ef4444; line-height: 1; margin-bottom: var(--space-xs);">${overdueProjects}</div>
                        <div style="font-size: 0.8125rem; color: #ef4444; font-weight: 600;">要注意案件</div>
                    </div>
                </div>
            ` : ''}
        </div>
        
        <style>
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .animate-scale-in {
                animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                opacity: 0;
            }
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
                        <span class="text-sm text-success">✓ ${totalIssues}</span>
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
