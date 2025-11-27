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
                    <h1 class="page-title">👥 メンバー管理</h1>
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
                <div style="padding: var(--space-md); background: linear-gradient(135deg, #8b5cf610 0%, #8b5cf605 100%); border: 2px solid #8b5cf620; border-radius: var(--radius-md); display: flex; align-items: center; gap: var(--space-md);">
                    <div style="width: 40px; height: 40px; background: #8b5cf620; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                        👑
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: #8b5cf6;">${adminCount}</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 600;">管理者</div>
                    </div>
                </div>
                
                <div style="padding: var(--space-md); background: linear-gradient(135deg, #2563eb10 0%, #2563eb05 100%); border: 2px solid #2563eb20; border-radius: var(--radius-md); display: flex; align-items: center; gap: var(--space-md);">
                    <div style="width: 40px; height: 40px; background: #2563eb20; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                        💻
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: #2563eb;">${engineerCount}</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 600;">エンジニア</div>
                    </div>
                </div>
                
                <div style="padding: var(--space-md); background: linear-gradient(135deg, #10b98110 0%, #10b98105 100%); border: 2px solid #10b98120; border-radius: var(--radius-md); display: flex; align-items: center; gap: var(--space-md);">
                    <div style="width: 40px; height: 40px; background: #10b98120; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                        🤝
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: #10b981;">${contractorCount}</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 600;">外注</div>
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
        'Admin': { label: '👑 管理者', color: '#8b5cf6', bg: 'linear-gradient(135deg, #8b5cf615 0%, #8b5cf608 100%)', borderGlow: 'rgba(139, 92, 246, 0.4)' },
        'Engineer': { label: '💻 エンジニア', color: '#2563eb', bg: 'linear-gradient(135deg, #2563eb15 0%, #2563eb08 100%)', borderGlow: 'rgba(37, 99, 235, 0.4)' },
        'Contractor': { label: '🤝 外注', color: '#10b981', bg: 'linear-gradient(135deg, #10b98115 0%, #10b98108 100%)', borderGlow: 'rgba(16, 185, 129, 0.4)' }
    };

    const config = roleConfig[user.role] || { label: user.role, color: '#6b7280', bg: 'linear-gradient(135deg, #6b728015 0%, #6b728008 100%)', borderGlow: 'rgba(107, 114, 128, 0.4)' };

    // Count projects this user is assigned to
    const userProjects = projects.filter(p =>
        p.assignees.includes(user.id) || p.mainAssignee === user.id
    );
    const projectCount = userProjects.length;
    const activeProjectCount = userProjects.filter(p =>
        p.status === '開発中' || p.status === '検収中'
    ).length;

    return `
        <div class="member-row-compact animate-fade-in" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); background: white; border: 2px solid var(--color-border); border-left: 5px solid ${config.color}; border-radius: var(--radius-lg); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative; overflow: hidden;">
            <!-- Gradient Background Overlay -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${config.bg}; opacity: 0.4; transition: opacity 0.3s; pointer-events: none;"></div>
            
            <!-- Content with z-index -->
            <div style="position: relative; z-index: 1; display: flex; align-items: center; gap: var(--space-md); width: 100%;">
                <!-- Avatar with Glow -->
                <div style="flex-shrink: 0; position: relative;">
                    <div style="position: absolute; inset: -4px; background: ${config.bg}; border-radius: var(--radius-full); filter: blur(8px); opacity: 0.6;"></div>
                    <img src="${user.avatar}" alt="${user.name}" style="position: relative; width: 48px; height: 48px; border-radius: var(--radius-full); border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                </div>

                <!-- Name & Email -->
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 700; font-size: 1rem; margin-bottom: 4px; color: var(--color-text);">
                        ${user.name}
                    </div>
                    <div style="font-size: 0.8125rem; color: var(--color-text-secondary); display: flex; align-items: center; gap: 6px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.7">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke-width="2"/>
                            <path d="M22 6l-10 7L2 6" stroke-width="2"/>
                        </svg>
                        ${user.email}
                    </div>
                </div>

                <!-- Role Badge -->
                <div style="min-width: 130px;">
                    <span style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: ${config.bg}; color: ${config.color}; border: 2px solid ${config.color}50; border-radius: var(--radius-full); font-size: 0.8125rem; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 8px ${config.color}20;">
                        ${config.label}
                    </span>
                </div>

                <!-- Project Stats with Cards -->
                <div style="display: flex; align-items: center; gap: var(--space-md); min-width: 200px;">
                    <div style="text-align: center; padding: var(--space-sm) var(--space-md); background: white; border: 2px solid var(--color-border); border-radius: var(--radius-md); box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="font-size: 1.5rem; font-weight: 800; color: ${config.color}; line-height: 1;">${projectCount}</div>
                        <div style="font-size: 0.625rem; color: var(--color-text-tertiary); font-weight: 600; text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px;">全PJ</div>
                    </div>
                    <div style="text-align: center; padding: var(--space-sm) var(--space-md); background: white; border: 2px solid #10b98130; border-radius: var(--radius-md); box-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);">
                        <div style="font-size: 1.5rem; font-weight: 800; color: #10b981; line-height: 1;">${activeProjectCount}</div>
                        <div style="font-size: 0.625rem; color: var(--color-text-tertiary); font-weight: 600; text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px;">進行中</div>
                    </div>
                </div>

                <!-- Actions -->
                <div style="display: flex; gap: var(--space-xs);">
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); editMember('${user.id}')" style="padding: 8px 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
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
