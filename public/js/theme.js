// Theme Management
class ThemeManager {
    constructor() {
        this.THEME_KEY = 'newsverse-theme';
        this.initialize();
    }

    initialize() {
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        if (savedTheme === 'light') {
            this.setLight();
        } else {
            this.setDark();
        }
        this.attachEventListeners();
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        const isLight = document.body.classList.contains('light-theme');
        if (isLight) {
            this.setDark();
        } else {
            this.setLight();
        }
    }

    setLight() {
        document.body.classList.add('light-theme');
        localStorage.setItem(this.THEME_KEY, 'light');
        this.updateIcon('☀️');
    }

    setDark() {
        document.body.classList.remove('light-theme');
        localStorage.setItem(this.THEME_KEY, 'dark');
        this.updateIcon('🌙');
    }

    updateIcon(icon) {
        const iconElement = document.querySelector('.theme-icon');
        if (iconElement) {
            iconElement.textContent = icon;
        }
    }
}

// Initialize theme on load
const themeManager = new ThemeManager();
