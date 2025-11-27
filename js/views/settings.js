// ====================================
// Settings View
// ====================================

import { getData, saveData } from '../data.js';

export default function renderSettings() {
    const main = document.getElementById('app-main');

    main.innerHTML = `
        <div class="page-container">
            <!-- Page Header -->
            <div class="page-header">
                <div class="page-header-left">
                    <h1 class="page-title">⚙️ 設定</h1>
                    <p class="page-subtitle">システム設定とステータス管理</p>
                </div>
            </div>

            <!-- Settings Grid -->
            <div style="display: grid; gap: var(--space-xl);">
                <!-- Project Status Settings -->
                ${renderSettingsCard(
        '案件ステータス設定',
        '案件のステータス定義を管理します',
        '📋',
        '#2563eb',
        renderStatusList('project')
    )}

                <!-- Task Status Settings -->
                ${renderSettingsCard(
        'タスクステータス設定',
        'タスクのステータス定義を管理します',
        '✅',
        '#8b5cf6',
        renderStatusList('task')
    )}

                <!-- Issue Status Settings -->
                ${renderSettingsCard(
        'Issueステータス設定',
        'Issueのステータス定義を管理します',
        '🐛',
        '#ef4444',
        renderStatusList('issue')
    )}

                <!-- Priority Settings -->
                ${renderSettingsCard(
        '優先度設定',
        '優先度ラベルを管理します',
        '⚡',
        '#f59e0b',
        renderPriorityList()
    )}

                <!-- Contract Type Settings -->
                ${renderSettingsCard(
        '契約種別設定',
        '契約種別を管理します',
        '📝',
        '#10b981',
        renderContractTypeList()
    )}
            </div>
        </div>
    `;
}

function renderSettingsCard(title, description, icon, color, content) {
    return `
        <div class="card" style="border: 2px solid ${color}20; overflow: hidden;">
            <div style="padding: var(--space-lg); background: linear-gradient(135deg, ${color}10 0%, ${color}05 100%); border-bottom: 2px solid ${color}20;">
                <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                    <div style="width: 48px; height: 48px; background: ${color}20; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                        ${icon}
                    </div>
                    <div style="flex: 1;">
                        <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 2px; color: var(--color-text);">${title}</h2>
                        <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin: 0;">${description}</p>
                    </div>
                </div>
            </div>
            <div style="padding: var(--space-lg);">
                ${content}
            </div>
        </div>
    `;
}

