// ====================================
// Projects List View
// ====================================

import {
    getProjects,
    getClients,
    getUsers,
    getUserById,
    getClientById,
    calculateProjectProgress,
    getIssuesByProjectId
} from '../data.js';
import { formatDate, formatCurrency } from '../utils/helpers.js';
import { showProjectCreateModal } from '../components/modal.js';

export default function renderProjects() {
    const main = document.getElementById('app-main');

    const projects = getProjects();
    const clients = getClients();
    const users = getUsers();

    // Get unique statuses
    const statuses = [...new Set(projects.map(p => p.status))];

    main.innerHTML = `
        <div class="page-container">
            <!-- Page Header -->
            <div class="page-header">
                <div class="page-header-left">
                    <h1 class="page-title">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: bottom; margin-right: 8px;">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                        案件一覧
                    </h1>
                    <p class="page-subtitle">${projects.length}件の案件</p>
                </div>
                <div class="page-header-right">
                    <button class="btn btn-primary" onclick="createNewProject()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        新規案件を作成
                    </button>
                </div>
            </div>

            <!-- Filter Bar -->
            <div class="filter-bar">
                <div class="filter-group">
                    <select id="filter-status" class="filter-select">
                        <option value="">全ステータス</option>
                        ${statuses.map(status => `<option value="${status}">${status}</option>`).join('')}
                    </select>
                    
                    <select id="filter-assignee" class="filter-select">
                        <option value="">全担当者</option>
                        ${users.map(user => `<option value="${user.id}">${user.name}</option>`).join('')}
                    </select>
                    
                    <select id="filter-client" class="filter-select">
                        <option value="">全顧客</option>
                        ${clients.map(client => `<option value="${client.id}">${client.name}</option>`).join('')}
                    </select>
                </div>
                
                <div class="filter-group">
                    <select id="sort-by" class="filter-select">
                        <option value="updated">最終更新日</option>
                        <option value="dueDate">納期順</option>
                        <option value="created">作成日</option>
                        <option value="name">案件名</option>
                    </select>
                </div>
            </div>

            <!-- Compact Projects List -->
            <div id="projects-list" style="display: flex; flex-direction: column; gap: var(--space-sm);">
                ${renderProjectRows(projects)}
            </div>
        </div>
    `;

    // Attach event listeners
    setupFilterListeners();
}

function renderProjectRows(projects) {
    if (projects.length === 0) {
        return `
            <div class="empty-state" style="min-height: 400px;">
                <h3>条件に一致する案件がありません</h3>
                <p>フィルターを変更するか、新しい案件を作成してください</p>
            </div>
        `;
    }

    return projects.map(project => renderCompactProjectRow(project)).join('');
}

