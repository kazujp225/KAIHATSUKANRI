// ====================================
// Templates Management View
// ====================================

import { getData, saveData } from '../data.js';

// Mock template data
export const TEMPLATE_TYPES = [
    {
        id: 'template-scraping',
        name: 'スクレイピングツール開発',
        description: 'Webスクレイピングツール開発用のチェックリスト',
        icon: '🕷️',
        color: '#8b5cf6',
        estimatedHours: 40,
        popularity: 85,
        tasks: [
            '要件定義',
            '対象サイトの構造調査',
            'スキーマ設計（データ形式）',
            '技術選定（言語・ライブラリ）',
            'プロトタイプ作成',
            'サンプルデータ取得',
            'エラーハンドリング実装',
            '運用方法の決定',
            'ログ設計',
            '納品形式の確認'
        ]
    },
    {
        id: 'template-web-app',
        name: 'Webアプリケーション開発',
        description: 'フルスタックWebアプリケーション開発用',
        icon: '🌐',
        color: '#2563eb',
        estimatedHours: 120,
        popularity: 95,
        tasks: [
            '要件定義・画面設計',
            'データベース設計',
            'API設計',
            'フロントエンド実装',
            'バックエンド実装',
            'API連携',
            'テスト作成',
            'デプロイ環境構築',
            'パフォーマンス最適化',
            'セキュリティチェック'
        ]
    },
    {
        id: 'template-mobile',
        name: 'モバイルアプリ開発',
        description: 'iOS/Androidアプリ開発用',
        icon: '📱',
        color: '#10b981',
        estimatedHours: 160,
        popularity: 78,
        tasks: [
            '要件定義・画面設計',
            'データモデル設計',
            'UI/UX設計',
            '画面実装',
            'APIクライアント実装',
            'ローカルストレージ実装',
            'プッシュ通知設定',
            'テスト作成',
            'ストア申請資料準備',
            'リリース準備'
        ]
    },
    {
        id: 'template-api',
        name: 'API開発',
        description: 'RESTful API / GraphQL API開発用',
        icon: '🔌',
        color: '#f59e0b',
        estimatedHours: 60,
        popularity: 72,
        tasks: [
            'API仕様書作成',
            'データベース設計',
            'エンドポイント実装',
            '認証・認可実装',
            'エラーハンドリング',
            'ドキュメント作成',
            'テスト作成',
            'パフォーマンステスト',
            'セキュリティ監査',
            'デプロイ'
        ]
    }
];

export default function renderTemplates() {
    const main = document.getElementById('app-main');

    main.innerHTML = `
        <div class="page-container">
            <!-- Page Header -->
            <div class="page-header">
                <div class="page-header-left">
                    <h1 class="page-title">📋 テンプレート管理</h1>
                    <p class="page-subtitle">${TEMPLATE_TYPES.length}件のテンプレート</p>
                </div>
                <div class="page-header-right">
                    <button class="btn btn-primary" onclick="createNewTemplate()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        新規テンプレート
                    </button>
                </div>
            </div>

            <!-- Compact Templates List -->
            <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
                ${TEMPLATE_TYPES.map(template => renderCompactTemplateRow(template)).join('')}
            </div>
        </div>
    `;
}