function renderStatusList(type) {
    const statusConfig = {
        'project': {
            items: [
                { value: '見積中', color: '#6b7280', icon: '📊' },
                { value: '開発中', color: '#2563eb', icon: '💻' },
                { value: '検収中', color: '#f59e0b', icon: '🔍' },
                { value: '運用中', color: '#8b5cf6', icon: '🚀' },
                { value: '完了', color: '#10b981', icon: '✅' },
                { value: '保留', color: '#eab308', icon: '⏸️' },
                { value: '中止', color: '#ef4444', icon: '❌' }
            ]
        },
        'task': {
            items: [
                { value: '未着手', color: '#6b7280', icon: '⭕' },
                { value: '作業中', color: '#2563eb', icon: '⚙️' },
                { value: 'レビュー待ち', color: '#8b5cf6', icon: '👀' },
                { value: 'ブロック中', color: '#f59e0b', icon: '🚧' },
                { value: '完了', color: '#10b981', icon: '✅' }
            ]
        },
        'issue': {
            items: [
                { value: '未対応', color: '#6b7280', icon: '🆕' },
                { value: '対応中', color: '#2563eb', icon: '🔧' },
                { value: '確認待ち', color: '#f59e0b', icon: '⏳' },
                { value: 'クローズ', color: '#10b981', icon: '✅' }
            ]
        }
    };

    const config = statusConfig[type];
    if (!config) return '';

    return `
        <div style="display: grid; gap: var(--space-sm);">
            ${config.items.map((status, index) => `
                <div class="status-item animate-fade-in" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); background: white; border: 2px solid var(--color-border); border-left: 5px solid ${status.color}; border-radius: var(--radius-lg); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; animation-delay: ${index * 0.05}s;">
                    <!-- Gradient Background -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, ${status.color}08 0%, transparent 50%); opacity: 0.5; transition: opacity 0.3s; pointer-events: none;"></div>
                    
                    <div style="position: relative; z-index: 1; display: flex; align-items: center; gap: var(--space-md); flex: 1;">
                        <!-- Icon with Glow -->
                        <div style="position: relative; flex-shrink: 0;">
                            <div style="position: absolute; inset: -4px; background: ${status.color}40; border-radius: var(--radius-lg); filter: blur(10px); opacity: 0.5;"></div>
                            <div style="position: relative; font-size: 1.75rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, ${status.color}20 0%, ${status.color}10 100%); border-radius: var(--radius-lg); border: 2px solid ${status.color}30;">${status.icon}</div>
                        </div>
                        
                        <!-- Color Swatch with Shadow -->
                        <div style="position: relative; flex-shrink: 0;">
                            <div style="position: absolute; inset: -3px; background: ${status.color}; border-radius: var(--radius-md); filter: blur(8px); opacity: 0.4;"></div>
                            <div style="position: relative; width: 40px; height: 40px; background: ${status.color}; border-radius: var(--radius-md); box-shadow: 0 4px 12px ${status.color}50, inset 0 2px 4px rgba(255,255,255,0.2);"></div>
                        </div>
                        
                        <!-- Label Info -->
                        <div style="flex: 1;">
                            <div style="font-weight: 700; font-size: 1rem; margin-bottom: 3px; color: var(--color-text);">${status.value}</div>
                            <div style="font-size: 0.75rem; color: var(--color-text-tertiary); font-family: 'SF Mono', Monaco, 'Courier New', monospace; background: var(--color-gray-100); padding: 2px 8px; border-radius: var(--radius-sm); display: inline-block;">${status.color}</div>
                        </div>
                    </div>
                    
                    <!-- Edit Button -->
                    <button class="btn btn-secondary btn-sm" onclick="editStatus('${type}', '${status.value}', '${status.color}')" style="position: relative; z-index: 1; padding: 8px 16px; opacity: 0.8; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        編集
                    </button>
                </div>
            `).join('')}
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
                animation: fadeIn 0.4s ease-out forwards;
                opacity: 0;
            }
            
            .status-item:hover {
                border-left-width: 8px;
                border-color: ${config.items[0]?.color || '#2563eb'}30;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                transform: translateX(6px) translateY(-2px);
            }
            
            .status-item:hover > div:first-child {
                opacity: 0.8;
            }
            
            .status-item:hover button {
                opacity: 1;
                transform: scale(1.05);
            }
        </style>
    `;
}

function renderPriorityList() {
    const priorities = [
        { value: '高', color: '#ef4444', icon: '🔴', description: '緊急対応が必要' },
        { value: '中', color: '#f59e0b', icon: '🟡', description: '通常の優先度' },
        { value: '低', color: '#10b981', icon: '🟢', description: '余裕がある時に対応' }
    ];

    return `
        <div style="display: grid; gap: var(--space-sm);">
            ${priorities.map(priority => `
                <div class="status-item" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: white; border: 2px solid var(--color-border); border-radius: var(--radius-lg); transition: all 0.2s;">
                    <div style="display: flex; align-items: center; gap: var(--space-sm); flex: 1;">
                        <div style="font-size: 1.5rem;">${priority.icon}</div>
                        <div style="width: 32px; height: 32px; background: ${priority.color}; border-radius: var(--radius-md); box-shadow: 0 2px 4px ${priority.color}40;"></div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 0.9375rem;">${priority.value}</div>
                            <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">${priority.description}</div>
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="editPriority('${priority.value}', '${priority.color}')" style="opacity: 0.7; transition: opacity 0.2s;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        編集
                    </button>
                </div>
            `).join('')}
        </div>
        
        <style>
            .status-item:hover {
                border-color: var(--color-primary);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                transform: translateX(4px);
            }
            .status-item:hover button {
                opacity: 1;
            }
        </style>
    `;
}