function renderCompactProjectRow(project) {
    const client = getClientById(project.clientId);
    const mainAssignee = getUserById(project.mainAssignee);
    const progress = calculateProjectProgress(project.id);
    const issues = getIssuesByProjectId(project.id);
    const openIssues = issues.filter(i => i.status !== 'クローズ').length;

    // Check if due date is overdue
    const dueDate = new Date(project.dueDate);
    const today = new Date();
    const isOverdue = dueDate < today && project.status !== '完了' && project.status !== '運用中';
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    // Status configuration with SVG icons and new muted colors
    const statusConfig = {
        '見積中': {
            color: '#d97706', // Amber 600
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
            gradient: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)'
        },
        '開発中': {
            color: '#4f46e5', // Indigo 600
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
            gradient: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)'
        },
        '検収中': {
            color: '#0891b2', // Cyan 600
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
            gradient: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)'
        },
        '運用中': {
            color: '#7c3aed', // Violet 600
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.1 4-1 4-1s.38 2.38-1 4z"></path><path d="M15 13v5s3.03-.55 4-2c1.1-1.62 1-4 1-4s-2.38-.38-4 1z"></path></svg>',
            gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
        },
        '完了': {
            color: '#059669', // Emerald 600
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
        },
        '保留': {
            color: '#64748b', // Slate 500
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
            gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        },
        '中止': {
            color: '#e11d48', // Rose 600
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            gradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)'
        }
    };

    const config = statusConfig[project.status] || statusConfig['見積中'];

    // Progress bar color with gradients (Muted)
    let progressColor = '#e11d48'; // Rose 600
    let progressGradient = 'linear-gradient(90deg, #e11d48 0%, #be123c 100%)';
    if (progress >= 70) {
        progressColor = '#059669'; // Emerald 600
        progressGradient = 'linear-gradient(90deg, #059669 0%, #047857 100%)';
    } else if (progress >= 40) {
        progressColor = '#d97706'; // Amber 600
        progressGradient = 'linear-gradient(90deg, #d97706 0%, #b45309 100%)';
    }

    return `
        <div class="project-row-compact" onclick="window.navigate('project-detail', '${project.id}')" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: white; border: 1px solid var(--color-border); border-radius: var(--radius-md); transition: all 0.2s; cursor: pointer;">
                <!-- Status Icon -->
                <div style="width: 40px; height: 40px; background: var(--color-gray-100); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary); flex-shrink: 0;">
                    ${config.icon}
                </div>

                <!-- Main Info -->
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; font-size: 0.9375rem; color: var(--color-text); margin-bottom: 2px;">
                        ${project.name}
                    </div>
                    <div style="font-size: 0.8125rem; color: var(--color-text-tertiary);">
                        ${client?.name || ''}
                    </div>
                </div>

                <!-- Progress -->
                <div style="display: flex; align-items: center; gap: var(--space-sm); min-width: 160px;">
                    <div style="flex: 1; height: 6px; background: var(--color-gray-200); border-radius: var(--radius-full); overflow: hidden;">
                        <div style="height: 100%; width: ${progress}%; background: var(--color-primary); border-radius: var(--radius-full);"></div>
                    </div>
                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--color-text); width: 36px; text-align: right;">
                        ${progress}%
                    </span>
                </div>

                <!-- Assignee -->
                <div style="display: flex; align-items: center; gap: var(--space-sm); min-width: 100px;">
                    <img src="${mainAssignee?.avatar}" alt="${mainAssignee?.name}" style="width: 28px; height: 28px; border-radius: var(--radius-full);">
                    <span style="font-size: 0.8125rem; color: var(--color-text-secondary);">
                        ${mainAssignee?.name || ''}
                    </span>
                </div>

                <!-- Due Date -->
                <div style="min-width: 90px; text-align: center;">
                    <div style="font-size: 0.8125rem; ${isOverdue ? 'color: var(--color-danger); font-weight: 600;' : 'color: var(--color-text-secondary);'}">
                        ${formatDate(project.dueDate)}
                    </div>
                </div>

                <!-- Issues -->
                <div style="min-width: 50px; text-align: center;">
                    ${openIssues > 0 ? `
                        <span style="display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; background: var(--color-danger-subtle); color: var(--color-danger); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600;">
                            ${openIssues}
                        </span>
                    ` : `
                        <span style="font-size: 0.8125rem; color: var(--color-text-tertiary);">-</span>
                    `}
                </div>

                <!-- Price -->
                <div style="min-width: 100px; text-align: right;">
                    <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-text);">
                        ${formatCurrency(project.price)}
                    </span>
                </div>

                <!-- Status Badge -->
                <span style="display: inline-flex; padding: 4px 10px; background: var(--color-gray-100); color: var(--color-text-secondary); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 500; min-width: 70px; justify-content: center;">
                    ${project.status}
                </span>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .animate-fade-in {
                animation: fadeIn 0.4s ease-out;
            }
            
        <style>
            .project-row-compact:hover {
                border-left-width: 10px;
                box-shadow: var(--shadow-lg);
                transform: translateX(6px) translateY(-2px);
            }
            
            .project-row-compact:hover > div:first-child {
                opacity: 0.7;
            }
            
            .project-row-compact:active {
                transform: translateX(3px) translateY(0);
            }

            .due-date-card {
                min-width: 110px;
                text-align: center;
                padding: var(--space-sm) var(--space-md);
                background: white;
                border: 2px solid var(--color-border);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-sm);
            }
            .due-date-card.overdue {
                background: #fef2f2;
                border-color: rgba(239, 68, 68, 0.3);
            }
            .due-date-card .date-text {
                font-size: 0.875rem;
                font-weight: 700;
                color: var(--color-text);
            }
            .due-date-card.overdue .date-text { color: var(--color-danger); }
            
            .status-text {
                font-size: 0.625rem;
                font-weight: 700;
                text-transform: uppercase;
                margin-top: 2px;
            }
            .status-text.overdue { color: var(--color-danger); }
            .status-text.warning { color: var(--color-warning); }
        </style>
    `;
}

function setupFilterListeners() {
    const filterStatus = document.getElementById('filter-status');
    const filterAssignee = document.getElementById('filter-assignee');
    const filterClient = document.getElementById('filter-client');
    const sortBy = document.getElementById('sort-by');

    const applyFilters = () => {
        let projects = getProjects();

        // Apply filters
        if (filterStatus.value) {
            projects = projects.filter(p => p.status === filterStatus.value);
        }

        if (filterAssignee.value) {
            projects = projects.filter(p =>
                p.assignees.includes(filterAssignee.value) ||
                p.mainAssignee === filterAssignee.value
            );
        }

        if (filterClient.value) {
            projects = projects.filter(p => p.clientId === filterClient.value);
        }

        // Apply sorting
        const sortValue = sortBy.value;
        if (sortValue === 'updated') {
            projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else if (sortValue === 'dueDate') {
            projects.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else if (sortValue === 'created') {
            projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortValue === 'name') {
            projects.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
        }

        // Update the display
        const list = document.getElementById('projects-list');
        list.innerHTML = renderProjectRows(projects);
    };

    filterStatus.addEventListener('change', applyFilters);
    filterAssignee.addEventListener('change', applyFilters);
    filterClient.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applyFilters);
}

// Global function for creating new project
window.createNewProject = function () {
    showProjectCreateModal((newProject) => {
        // Refresh the projects list
        renderProjects();
        // Navigate to the new project detail page
        window.navigate(`/project/${newProject.id}`);
    });
};
