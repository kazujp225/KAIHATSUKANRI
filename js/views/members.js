// ====================================
// Members Management View
// ====================================

import { getUsers, getData, saveData, getProjects } from '../data.js';

export default function renderMembers() {
    const main = document.getElementById('app-main');
    const users = getUsers();
    const projects = getProjects();

    // Calculate stats
    const adminCount = users.filter(u => u.role === 'Admin').length;
    const engineerCount = users.filter(u => u.role === 'Engineer').length;
    const contractorCount = users.filter(u => u.role === 'Contractor').length;

    main.innerHTML = `
        <div class="page-container">
            <!-- Page Header -->
            <div class="page-header">
                <div class="page-header-left">
                    <h1 class="page-title"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: -4px; margin-right: 8px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>メンバー管理</h1>
                    <p class="page-subtitle">${users.length}名のメンバー</p>
                </div>
                <div class="page-header-right">
                    <button class="btn btn-primary" onclick="addNewMember()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        メンバーを追加
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); margin-bottom: var(--space-lg);">
                <div style="padding: var(--space-md); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); display: flex; align-items: center; gap: var(--space-md);">
                    <div style="width: 40px; height: 40px; background: var(--color-gray-100); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-text);">${adminCount}</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">管理者</div>
                    </div>
                </div>

                <div style="padding: var(--space-md); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); display: flex; align-items: center; gap: var(--space-md);">
                    <div style="width: 40px; height: 40px; background: var(--color-gray-100); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-text);">${engineerCount}</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">エンジニア</div>
                    </div>
                </div>

                <div style="padding: var(--space-md); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); display: flex; align-items: center; gap: var(--space-md);">
                    <div style="width: 40px; height: 40px; background: var(--color-gray-100); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-text);">${contractorCount}</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">外注</div>
                    </div>
                </div>
            </div>

            <!-- Compact Members List -->
            <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
                ${users.map(user => renderCompactMemberRow(user, projects)).join('')}
            </div>
        </div>
    `;
}

