// ====================================
// Data Models & Mock Data
// ====================================

// Initialize data from localStorage or create new
export function initializeData() {
    if (!localStorage.getItem('zettai-projects-data')) {
        const initialData = {
            projects: MOCK_PROJECTS,
            clients: MOCK_CLIENTS,
            users: MOCK_USERS,
            tasks: MOCK_TASKS,
            issues: MOCK_ISSUES,
            handoverNotes: MOCK_HANDOVER_NOTES,
            activities: MOCK_ACTIVITIES
        };
        localStorage.setItem('zettai-projects-data', JSON.stringify(initialData));
    }
}

// Get all data
export function getData() {
    const data = localStorage.getItem('zettai-projects-data');
    return data ? JSON.parse(data) : null;
}

// Save data
export function saveData(data) {
    localStorage.setItem('zettai-projects-data', JSON.stringify(data));
}

// ====================================
// Mock Users
// ====================================
const MOCK_USERS = [
    {
        id: 'user-001',
        name: '田中太郎',
        email: 'tanaka@zettai.dev',
        role: 'Admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanaka'
    },
    {
        id: 'user-002',
        name: '佐藤花子',
        email: 'sato@zettai.dev',
        role: 'Engineer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sato'
    },
    {
        id: 'user-003',
        name: '鈴木一郎',
        email: 'suzuki@zettai.dev',
        role: 'Engineer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suzuki'
    },
    {
        id: 'user-004',
        name: '高橋美咲',
        email: 'takahashi@zettai.dev',
        role: 'Contractor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Takahashi'
    }
];

// ====================================
// Mock Clients
// ====================================
const MOCK_CLIENTS = [
    {
        id: 'cli-001',
        name: '株式会社サンプル商事',
        contactPerson: '山田次郎',
        email: 'yamada@sample-corp.jp',
        phone: '03-1234-5678'
    },
    {
        id: 'cli-002',
        name: 'テックイノベーション株式会社',
        contactPerson: '伊藤美穂',
        email: 'ito@tech-innovation.co.jp',
        phone: '03-9876-5432'
    },
    {
        id: 'cli-003',
        name: 'グローバルソリューションズ',
        contactPerson: '渡辺健太',
        email: 'watanabe@global-sol.com',
        phone: '06-1111-2222'
    }
];

// ====================================
// Mock Projects
// ====================================
const MOCK_PROJECTS = [
    {
        id: 'prj-001',
        name: 'ECサイトスクレイピングツール開発',
        clientId: 'cli-001',
        status: '開発中',
        price: 800000,
        contractType: 'スポット',
        dueDate: '2025-12-15',
        primaryDueDate: '2025-12-01',
        assignees: ['user-001', 'user-002'],
        mainAssignee: 'user-001',
        createdAt: '2025-11-01T09:00:00',
        updatedAt: '2025-11-26T15:30:00',
        description: '複数のECサイトから商品情報を自動収集し、CSVで出力するツール。毎日0時に自動実行。',
        links: [
            { type: 'github', url: 'https://github.com/example/ec-scraper', label: 'GitHub Repository' },
            { type: 'render', url: 'https://ec-scraper.onrender.com', label: 'Production' }
        ]
    },
    {
        id: 'prj-002',
        name: '社内業務管理システム改修',
        clientId: 'cli-002',
        status: '検収中',
        price: 1200000,
        contractType: '準委任',
        dueDate: '2025-11-30',
        primaryDueDate: '2025-11-25',
        assignees: ['user-002', 'user-003'],
        mainAssignee: 'user-002',
        createdAt: '2025-10-01T10:00:00',
        updatedAt: '2025-11-27T10:00:00',
        description: 'React + Node.jsで構築された既存システムの機能追加とリファクタリング。',
        links: [
            { type: 'github', url: 'https://github.com/example/business-system', label: 'GitHub' },
            { type: 'staging', url: 'https://staging.business-system.com', label: 'Staging' },
            { type: 'production', url: 'https://business-system.com', label: 'Production' }
        ]
    },
    {
        id: 'prj-003',
        name: 'データ分析ダッシュボード構築',
        clientId: 'cli-003',
        status: '見積中',
        price: 950000,
        contractType: 'スポット',
        dueDate: '2026-01-31',
        primaryDueDate: '2026-01-15',
        assignees: ['user-001', 'user-004'],
        mainAssignee: 'user-001',
        createdAt: '2025-11-20T14:00:00',
        updatedAt: '2025-11-26T16:00:00',
        description: 'BIツールを使用した経営ダッシュボードの設計・実装。',
        links: []
    },
    {
        id: 'prj-004',
        name: 'API連携システム開発',
        clientId: 'cli-001',
        status: '運用中',
        price: 600000,
        contractType: '月額',
        dueDate: '2025-12-31',
        primaryDueDate: null,
        assignees: ['user-001', 'user-003'],
        mainAssignee: 'user-003',
        createdAt: '2025-09-01T09:00:00',
        updatedAt: '2025-11-25T11:00:00',
        description: '外部サービスとのAPI連携を行うミドルウェアシステム。',
        links: [
            { type: 'github', url: 'https://github.com/example/api-integration', label: 'GitHub' },
            { type: 'docs', url: 'https://docs.api-integration.example.com', label: 'API Documentation' }
        ]
    },
    {
        id: 'prj-005',
        name: 'モバイルアプリ開発',
        clientId: 'cli-002',
        status: '保留',
        price: 1500000,
        contractType: 'スポット',
        dueDate: '2026-03-31',
        primaryDueDate: '2026-02-28',
        assignees: ['user-002', 'user-004'],
        mainAssignee: 'user-002',
        createdAt: '2025-10-15T11:00:00',
        updatedAt: '2025-11-20T14:30:00',
        description: 'iOS/Android対応のハイブリッドアプリ開発。顧客都合で一時保留。'
    }
];

