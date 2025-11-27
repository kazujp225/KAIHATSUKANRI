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
                    <h1 class="page-title">📂 案件一覧</h1>
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

    // Status configuration
    const statusConfig = {
        '見積中': { color: '#6b7280', icon: '📊', gradient: 'linear-gradient(135deg, #6b728015 0%, #6b728008 100%)' },
        '開発中': { color: '#2563eb', icon: '💻', gradient: 'linear-gradient(135deg, #2563eb15 0%, #2563eb08 100%)' },
        '検収中': { color: '#f59e0b', icon: '🔍', gradient: 'linear-gradient(135deg, #f59e0b15 0%, #f59e0b08 100%)' },
        '運用中': { color: '#8b5cf6', icon: '🚀', gradient: 'linear-gradient(135deg, #8b5cf615 0%, #8b5cf608 100%)' },
        '完了': { color: '#10b981', icon: '✅', gradient: 'linear-gradient(135deg, #10b98115 0%, #10b98108 100%)' },
        '保留': { color: '#eab308', icon: '⏸️', gradient: 'linear-gradient(135deg, #eab30815 0%, #eab30808 100%)' },
        '中止': { color: '#ef4444', icon: '❌', gradient: 'linear-gradient(135deg, #ef444415 0%, #ef444408 100%)' }
    };

    const config = statusConfig[project.status] || statusConfig['見積中'];

    // Progress bar color with gradients
    let progressColor = '#ef4444';
    let progressGradient = 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
    if (progress >= 70) {
        progressColor = '#10b981';
        progressGradient = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
    } else if (progress >= 40) {
        progressColor = '#f59e0b';
        progressGradient = 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
    }

    return `
        <div class="project-row-compact animate-fade-in" onclick="window.navigate('project-detail', '${project.id}')" style="display: flex; align-items: center; gap: var(--space-lg); padding: var(--space-lg); background: white; border: 2px solid var(--color-border); border-left: 6px solid ${config.color}; border-radius: var(--radius-lg); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative; overflow: hidden;">
            <!-- Gradient Background Overlay -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${config.gradient}; opacity: 0.5; transition: opacity 0.3s; pointer-events: none;"></div>
            
            <!-- Content Container -->
            <div style="position: relative; z-index: 1; display: flex; align-items: center; gap: var(--space-lg); width: 100%;">
                <!-- Status Icon with Glow -->
                <div style="position: relative; flex-shrink: 0;">
                    <div style="position: absolute; inset: -4px; background: ${config.color}30; border-radius: var(--radius-lg); filter: blur(10px); opacity: 0.6;"></div>
                    <div style="position: relative; font-size: 1.75rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: ${config.gradient}; border: 2px solid ${config.color}40; border-radius: var(--radius-lg);">
                        ${config.icon}
                    </div>
                </div>

                <!-- Main Info -->
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: baseline; gap: var(--space-sm); margin-bottom: 6px;">
                        <h4 style="font-size: 1.0625rem; font-weight: 700; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--color-text);">
                            ${project.name}
                        </h4>
                        <span style="font-size: 0.8125rem; color: var(--color-text-tertiary); white-space: nowrap;">
                            ${client?.name || ''}
                        </span>
                    </div>
                    
                    <!-- Enhanced Progress Bar -->
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                        <div style="position: relative; flex: 1; height: 8px; background: var(--color-gray-200); border-radius: var(--radius-full); max-width: 240px; overflow: hidden;">
                            <div style="position: absolute; height: 100%; width: ${progress}%; background: ${progressGradient}; border-radius: var(--radius-full); transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 4px ${progressColor}40;"></div>
                        </div>
                        <span style="font-size: 0.8125rem; font-weight: 700; color: ${progressColor}; width: 42px; text-align: right;">
                            ${progress}%
                        </span>
                    </div>
                </div>

                <!-- Assignee with Enhanced Avatar -->
                <div style="display: flex; align-items: center; gap: var(--space-sm); min-width: 120px; padding: var(--space-sm) var(--space-md); background: white; border: 2px solid var(--color-border); border-radius: var(--radius-md); box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="position: relative;">
                        <div style="position: absolute; inset: -2px; background: ${config.gradient}; border-radius: var(--radius-full); filter: blur(4px); opacity: 0.5;"></div>
                        <img src="${mainAssignee?.avatar}" alt="${mainAssignee?.name}" style="position: relative; width: 32px; height: 32px; border-radius: var(--radius-full); border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.12);">
                    </div>
                    <span style="font-size: 0.875rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${mainAssignee?.name}
                    </span>
                </div>

                <!-- Due Date Card -->
                <div style="min-width: 110px; text-align: center; padding: var(--space-sm) var(--space-md); background: ${isOverdue ? '#fef2f2' : 'white'}; border: 2px solid ${isOverdue ? '#ef444430' : 'var(--color-border)'}; border-radius: var(--radius-md); box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="font-size: 0.875rem; font-weight: 700; color: ${isOverdue ? '#ef4444' : 'var(--color-text)'};">
                        ${formatDate(project.dueDate)}
                    </div>
                    ${isOverdue ? `
                        <div style="font-size: 0.625rem; color: #ef4444; font-weight: 700; text-transform: uppercase; margin-top: 2px;">期限超過</div>
                    ` : daysUntilDue <= 7 && daysUntilDue > 0 ? `
                        <div style="font-size: 0.625rem; color: #f59e0b; font-weight: 700; text-transform: uppercase; margin-top: 2px;">残${daysUntilDue}日</div>
                    ` : ''}
                </div>

                <!-- Issues Badge -->
                <div style="min-width: 70px; text-align: center;">
                    ${openIssues > 0 ? `
                        <div style="position: relative; display: inline-block;">
                            <div style="position: absolute; inset: -3px; background: #ef4444; border-radius: var(--radius-full); filter: blur(8px); opacity: 0.3;"></div>
                            <span style="position: relative; display: inline-flex; align-items: center; justify-content: center; min-width: 36px; height: 28px; padding: 0 10px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); color: #ef4444; border: 2px solid #ef444440; border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 800; box-shadow: 0 2px 6px rgba(239, 68, 68, 0.2);">
                                ${openIssues}
                            </span>
                        </div>
                    ` : `
                        <span style="font-size: 0.8125rem; color: var(--color-text-tertiary);">-</span>
                    `}
                </div>

                <!-- Price Card -->
                <div style="min-width: 120px; text-align: right; padding: var(--space-sm) var(--space-md); background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #10b98130; border-radius: var(--radius-md); box-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);">
                    <div style="font-size: 1rem; font-weight: 800; color: #059669;">
                        ${formatCurrency(project.price)}
                    </div>
                </div>

                <!-- Status Badge with Glow -->
                <div style="min-width: 90px;">
                    <div style="position: relative; display: inline-block;">
                        <div style="position: absolute; inset: -3px; background: ${config.color}; border-radius: var(--radius-full); filter: blur(8px); opacity: 0.4;"></div>
                        <span style="position: relative; display: inline-flex; align-items: center; justify-content: center; padding: 6px 14px; background: ${config.gradient}; color: ${config.color}; border: 2px solid ${config.color}50; border-radius: var(--radius-full); font-size: 0.8125rem; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 6px ${config.color}25;">
                            ${project.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .animate-fade-in {
                animation: fadeIn 0.4s ease-out;
            }
            
            .project-row-compact:hover {
                border-left-width: 10px;
                box-shadow: 0 8px 24px ${config.color}30, 0 4px 12px rgba(0, 0, 0, 0.12);
                transform: translateX(6px) translateY(-2px);
            }
            
            .project-row-compact:hover > div:first-child {
                opacity: 0.7;
            }
            
            .project-row-compact:active {
                transform: translateX(3px) translateY(0);
            }
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