function renderContractTypeList() {
    const contractTypes = [
        { value: 'スポット', icon: '⚡', description: '単発案件', color: '#2563eb' },
        { value: '月額', icon: '📅', description: '月額契約', color: '#8b5cf6' },
        { value: '準委任', icon: '🤝', description: '準委任契約', color: '#10b981' }
    ];

    return `
        <div style="display: grid; gap: var(--space-sm);">
            ${contractTypes.map(type => `
                <div class="status-item" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: white; border: 2px solid var(--color-border); border-radius: var(--radius-lg); transition: all 0.2s;">
                    <div style="display: flex; align-items: center; gap: var(--space-sm); flex: 1;">
                        <div style="font-size: 1.5rem;">${type.icon}</div>
                        <div style="width: 32px; height: 32px; background: ${type.color}; border-radius: var(--radius-md); box-shadow: 0 2px 4px ${type.color}40;"></div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 0.9375rem;">${type.value}</div>
                            <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">${type.description}</div>
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="editContractType('${type.value}', '${type.color}')" style="opacity: 0.7; transition: opacity 0.2s;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        編集
                    </button>
                </div>
            `).join('')}
        </div>
        
        <style>
            .status-item:hover {
                border-color: var(--color-primary);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                transform: translateX(4px);
            }
            .status-item:hover button {
                opacity: 1;
            }
        </style>
    `;
}

// Global functions for editing
window.editStatus = function (type, statusName, currentColor) {
    import('../components/modal.js').then(({ showModal, closeModal }) => {
        const content = `
            <form id="status-edit-form">
                <div class="form-group">
                    <label class="form-label">ステータス名</label>
                    <input type="text" class="form-input" name="statusName" value="${statusName}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">カラーコード</label>
                    <div style="display: flex; gap: var(--space-sm);">
                        <input type="color" name="statusColor" value="${currentColor}" style="width: 60px; height: 40px; border: 2px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer;">
                        <input type="text" class="form-input" name="statusColorText" value="${currentColor}" placeholder="#000000" style="flex: 1;">
                    </div>
                </div>
                <div style="padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md); margin-top: var(--space-md);">
                    <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: var(--space-sm); color: var(--color-text-secondary);">プレビュー</div>
                    <div id="status-preview" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: white; border-radius: var(--radius-full); border: 2px solid var(--color-border);">
                        <div style="width: 12px; height: 12px; background: ${currentColor}; border-radius: var(--radius-full);"></div>
                        <span style="font-weight: 600; font-size: 0.875rem;">${statusName}</span>
                    </div>
                </div>
            </form>
            
            <script>
                const colorInput = document.querySelector('input[name="statusColor"]');
                const colorText = document.querySelector('input[name="statusColorText"]');
                const nameInput = document.querySelector('input[name="statusName"]');
                const preview = document.getElementById('status-preview');
                
                colorInput.addEventListener('input', (e) => {
                    colorText.value = e.target.value;
                    updatePreview();
                });
                
                colorText.addEventListener('input', (e) => {
                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        colorInput.value = e.target.value;
                        updatePreview();
                    }
                });
                
                nameInput.addEventListener('input', updatePreview);
                
                function updatePreview() {
                    const color = colorInput.value;
                    const name = nameInput.value || '${statusName}';
                    preview.innerHTML = \`
                        <div style="width: 12px; height: 12px; background: \${color}; border-radius: var(--radius-full);"></div>
                        <span style="font-weight: 600; font-size: 0.875rem;">\${name}</span>
                    \`;
                }
            </script>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="saveStatusEdit('${type}')">保存</button>
        `;

        showModal(`${statusName} を編集`, content, footer);

        window.saveStatusEdit = (type) => {
            const form = document.getElementById('status-edit-form');
            const formData = new FormData(form);

            alert(`ステータス「${formData.get('statusName')}」を更新しました\\nカラー: ${formData.get('statusColor')}`);
            closeModal();

            // Refresh settings view
            import('./settings.js').then(({ default: renderSettings }) => {
                renderSettings();
            });
        };
    });
};

window.editPriority = function (priorityName, currentColor) {
    alert(`優先度「${priorityName}」の編集機能（開発中）`);
};

window.editContractType = function (typeName, currentColor) {
    alert(`契約種別「${typeName}」の編集機能（開発中）`);
};