// ====================================
// Mock Tasks
// ====================================
const MOCK_TASKS = [
    // Project 1 Tasks
    {
        id: 'task-001',
        projectId: 'prj-001',
        title: '対象サイトの構造調査',
        description: '各ECサイトのHTML構造とDOM要素を特定',
        status: '完了',
        assigneeId: 'user-001',
        dueDate: '2025-11-10',
        createdAt: '2025-11-01T09:30:00',
        updatedAt: '2025-11-09T15:30:00',
        lastUpdatedBy: 'user-001'
    },
    {
        id: 'task-002',
        projectId: 'prj-001',
        title: 'スキーマ設計',
        description: '抽出データの形式とCSV出力フォーマットの定義',
        status: '完了',
        assigneeId: 'user-002',
        dueDate: '2025-11-12',
        createdAt: '2025-11-01T09:30:00',
        updatedAt: '2025-11-11T17:00:00',
        lastUpdatedBy: 'user-002'
    },
    {
        id: 'task-003',
        projectId: 'prj-001',
        title: 'プロトタイプ作成',
        description: 'Pythonでのスクレイピング実装',
        status: '作業中',
        assigneeId: 'user-001',
        dueDate: '2025-11-28',
        createdAt: '2025-11-12T10:00:00',
        updatedAt: '2025-11-26T14:00:00',
        lastUpdatedBy: 'user-001'
    },
    {
        id: 'task-004',
        projectId: 'prj-001',
        title: 'エラーハンドリング実装',
        description: 'CAPTCHA、429エラー、ブロック時の対応ロジック',
        status: '未着手',
        assigneeId: 'user-002',
        dueDate: '2025-12-05',
        createdAt: '2025-11-12T10:00:00',
        updatedAt: '2025-11-12T10:00:00',
        lastUpdatedBy: 'user-002'
    },
    {
        id: 'task-005',
        projectId: 'prj-001',
        title: 'ログ設計・実装',
        description: '実行ログとエラーログの出力仕様',
        status: '未着手',
        assigneeId: 'user-001',
        dueDate: '2025-12-08',
        createdAt: '2025-11-12T10:00:00',
        updatedAt: '2025-11-12T10:00:00',
        lastUpdatedBy: 'user-001'
    },
    // Project 2 Tasks
    {
        id: 'task-006',
        projectId: 'prj-002',
        title: '既存コードのリファクタリング',
        description: 'レガシーコードの整理とTypeScript化',
        status: '完了',
        assigneeId: 'user-002',
        dueDate: '2025-11-15',
        createdAt: '2025-10-01T10:30:00',
        updatedAt: '2025-11-14T18:00:00',
        lastUpdatedBy: 'user-002'
    },
    {
        id: 'task-007',
        projectId: 'prj-002',
        title: '新機能実装（レポート出力）',
        description: 'PDFレポート自動生成機能の追加',
        status: 'レビュー待ち',
        assigneeId: 'user-003',
        dueDate: '2025-11-25',
        createdAt: '2025-11-10T09:00:00',
        updatedAt: '2025-11-24T16:30:00',
        lastUpdatedBy: 'user-003'
    },
    {
        id: 'task-008',
        projectId: 'prj-002',
        title: 'テスト作成',
        description: 'Unit/Integration テストの追加',
        status: '作業中',
        assigneeId: 'user-002',
        dueDate: '2025-11-28',
        createdAt: '2025-11-15T11:00:00',
        updatedAt: '2025-11-26T13:00:00',
        lastUpdatedBy: 'user-002'
    }
];

