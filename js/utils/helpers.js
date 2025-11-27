// ====================================
// Utility Helper Functions
// ====================================

// Format date to Japanese locale
export function formatDate(dateString) {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
}

// Format datetime to Japanese locale with time
export function formatDateTime(dateString) {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// Get relative time (e.g., "3時間前")
export function getRelativeTime(dateString) {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'たった今';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
    return `${Math.floor(diffDays / 365)}年前`;
}

// Check if date is overdue
export function isOverdue(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
}

// Get status badge class
export function getStatusBadgeClass(status) {
    const statusMap = {
        '見積中': 'badge-secondary',
        '開発中': 'badge-primary',
        '検収中': 'badge-warning',
        '運用中': 'badge-success',
        '完了': 'badge-success',
        '保留': 'badge-secondary',
        '未着手': 'badge-secondary',
        '作業中': 'badge-primary',
        'レビュー待ち': 'badge-warning',
        '未対応': 'badge-danger',
        '対応中': 'badge-warning',
        '確認待ち': 'badge-info',
        'クローズ': 'badge-secondary'
    };

    return statusMap[status] || 'badge-secondary';
}

// Get priority badge class
export function getPriorityBadgeClass(priority) {
    const priorityMap = {
        '高': 'badge-danger',
        '中': 'badge-warning',
        '低': 'badge-secondary'
    };

    return priorityMap[priority] || 'badge-secondary';
}

// Get progress bar class
export function getProgressClass(percentage) {
    if (percentage >= 80) return 'progress-success';
    if (percentage >= 50) return 'progress';
    if (percentage >= 30) return 'progress-warning';
    return 'progress-danger';
}

// Format currency (Japanese Yen)
export function formatCurrency(amount) {
    if (!amount && amount !== 0) return '-';
    return `¥${amount.toLocaleString('ja-JP')}`;
}

// Truncate text
export function truncate(text, maxLength = 50) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Escape HTML
export function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Generate unique ID
export function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Debounce function
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Filter array by search query
export function filterBySearch(items, query, fields) {
    if (!query) return items;

    const lowerQuery = query.toLowerCase();
    return items.filter(item => {
        return fields.some(field => {
            const value = field.split('.').reduce((obj, key) => obj?.[key], item);
            return value?.toString().toLowerCase().includes(lowerQuery);
        });
    });
}

// Sort array by field
export function sortBy(items, field, direction = 'asc') {
    return [...items].sort((a, b) => {
        const aValue = field.split('.').reduce((obj, key) => obj?.[key], a);
        const bValue = field.split('.').reduce((obj, key) => obj?.[key], b);

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

// Group array by field
export function groupBy(items, field) {
    return items.reduce((groups, item) => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        if (!groups[value]) {
            groups[value] = [];
        }
        groups[value].push(item);
        return groups;
    }, {});
}

// Calculate statistics
export function calculateStats(items, field) {
    if (!items || items.length === 0) return { min: 0, max: 0, avg: 0, sum: 0 };

    const values = items.map(item => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return parseFloat(value) || 0;
    });

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { min, max, avg, sum };
}

// Create HTML element with attributes
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });

    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });

    return element;
}

// Show toast notification
export function showToast(message, type = 'info', duration = 3000) {
    const toast = createElement('div', {
        className: `toast toast-${type}`,
        style: `
            position: fixed;
            top: 80px;
            right: 24px;
            padding: 16px 24px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `
    }, [message]);

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
