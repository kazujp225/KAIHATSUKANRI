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
                    <h1 class="page-title" style="display: flex; align-items: center; gap: var(--space-sm);"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>設定</h1>
                    <p class="page-subtitle">システム設定とステータス管理</p>
                </div>
            </div>

            <!-- Settings Grid -->
            <div style="display: grid; gap: var(--space-xl);">
                <!-- Project Status Settings -->
                ${renderSettingsCard(
        '案件ステータス設定',
        '案件のステータス定義を管理します',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
        '#2563eb',
        renderStatusList('project')
    )}

                <!-- Task Status Settings -->
                ${renderSettingsCard(
        'タスクステータス設定',
        'タスクのステータス定義を管理します',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        '#8b5cf6',
        renderStatusList('task')
    )}

                <!-- Issue Status Settings -->
                ${renderSettingsCard(
        'Issueステータス設定',
        'Issueのステータス定義を管理します',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
        '#ef4444',
        renderStatusList('issue')
    )}

                <!-- Priority Settings -->
                ${renderSettingsCard(
        '優先度設定',
        '優先度ラベルを管理します',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
        '#f59e0b',
        renderPriorityList()
    )}

                <!-- Contract Type Settings -->
                ${renderSettingsCard(
        '契約種別設定',
        '契約種別を管理します',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
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
                { value: '見積中', color: '#6b7280', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>' },
                { value: '開発中', color: '#2563eb', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>' },
                { value: '検収中', color: '#f59e0b', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' },
                { value: '運用中', color: '#8b5cf6', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>' },
                { value: '完了', color: '#10b981', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' },
                { value: '保留', color: '#eab308', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>' },
                { value: '中止', color: '#ef4444', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>' }
            ]
        },
        'task': {
            items: [
                { value: '未着手', color: '#6b7280', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>' },
                { value: '作業中', color: '#2563eb', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>' },
                { value: 'レビュー待ち', color: '#8b5cf6', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
                { value: 'ブロック中', color: '#f59e0b', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>' },
                { value: '完了', color: '#10b981', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' }
            ]
        },
        'issue': {
            items: [
                { value: '未対応', color: '#6b7280', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>' },
                { value: '対応中', color: '#2563eb', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>' },
                { value: '確認待ち', color: '#f59e0b', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' },
                { value: 'クローズ', color: '#10b981', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' }
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
                            <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, ${status.color}20 0%, ${status.color}10 100%); border-radius: var(--radius-lg); border: 2px solid ${status.color}30; color: ${status.color};">${status.icon}</div>
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
        { value: '高', color: '#ef4444', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', description: '緊急対応が必要' },
        { value: '中', color: '#f59e0b', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>', description: '通常の優先度' },
        { value: '低', color: '#10b981', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>', description: '余裕がある時に対応' }
    ];

    return `
        <div style="display: grid; gap: var(--space-sm);">
            ${priorities.map(priority => `
                <div class="status-item" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: white; border: 2px solid var(--color-border); border-radius: var(--radius-lg); transition: all 0.2s;">
                    <div style="display: flex; align-items: center; gap: var(--space-sm); flex: 1;">
                        <div style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: ${priority.color};">${priority.icon}</div>
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
        { value: 'スポット', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>', description: '単発案件', color: '#2563eb' },
        { value: '月額', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>', description: '月額契約', color: '#8b5cf6' },
        { value: '準委任', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>', description: '準委任契約', color: '#10b981' }
    ];

    return `
        <div style="display: grid; gap: var(--space-sm);">
            ${contractTypes.map(type => `
                <div class="status-item" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: white; border: 2px solid var(--color-border); border-radius: var(--radius-lg); transition: all 0.2s;">
                    <div style="display: flex; align-items: center; gap: var(--space-sm); flex: 1;">
                        <div style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: ${type.color};">${type.icon}</div>
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