// ====================================
// Mock Issues
// ====================================
const MOCK_ISSUES = [
    {
        id: 'issue-001',
        projectId: 'prj-001',
        title: 'ログインページでCAPTCHAが出現',
        description: '特定のECサイトでログイン試行時にCAPTCHAが表示され、自動化が困難',
        status: '対応中',
        priority: '高',
        category: '外部要因',
        assigneeId: 'user-001',
        createdAt: '2025-11-20T10:00:00',
        updatedAt: '2025-11-25T15:00:00',
        resolvedAt: null,
        reproduction: '1. ログインページにアクセス\n2. Seleniumで自動ログイン実行\n3. CAPTCHA画面が表示される',
        expected: '自動ログインが成功する',
        actual: 'CAPTCHA認証が要求される'
    },
    {
        id: 'issue-002',
        projectId: 'prj-001',
        title: '商品価格の取得エラー',
        description: 'JavaScript動的読み込みの価格データが取得できない',
        status: '未対応',
        priority: '中',
        category: '実装バグ',
        assigneeId: 'user-002',
        createdAt: '2025-11-22T14:30:00',
        updatedAt: '2025-11-22T14:30:00',
        resolvedAt: null,
        reproduction: '1. 商品詳細ページにアクセス\n2. BeautifulSoupでパース\n3. 価格要素が空',
        expected: '商品価格が取得できる',
        actual: '価格要素が空文字列'
    },
    {
        id: 'issue-003',
        projectId: 'prj-002',
        title: 'PDFエクスポート時の日本語文字化け',
        description: 'レポートPDF出力時に日本語が正しく表示されない',
        status: 'クローズ',
        priority: '高',
        category: '実装バグ',
        assigneeId: 'user-003',
        createdAt: '2025-11-18T11:00:00',
        updatedAt: '2025-11-23T17:00:00',
        resolvedAt: '2025-11-23T17:00:00',
        reproduction: '1. レポート画面で「PDF出力」をクリック\n2. ダウンロードされたPDFを開く\n3. 日本語が□□□で表示',
        expected: '日本語が正しく表示される',
        actual: '日本語が文字化けする'
    }
];

// ====================================
// Mock Handover Notes
// ====================================
const MOCK_HANDOVER_NOTES = [
    {
        id: 'handover-001',
        projectId: 'prj-001',
        purpose: '複数ECサイトから商品データを毎日自動収集し、スプレッドシートに反映',
        customerConcerns: 'データの取りこぼしがないこと。スピードより正確性を重視。',
        technicalRisks: '対象サイトが頻繁にHTML構造を変更するため、定期的なDOM確認が必要。',
        codeEntry: 'main.py の scrape_all_sites() 関数から読むと理解しやすい',
        manualOperations: '初回のみ各サイトの認証トークンを手動取得する必要がある',
        implicitRules: '顧客のSlackチャンネルには顧客も参加しているため、内部的な会話は別チャンネルで',
        messageToNext: 'サイトAのログイン部分は特に壊れやすいので注意。週1でチェック推奨。',
        completed: false,
        writtenBy: 'user-001',
        createdAt: '2025-11-15T16:00:00',
        updatedAt: '2025-11-25T10:00:00'
    },
    {
        id: 'handover-002',
        projectId: 'prj-002',
        purpose: '社内業務管理システムの既存機能改善と新機能追加',
        customerConcerns: '既存機能に影響を与えないこと。段階的なリリースを希望。',
        technicalRisks: 'レガシーコードが多く、テストカバレッジが低い。',
        codeEntry: 'src/index.tsx から App.tsx → routes/ を確認',
        manualOperations: 'デプロイ前に必ずステージング環境でのE2Eテスト実施',
        implicitRules: '毎週金曜日の定例MTGで進捗報告が必須',
        messageToNext: 'auth周りは触らない方が無難。過去にバグが多発した箇所。',
        completed: true,
        writtenBy: 'user-002',
        createdAt: '2025-10-05T14:00:00',
        updatedAt: '2025-11-20T11:00:00'
    }
];

// ====================================
// Mock Activities (Timeline)
// ====================================
const MOCK_ACTIVITIES = [
    {
        id: 'act-001',
        projectId: 'prj-001',
        userId: 'user-001',
        type: 'task_status_change',
        targetId: 'task-003',
        targetType: 'task',
        content: 'タスク「プロトタイプ作成」のステータスを「未着手」→「作業中」に変更',
        timestamp: '2025-11-26T14:00:00'
    },
    {
        id: 'act-002',
        projectId: 'prj-001',
        userId: 'user-001',
        type: 'issue_created',
        targetId: 'issue-001',
        targetType: 'issue',
        content: 'Issue「ログインページでCAPTCHAが出現」を作成',
        timestamp: '2025-11-20T10:00:00'
    },
    {
        id: 'act-003',
        projectId: 'prj-002',
        userId: 'user-003',
        type: 'task_status_change',
        targetId: 'task-007',
        targetType: 'task',
        content: 'タスク「新機能実装（レポート出力）」のステータスを「作業中」→「レビュー待ち」に変更',
        timestamp: '2025-11-24T16:30:00'
    },
    {
        id: 'act-004',
        projectId: 'prj-002',
        userId: 'user-003',
        type: 'issue_resolved',
        targetId: 'issue-003',
        targetType: 'issue',
        content: 'Issue「PDFエクスポート時の日本語文字化け」をクローズ',
        timestamp: '2025-11-23T17:00:00'
    }
];

