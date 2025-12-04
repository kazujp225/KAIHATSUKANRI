// ====================================
// Modal Component
// ====================================

export function showModal(title, content, footer = null) {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal-container');

    // Build modal content
    const modalHTML = `
        <div class="modal-header">
            <h3 class="modal-title font-bold gradient-text">${title}</h3>
            <button class="modal-close hover-scale" onclick="closeModal()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
        <div class="modal-body">
            ${content}
        </div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    `;

    modal.innerHTML = modalHTML;
    overlay.classList.add('active');

    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    };
}

export function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
}

// Make closeModal available globally
window.closeModal = closeModal;

// Task Edit Modal
export function showTaskEditModal(task, onSave) {
    const content = `
        <form id="task-edit-form">
            <div class="form-group">
                <label class="form-label">タスク名</label>
                <input type="text" class="form-input" name="title" value="${task.title}" required>
            </div>
            <div class="form-group">
                <label class="form-label">説明</label>
                <textarea class="form-textarea" name="description" rows="4">${task.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">ステータス</label>
                <select class="form-select" name="status">
                    <option value="未着手" ${task.status === '未着手' ? 'selected' : ''}>未着手</option>
                    <option value="作業中" ${task.status === '作業中' ? 'selected' : ''}>作業中</option>
                    <option value="レビュー待ち" ${task.status === 'レビュー待ち' ? 'selected' : ''}>レビュー待ち</option>
                    <option value="完了" ${task.status === '完了' ? 'selected' : ''}>完了</option>
                    <option value="保留" ${task.status === '保留' ? 'selected' : ''}>保留</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">期限</label>
                <input type="date" class="form-input" name="dueDate" value="${task.dueDate || ''}">
            </div>
        </form>
    `;

    const footer = `
        <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
        <button class="btn btn-primary" onclick="saveTaskEdit()">保存</button>
    `;

    showModal('タスク編集', content, footer);

    // Make save function global
    window.saveTaskEdit = () => {
        const form = document.getElementById('task-edit-form');
        const formData = new FormData(form);
        const updatedTask = {
            ...task,
            title: formData.get('title'),
            description: formData.get('description'),
            status: formData.get('status'),
            dueDate: formData.get('dueDate')
        };

        onSave(updatedTask);
        closeModal();
    };
}

// Issue Create Modal
export function showIssueCreateModal(projectId, onSave) {
    const content = `
        <form id="issue-create-form">
            <div class="form-group">
                <label class="form-label">タイトル</label>
                <input type="text" class="form-input" name="title" required>
            </div>
            <div class="form-group">
                <label class="form-label">説明</label>
                <textarea class="form-textarea" name="description" rows="4"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">優先度</label>
                <select class="form-select" name="priority">
                    <option value="低">低</option>
                    <option value="中" selected>中</option>
                    <option value="高">高</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">カテゴリ</label>
                <select class="form-select" name="category">
                    <option value="実装バグ">実装バグ</option>
                    <option value="仕様抜け">仕様抜け</option>
                    <option value="外部要因">外部要因</option>
                    <option value="その他">その他</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">再現手順</label>
                <textarea class="form-textarea" name="reproduction" rows="3"></textarea>
            </div>
        </form>
    `;

    const footer = `
        <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
        <button class="btn btn-primary" onclick="saveIssueCreate()">作成</button>
    `;

    showModal('Issue作成', content, footer);

    window.saveIssueCreate = () => {
        const form = document.getElementById('issue-create-form');
        const formData = new FormData(form);

        const newIssue = {
            id: `issue-${Date.now()}`,
            projectId: projectId,
            title: formData.get('title'),
            description: formData.get('description'),
            status: '未対応',
            priority: formData.get('priority'),
            category: formData.get('category'),
            reproduction: formData.get('reproduction'),
            expected: '',
            actual: '',
            assigneeId: 'user-001', // Default
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            resolvedAt: null
        };

        onSave(newIssue);
        closeModal();
    };
}

