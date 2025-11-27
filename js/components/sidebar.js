// ====================================
// Sidebar Component
// ====================================

export function initSidebar() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Get route from data attribute
            const route = item.dataset.route;

            // Dispatch custom event for routing
            window.dispatchEvent(new CustomEvent('navigate', { detail: { route } }));
        });
    });
}