// ====================================
// Helper Functions
// ====================================

export function getProjects() {
    const data = getData();
    return data ? data.projects : [];
}

export function getProjectById(id) {
    const data = getData();
    return data?.projects.find(p => p.id === id);
}

export function getTasksByProjectId(projectId) {
    const data = getData();
    return data?.tasks.filter(t => t.projectId === projectId) || [];
}

export function getIssuesByProjectId(projectId) {
    const data = getData();
    return data?.issues.filter(i => i.projectId === projectId) || [];
}

export function getActivitiesByProjectId(projectId) {
    const data = getData();
    return data?.activities.filter(a => a.projectId === projectId) || [];
}

export function getHandoverNoteByProjectId(projectId) {
    const data = getData();
    return data?.handoverNotes.find(h => h.projectId === projectId);
}

export function getClientById(id) {
    const data = getData();
    return data?.clients.find(c => c.id === id);
}

export function getUserById(id) {
    const data = getData();
    return data?.users.find(u => u.id === id);
}

export function getUsers() {
    const data = getData();
    return data ? data.users : [];
}

export function getClients() {
    const data = getData();
    return data ? data.clients : [];
}

// Calculate project progress
export function calculateProjectProgress(projectId) {
    const tasks = getTasksByProjectId(projectId);
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter(t => t.status === '完了').length;
    return Math.round((completedTasks / tasks.length) * 100);
}

// Update project status
export function updateProjectStatus(projectId, newStatus, userId) {
    const data = getData();
    const projectIndex = data.projects.findIndex(p => p.id === projectId);

    if (projectIndex !== -1) {
        const oldStatus = data.projects[projectIndex].status;

        // Status validation (optional - can add more complex rules)
        const validTransitions = {
            '見積中': ['開発中', '保留', '中止'],
            '開発中': ['検収中', '保留', '中止'],
            '検収中': ['運用中', '完了', '開発中'],
            '運用中': ['完了', '保留'],
            '保留': ['開発中', '中止'],
            '完了': [],
            '中止': []
        };

        data.projects[projectIndex].status = newStatus;
        data.projects[projectIndex].updatedAt = new Date().toISOString();

        // Add activity
        data.activities.push({
            id: `act-${Date.now()}`,
            projectId: projectId,
            userId: userId,
            type: 'project_status_change',
            targetId: projectId,
            targetType: 'project',
            content: `案件ステータスを「${oldStatus}」→「${newStatus}」に変更`,
            timestamp: new Date().toISOString()
        });

        saveData(data);
        return true;
    }
    return false;
}

// Update task status
export function updateTaskStatus(taskId, newStatus, userId) {
    const data = getData();
    const taskIndex = data.tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        data.tasks[taskIndex].status = newStatus;
        data.tasks[taskIndex].updatedAt = new Date().toISOString();
        data.tasks[taskIndex].lastUpdatedBy = userId;

        // Add activity
        const task = data.tasks[taskIndex];
        data.activities.push({
            id: `act-${Date.now()}`,
            projectId: task.projectId,
            userId: userId,
            type: 'task_status_change',
            targetId: taskId,
            targetType: 'task',
            content: `タスク「${task.title}」のステータスを「${newStatus}」に変更`,
            timestamp: new Date().toISOString()
        });

        saveData(data);
        return true;
    }
    return false;
}

// Update issue status
export function updateIssueStatus(issueId, newStatus, userId) {
    const data = getData();
    const issueIndex = data.issues.findIndex(i => i.id === issueId);

    if (issueIndex !== -1) {
        data.issues[issueIndex].status = newStatus;
        data.issues[issueIndex].updatedAt = new Date().toISOString();

        if (newStatus === 'クローズ') {
            data.issues[issueIndex].resolvedAt = new Date().toISOString();
        }

        // Add activity
        const issue = data.issues[issueIndex];
        data.activities.push({
            id: `act-${Date.now()}`,
            projectId: issue.projectId,
            userId: userId,
            type: 'issue_status_change',
            targetId: issueId,
            targetType: 'issue',
            content: `Issue「${issue.title}」のステータスを「${newStatus}」に変更`,
            timestamp: new Date().toISOString()
        });

        saveData(data);
        return true;
    }
    return false;
}