// Project Create Modal
export function showProjectCreateModal(onCreated) {
    const { clients, users } = require('../data.js').getData();

    import('../data.js').then(({ getData }) => {
        const data = getData();
        const clients = data.clients;
        const users = data.users;

        const content = `
            <form id="project-create-form">
                <div class="form-group">
                    <label class="form-label">案件名 *</label>
                    <input type="text" class="form-input" name="name" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">顧客 *</label>
                    <select class="form-select" name="clientId" required>
                        ${clients.map(client => `
                            <option value="${client.id}">${client.name}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">契約種別</label>
                    <select class="form-select" name="contractType">
                        <option value="スポット">スポット</option>
                        <option value="月額">月額</option>
                        <option value="準委任">準委任</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">金額</label>
                    <input type="number" class="form-input" name="price" placeholder="800000">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                    <div class="form-group">
                        <label class="form-label">一次納期</label>
                        <input type="date" class="form-input" name="primaryDueDate">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">本番納期</label>
                        <input type="date" class="form-input" name="dueDate">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">メイン担当者 *</label>
                    <select class="form-select" name="mainAssignee" required>
                        ${users.filter(u => u.role !== 'Contractor').map(user => `
                            <option value="${user.id}">${user.name}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">作業範囲メモ</label>
                    <textarea class="form-textarea" name="description" rows="3"></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="saveProjectCreate()">作成</button>
        `;

        showModal('新規案件作成', content, footer);

        window.saveProjectCreate = () => {
            const form = document.getElementById('project-create-form');
            const formData = new FormData(form);

            if (!formData.get('name') || !formData.get('clientId') || !formData.get('mainAssignee')) {
                alert('必須項目を入力してください');
                return;
            }

            import('../data.js').then(({ getData, saveData }) => {
                const data = getData();

                const newProject = {
                    id: `prj-${Date.now()}`,
                    name: formData.get('name'),
                    clientId: formData.get('clientId'),
                    status: '見積中',
                    price: parseInt(formData.get('price')) || 0,
                    contractType: formData.get('contractType'),
                    dueDate: formData.get('dueDate') || null,
                    primaryDueDate: formData.get('primaryDueDate') || null,
                    assignees: [formData.get('mainAssignee')],
                    mainAssignee: formData.get('mainAssignee'),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    description: formData.get('description') || ''
                };

                data.projects.push(newProject);
                saveData(data);
                closeModal();

                if (onCreated) {
                    onCreated(newProject);
                }
            });
        };
    });
}

// Task Create Modal
export function showTaskCreateModal(projectId, onCreated) {
    import('../data.js').then(({ getData }) => {
        const users = getData().users;

        const content = `
            <form id="task-create-form">
                <div class="form-group">
                    <label class="form-label">タスク名 *</label>
                    <input type="text" class="form-input" name="title" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">説明</label>
                    <textarea class="form-textarea" name="description" rows="3"></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">ステータス</label>
                    <select class="form-select" name="status">
                        <option value="未着手" selected>未着手</option>
                        <option value="作業中">作業中</option>
                        <option value="レビュー待ち">レビュー待ち</option>
                        <option value="完了">完了</option>
                        <option value="保留">保留</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">担当者</label>
                    <select class="form-select" name="assigneeId">
                        ${users.map(user => `
                            <option value="${user.id}">${user.name}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">期限</label>
                    <input type="date" class="form-input" name="dueDate">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="saveTaskCreate()">作成</button>
        `;

        showModal('新規タスク作成', content, footer);

        window.saveTaskCreate = () => {
            const form = document.getElementById('task-create-form');
            const formData = new FormData(form);

            if (!formData.get('title')) {
                alert('タスク名を入力してください');
                return;
            }

            import('../data.js').then(({ getData, saveData }) => {
                const data = getData();

                const newTask = {
                    id: `task-${Date.now()}`,
                    projectId: projectId,
                    title: formData.get('title'),
                    description: formData.get('description') || '',
                    status: formData.get('status'),
                    assigneeId: formData.get('assigneeId'),
                    dueDate: formData.get('dueDate') || null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastUpdatedBy: 'user-001'
                };

                data.tasks.push(newTask);

                // Add activity
                data.activities.push({
                    id: `act-${Date.now()}`,
                    projectId: projectId,
                    userId: 'user-001',
                    type: 'task_created',
                    targetId: newTask.id,
                    targetType: 'task',
                    content: `タスク「${newTask.title}」を作成`,
                    timestamp: new Date().toISOString()
                });

                saveData(data);
                closeModal();

                if (onCreated) {
                    onCreated(newTask);
                }
            });
        };
    });
}
// Project Edit Modal
export function showProjectEditModal(project, onSaved) {
    import('../data.js').then(({ getData, saveData }) => {
        const data = getData();
        const clients = data.clients;
        const users = data.users;

        const content = `
            <form id="project-edit-form">
                <div class="form-group">
                    <label class="form-label">案件名 *</label>
                    <input type="text" class="form-input" name="name" value="${project.name}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">顧客 *</label>
                    <select class="form-select" name="clientId" required>
                        ${clients.map(client => `
                            <option value="${client.id}" ${project.clientId === client.id ? 'selected' : ''}>${client.name}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">契約種別</label>
                    <select class="form-select" name="contractType">
                        <option value="スポット" ${project.contractType === 'スポット' ? 'selected' : ''}>スポット</option>
                        <option value="月額" ${project.contractType === '月額' ? 'selected' : ''}>月額</option>
                        <option value="準委任" ${project.contractType === '準委任' ? 'selected' : ''}>準委任</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">金額</label>
                    <input type="number" class="form-input" name="price" value="${project.price || ''}">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                    <div class="form-group">
                        <label class="form-label">一次納期</label>
                        <input type="date" class="form-input" name="primaryDueDate" value="${project.primaryDueDate || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">本番納期</label>
                        <input type="date" class="form-input" name="dueDate" value="${project.dueDate || ''}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">メイン担当者 *</label>
                    <select class="form-select" name="mainAssignee" required>
                        ${users.filter(u => u.role !== 'Contractor').map(user => `
                            <option value="${user.id}" ${project.mainAssignee === user.id ? 'selected' : ''}>${user.name}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">作業範囲メモ</label>
                    <textarea class="form-textarea" name="description" rows="3">${project.description || ''}</textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="saveProjectEdit()">保存</button>
        `;

        showModal('案件を編集', content, footer);

        window.saveProjectEdit = () => {
            const form = document.getElementById('project-edit-form');
            const formData = new FormData(form);

            if (!formData.get('name') || !formData.get('clientId') || !formData.get('mainAssignee')) {
                alert('必須項目を入力してください');
                return;
            }

            const data = getData();
            const projectIndex = data.projects.findIndex(p => p.id === project.id);

            if (projectIndex !== -1) {
                data.projects[projectIndex] = {
                    ...data.projects[projectIndex],
                    name: formData.get('name'),
                    clientId: formData.get('clientId'),
                    price: parseInt(formData.get('price')) || 0,
                    contractType: formData.get('contractType'),
                    dueDate: formData.get('dueDate') || null,
                    primaryDueDate: formData.get('primaryDueDate') || null,
                    mainAssignee: formData.get('mainAssignee'),
                    description: formData.get('description') || '',
                    updatedAt: new Date().toISOString()
                };

                saveData(data);
                closeModal();

                if (onSaved) {
                    onSaved(data.projects[projectIndex]);
                }
            }
        };
    });
}

// Template Selection Modal for Adding Tasks
export function showTemplateSelectModal(projectId, onApplied) {
    import('../views/templates.js').then(({ TEMPLATE_TYPES }) => {
        const content = `
            <form id="template-select-form">
                <p style="margin-bottom: var(--space-md); color: var(--color-text-secondary);">
                    テンプレートを選択すると、そのタスクリストが一括で追加されます。
                </p>
                <div class="form-group">
                    <label class="form-label">テンプレートを選択 *</label>
                    <select class="form-select" name="templateId" id="template-selector" required>
                        <option value="">選択してください</option>
                        ${TEMPLATE_TYPES.map(template => `
                            <option value="${template.id}">${template.name} (${template.tasks.length}個のタスク)</option>
                        `).join('')}
                    </select>
                </div>
                
                <div id="template-preview" style="display: none; margin-top: var(--space-md); padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md);">
                    <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: var(--space-sm);">プレビュー</h4>
                    <div id="template-preview-content"></div>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" id="apply-template-btn" disabled>適用</button>
        `;

        showModal('テンプレートからタスクを追加', content, footer);

        // Template preview handler
        const selector = document.getElementById('template-selector');
        const preview = document.getElementById('template-preview');
        const previewContent = document.getElementById('template-preview-content');
        const applyBtn = document.getElementById('apply-template-btn');

        selector.addEventListener('change', () => {
            const selectedId = selector.value;
            if (selectedId) {
                const template = TEMPLATE_TYPES.find(t => t.id === selectedId);
                if (template) {
                    previewContent.innerHTML = `
                        <p style="font-size: 0.875rem; margin-bottom: var(--space-sm);">${template.description}</p>
                        <ul style="font-size: 0.875rem; list-style: none; padding: 0; margin: 0;">
                            ${template.tasks.map((task, index) => `
                                <li style="padding: var(--space-xs) 0; border-bottom: 1px solid var(--color-border);">
                                    ${index + 1}. ${task}
                                </li>
                            `).join('')}
                        </ul>
                    `;
                    preview.style.display = 'block';
                    applyBtn.disabled = false;
                }
            } else {
                preview.style.display = 'none';
                applyBtn.disabled = true;
            }
        });

        applyBtn.onclick = () => {
            const selectedId = selector.value;
            const template = TEMPLATE_TYPES.find(t => t.id === selectedId);

            if (template) {
                import('../data.js').then(({ getData, saveData }) => {
                    const data = getData();
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

                    // Add activity
                    data.activities.push({
                        id: `act-${Date.now()}`,
                        projectId: projectId,
                        userId: 'user-001',
                        type: 'template_applied',
                        targetId: template.id,
                        targetType: 'template',
                        content: `テンプレート「${template.name}」を適用し、${newTasks.length}個のタスクを追加`,
                        timestamp: new Date().toISOString()
                    });

                    saveData(data);
                    closeModal();

                    if (onApplied) {
                        onApplied();
                    }
                });
            }
        };
    });
}
