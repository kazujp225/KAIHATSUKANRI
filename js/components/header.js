// ====================================
// Header Component
// ====================================

export function initHeader() {
    // Global search functionality
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleGlobalSearch);
    }

    // User menu (could be expanded)
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', () => {
            // Could show dropdown menu
            console.log('User menu clicked');
        });
    }

    // Notification button
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            // Could show notification panel
            console.log('Notifications clicked');
        });
    }
}

function handleGlobalSearch(e) {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) return;

    // This would filter projects/tasks/issues
    console.log('Searching for:', query);
    // Implementation would trigger re-render of current view with filtered data
}