function renderCompactTemplateRow(template) {
    const popularityStars = Math.round(template.popularity / 20); // 0-5 stars

    return `
        <div class="template-row-compact animate-slide-in" style="display: flex; align-items: center; gap: var(--space-lg); padding: var(--space-lg); background: white; border: 2px solid var(--color-border); border-left: 6px solid ${template.color}; border-radius: var(--radius-lg); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative; overflow: hidden;">
            <!-- Gradient Background -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, ${template.color}08 0%, transparent 60%); opacity: 0.5; transition: opacity 0.3s; pointer-events: none;"></div>
            
            <!-- Content Container -->
            <div style="position: relative; z-index: 1; display: flex; align-items: center; gap: var(--space-lg); width: 100%;">
                <!-- Icon with Glow Effect -->
                <div style="flex-shrink: 0; position: relative;">
                    <div style="position: absolute; inset: -6px; background: ${template.color}30; border-radius: var(--radius-lg); filter: blur(12px); opacity: 0.6;"></div>
                    <div style="position: relative; width: 56px; height: 56px; background: linear-gradient(135deg, ${template.color}20 0%, ${template.color}10 100%); border: 2px solid ${template.color}40; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; box-shadow: 0 4px 12px ${template.color}25;">
                        ${template.icon}
                    </div>
                </div>

                <!-- Name & Description -->
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 700; font-size: 1.0625rem; margin-bottom: 4px; color: var(--color-text);">
                        ${template.name}
                    </div>
                    <div style="font-size: 0.8125rem; color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${template.description}
                    </div>
                </div>

                <!-- Popularity Stars in Card -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-xs); padding: var(--space-sm) var(--space-md); background: white; border: 2px solid var(--color-border); border-radius: var(--radius-md); min-width: 100px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                    <div style="display: flex; gap: 3px;">
                        ${Array(5).fill(0).map((_, i) => `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="${i < popularityStars ? template.color : '#e5e7eb'}" style="filter: drop-shadow(0 1px 2px ${i < popularityStars ? template.color + '40' : 'rgba(0,0,0,0.1)'});">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        `).join('')}
                    </div>
                    <div style="font-size: 0.625rem; color: var(--color-text-tertiary); font-weight: 600; text-transform: uppercase;">評価</div>
                </div>

                <!-- Stats Cards -->
                <div style="display: flex; align-items: center; gap: var(--space-md); min-width: 280px;">
                    <div style="text-align: center; padding: var(--space-sm) var(--space-md); background: white; border: 2px solid ${template.color}30; border-radius: var(--radius-md); box-shadow: 0 2px 6px ${template.color}15; min-width: 70px;">
                        <div style="font-size: 1.375rem; font-weight: 800; color: ${template.color}; line-height: 1;">${template.tasks.length}</div>
                        <div style="font-size: 0.625rem; color: var(--color-text-tertiary); font-weight: 600; text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px;">タスク</div>
                    </div>
                    <div style="text-align: center; padding: var(--space-sm) var(--space-md); background: white; border: 2px solid ${template.color}30; border-radius: var(--radius-md); box-shadow: 0 2px 6px ${template.color}15; min-width: 70px;">
                        <div style="font-size: 1.375rem; font-weight: 800; color: ${template.color}; line-height: 1;">${template.estimatedHours}h</div>
                        <div style="font-size: 0.625rem; color: var(--color-text-tertiary); font-weight: 600; text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px;">時間</div>
                    </div>
                    <div style="text-align: center; padding: var(--space-sm) var(--space-md); background: linear-gradient(135deg, ${template.color}15 0%, ${template.color}08 100%); border: 2px solid ${template.color}40; border-radius: var(--radius-md); box-shadow: 0 2px 8px ${template.color}20; min-width: 70px;">
                        <div style="font-size: 1.375rem; font-weight: 800; color: ${template.color}; line-height: 1;">${template.popularity}%</div>
                        <div style="font-size: 0.625rem; color: ${template.color}; font-weight: 700; text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px;">人気</div>
                    </div>
                </div>

                <!-- Actions -->
                <div style="display: flex; gap: var(--space-sm);">
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); viewTemplate('${template.id}')" style="padding: 8px 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2"/>
                            <circle cx="12" cy="12" r="3" stroke-width="2"/>
                        </svg>
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); applyTemplateToProject('${template.id}')" style="padding: 8px 14px; background: linear-gradient(135deg, ${template.color} 0%, ${template.color}dd 100%); border: none; box-shadow: 0 4px 12px ${template.color}40;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .animate-slide-in {
                animation: slideIn 0.4s ease-out;
            }
            
            .template-row-compact:hover {
                border-left-width: 10px;
                box-shadow: 0 8px 24px ${template.color}35, 0 4px 12px rgba(0, 0, 0, 0.12);
                transform: translateX(6px) translateY(-2px);
            }
            
            .template-row-compact:hover > div:first-child {
                opacity: 0.8;
            }
            
            .template-row-compact:active {
                transform: translateX(3px) translateY(0);
            }
        </style>
    `;
}

// Global functions
window.createNewTemplate = function () {
    import('../components/modal.js').then(({ showModal, closeModal }) => {
        const content = `
            <form id="template-create-form">
                <div class="form-group">
                    <label class="form-label">テンプレート名 *</label>
                    <input type="text" class="form-input" name="name" placeholder="例: API開発" required>
                </div>
                <div class="form-group">
                    <label class="form-label">説明</label>
                    <textarea class="form-textarea" name="description" rows="2" placeholder="このテンプレートの用途を簡潔に記述"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">タスクリスト（1行につき1タスク）</label>
                    <textarea class="form-textarea" name="tasks" rows="6" placeholder="例:\\n要件定義\\n設計\\n実装"></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="saveTemplateCreate()">作成</button>
        `;

        showModal('新規テンプレート作成', content, footer);

        window.saveTemplateCreate = () => {
            const form = document.getElementById('template-create-form');
            const formData = new FormData(form);

            const tasksText = formData.get('tasks');
            const tasks = tasksText ? tasksText.split('\\n').filter(line => line.trim()) : [];

            alert(`テンプレート「${formData.get('name')}」を作成しました（${tasks.length}個のタスク）`);
            closeModal();

            // Refresh view
            import('./templates.js').then(({ default: renderTemplates }) => {
                renderTemplates();
            });
        };
    });
};