function renderCompactMemberRow(user, projects) {
    const roleConfig = {
        'Admin': { label: '管理者', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>' },
        'Engineer': { label: 'エンジニア', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>' },
        'Contractor': { label: '外注', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' }
    };

    const config = roleConfig[user.role] || { label: user.role, icon: '' };

    // Count projects this user is assigned to
    const userProjects = projects.filter(p =>
        p.assignees.includes(user.id) || p.mainAssignee === user.id
    );
    const projectCount = userProjects.length;
    const activeProjectCount = userProjects.filter(p =>
        p.status === '開発中' || p.status === '検収中'
    ).length;

    return `
        <div class="member-row-compact" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: white; border: 1px solid var(--color-border); border-radius: var(--radius-md); transition: all 0.2s; cursor: pointer;">
                <!-- Avatar -->
                <img src="${user.avatar}" alt="${user.name}" style="width: 40px; height: 40px; border-radius: var(--radius-full); flex-shrink: 0;">

                <!-- Name & Email -->
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; font-size: 0.9375rem; color: var(--color-text);">
                        ${user.name}
                    </div>
                    <div style="font-size: 0.8125rem; color: var(--color-text-tertiary);">
                        ${user.email}
                    </div>
                </div>

                <!-- Role Badge -->
                <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; background: var(--color-gray-100); color: var(--color-text-secondary); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 500;">
                    ${config.icon || ''}${config.label}
                </span>

                <!-- Project Stats -->
                <div style="display: flex; align-items: center; gap: var(--space-md); min-width: 140px;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.125rem; font-weight: 700; color: var(--color-text);">${projectCount}</div>
                        <div style="font-size: 0.6875rem; color: var(--color-text-tertiary);">案件</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.125rem; font-weight: 700; color: var(--color-text);">${activeProjectCount}</div>
                        <div style="font-size: 0.6875rem; color: var(--color-text-tertiary);">進行中</div>
                    </div>
                </div>

                <!-- Actions -->
                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); editMember('${user.id}')" style="padding: 6px 12px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
        </div>
        
        <style>
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animate-fade-in {
                animation: fadeIn 0.4s ease-out;
            }
            
            .member-row-compact:hover {
                border-left-width: 8px;
                box-shadow: 0 8px 24px ${config.borderGlow}, 0 4px 12px rgba(0, 0, 0, 0.12);
                transform: translateX(4px) translateY(-2px);
            }
            
            .member-row-compact:hover > div:first-child {
                opacity: 0.7;
            }
            
            .member-row-compact:active {
                transform: translateX(2px) translateY(0);
            }
        </style>
    `;
}

// Global functions for member management
window.addNewMember = function () {
    import('../components/modal.js').then(({ showModal, closeModal }) => {
        import('../data.js').then(({ getData, saveData }) => {
            const content = `
                <form id="member-add-form">
                    <div class="form-group">
                        <label class="form-label">名前 *</label>
                        <input type="text" class="form-input" name="name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">メールアドレス *</label>
                        <input type="email" class="form-input" name="email" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">ロール *</label>
                        <select class="form-select" name="role" required>
                            <option value="Engineer">エンジニア</option>
                            <option value="Admin">管理者</option>
                            <option value="Contractor">外注</option>
                        </select>
                    </div>
                </form>
            `;

            const footer = `
                <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
                <button class="btn btn-primary" onclick="saveMemberAdd()">追加</button>
            `;

            showModal('メンバーを追加', content, footer);

            window.saveMemberAdd = () => {
                const form = document.getElementById('member-add-form');
                const formData = new FormData(form);

                if (!formData.get('name') || !formData.get('email')) {
                    alert('必須項目を入力してください');
                    return;
                }

                const data = getData();
                const newMember = {
                    id: `user-${Date.now()}`,
                    name: formData.get('name'),
                    email: formData.get('email'),
                    role: formData.get('role'),
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.get('name')}`
                };

                data.users.push(newMember);
                saveData(data);
                closeModal();

                // Refresh the view
                import('./members.js').then(({ default: renderMembers }) => {
                    renderMembers();
                });
            };
        });
    });
};

window.editMember = function (userId) {
    import('../components/modal.js').then(({ showModal, closeModal }) => {
        import('../data.js').then(({ getData, saveData, getUserById }) => {
            const user = getUserById(userId);
            if (!user) return;

            const content = `
                <form id="member-edit-form">
                    <div class="form-group">
                        <label class="form-label">名前 *</label>
                        <input type="text" class="form-input" name="name" value="${user.name}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">メールアドレス *</label>
                        <input type="email" class="form-input" name="email" value="${user.email}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">ロール *</label>
                        <select class="form-select" name="role" required>
                            <option value="Engineer" ${user.role === 'Engineer' ? 'selected' : ''}>エンジニア</option>
                            <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>管理者</option>
                            <option value="Contractor" ${user.role === 'Contractor' ? 'selected' : ''}>外注</option>
                        </select>
                    </div>
                </form>
            `;

            const footer = `
                <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
                <button class="btn btn-primary" onclick="saveMemberEdit()">保存</button>
            `;

            showModal('メンバーを編集', content, footer);

            window.saveMemberEdit = () => {
                const form = document.getElementById('member-edit-form');
                const formData = new FormData(form);

                const data = getData();
                const userIndex = data.users.findIndex(u => u.id === userId);

                if (userIndex !== -1) {
                    data.users[userIndex].name = formData.get('name');
                    data.users[userIndex].email = formData.get('email');
                    data.users[userIndex].role = formData.get('role');
                    saveData(data);
                    closeModal();

                    // Refresh the view
                    import('./members.js').then(({ default: renderMembers }) => {
                        renderMembers();
                    });
                }
            };
        });
    });
};
