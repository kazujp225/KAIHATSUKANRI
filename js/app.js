// ====================================
// Main Application Controller
// ====================================

import { initializeData } from './data.js';
import { initHeader } from './components/header.js';
import { initSidebar } from './components/sidebar.js';
import renderDashboard from './views/dashboard.js';
import renderProjectDetail from './views/projectDetail.js';
import renderProjects from './views/projects.js';
import renderMembers from './views/members.js';
import renderTemplates from './views/templates.js';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Initialize data
    initializeData();

    // Initialize components
    initHeader();
    initSidebar();

    // Set up routing
    setupRouting();

    // Load initial view
    navigate('dashboard');
});

// ====================================
// Routing
// ====================================
function setupRouting() {
    // Listen for navigation events
    window.addEventListener('navigate', (e) => {
        const { route, projectId } = e.detail;
        navigate(route, projectId);
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state) {
            navigate(e.state.route, e.state.projectId, false);
        }
    });

    // Handle hash changes (for direct links)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const [route, projectId] = hash.split('/');
            navigate(route, projectId, false);
        }
    });
}

function navigate(route, projectId = null, pushState = true) {
    // Update URL
    if (pushState) {
        const hash = projectId ? `${route}/${projectId}` : route;
        window.history.pushState({ route, projectId }, '', `#${hash}`);
    }

    // Update sidebar active state
    updateSidebarActive(route);

    // Render view
    switch (route) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'projects':
            renderProjects();
            break;
        case 'project-detail':
            if (projectId) {
                renderProjectDetail(projectId);
            }
            break;
        case 'members':
            renderMembers();
            break;
        case 'templates':
            renderTemplates();
            break;
        default:
            renderDashboard();
    }
}

function updateSidebarActive(route) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.route === route ||
            (route === 'project-detail' && item.dataset.route === 'projects')) {
            item.classList.add('active');
        }
    });
}

function renderPlaceholder(title) {
    const main = document.getElementById('app-main');
    main.innerHTML = `
        <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>${title}</h3>
            <p>この機能は現在開発中です</p>
        </div>
    `;
}

// ====================================
// Export for global access
// ====================================
window.navigate = navigate;