window.viewTemplate = function (templateId) {
    const template = TEMPLATE_TYPES.find(t => t.id === templateId);
    if (!template) return;

    import('../components/modal.js').then(({ showModal, closeModal }) => {
        const content = `
            <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-lg); padding: var(--space-lg); background: linear-gradient(135deg, ${template.color}15 0%, ${template.color}05 100%); border-radius: var(--radius-lg);">
                <div style="font-size: 3rem;">${template.icon}</div>
                <div>
                    <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-xs);">${template.name}</h3>
                    <p style="color: var(--color-text-secondary);">${template.description}</p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); margin-bottom: var(--space-lg);">
                <div style="padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: ${template.color};">${template.tasks.length}</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">タスク数</div>
                </div>
                <div style="padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: ${template.color};">${template.estimatedHours}h</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">推定時間</div>
                </div>
                <div style="padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: ${template.color};">${template.popularity}%</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">人気度</div>
                </div>
            </div>
            
            <div style="margin-bottom: var(--space-md);">
                <h4 style="font-weight: 600; margin-bottom: var(--space-sm);">タスクリスト</h4>
                <div style="background: var(--color-gray-50); border-radius: var(--radius-md); padding: var(--space-md); max-height: 400px; overflow-y: auto;">
                    ${template.tasks.map((task, index) => `
                        <div style="padding: var(--space-sm) 0; display: flex; align-items: center; gap: var(--space-sm); border-bottom: 1px solid var(--color-border);">
                            <span style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: ${template.color}; color: white; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600;">${index + 1}</span>
                            <span style="font-size: 0.875rem;">${task}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        showModal(`${template.icon} ${template.name}`, content, null);
    });
};

window.editTemplate = function (templateId) {
    alert('テンプレート編集機能（開発中）');
};

window.applyTemplateToProject = function (templateId) {
    const template = TEMPLATE_TYPES.find(t => t.id === templateId);
    if (!template) return;

    import('../data.js').then(({ getProjects }) => {
        import('../components/modal.js').then(({ showModal, closeModal }) => {
            const projects = getProjects();

            const content = `
                <div style="margin-bottom: var(--space-lg);">
                    <div style="display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-md); background: ${template.color}10; border-radius: var(--radius-md); border: 2px solid ${template.color}30;">
                        <span style="font-size: 2rem;">${template.icon}</span>
                        <div>
                            <div style="font-weight: 600;">${template.name}</div>
                            <div style="font-size: 0.75rem; color: var(--color-text-secondary);">${template.tasks.length}個のタスクを追加します</div>
                        </div>
                    </div>
                </div>
                
                <form id="apply-template-form">
                    <div class="form-group">
                        <label class="form-label">適用先のプロジェクトを選択 *</label>
                        <select class="form-select" name="projectId" required>
                            <option value="">選択してください</option>
                            ${projects.map(project => `
                                <option value="${project.id}">${project.name}</option>
                            `).join('')}
                        </select>
                    </div>
                </form>
            `;

            const footer = `
                <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
                <button class="btn btn-primary" onclick="confirmApplyTemplate('${templateId}')">適用</button>
            `;

            showModal('プロジェクトに適用', content, footer);

            window.confirmApplyTemplate = (templateId) => {
                const form = document.getElementById('apply-template-form');
                const formData = new FormData(form);
                const projectId = formData.get('projectId');

                if (!projectId) {
                    alert('プロジェクトを選択してください');
                    return;
                }

                import('../data.js').then(({ getData, saveData }) => {
                    const data = getData();
                    const template = TEMPLATE_TYPES.find(t => t.id === templateId);

                    const newTasks = template.tasks.map((taskTitle, index) => ({
                        id: `task-${Date.now()}-${index}`,
                        projectId: projectId,
                        title: taskTitle,
                        description: '',
                        status: '未着手',
                        assigneeId: 'user-001',
                        dueDate: null,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        lastUpdatedBy: 'user-001'
                    }));

                    data.tasks.push(...newTasks);
                    saveData(data);

                    closeModal();
                    alert(`テンプレート「${template.name}」を適用しました！\\n${newTasks.length}個のタスクを追加`);

                    // Navigate to the project detail page
                    window.navigate(`/project/${projectId}`);
                });
            };
        });
    });
};
