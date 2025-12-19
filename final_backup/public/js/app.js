// Main Application Logic
let currentCategory = '';
let currentCountry = 'us';
let currentView = 'news';

// UI Management
function showLoading() {
    document.getElementById('content').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Fetching latest news...</p>
        </div>
    `;
}

function showError(message) {
    document.getElementById('content').innerHTML = `
        <div class="error-message">
            ⚠️ ${sanitizeHTML(message)}
        </div>
    `;
}

function showEmpty(message = 'No articles found') {
    document.getElementById('content').innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📰</div>
            <h2>${sanitizeHTML(message)}</h2>
            <p>Try adjusting your search criteria</p>
        </div>
    `;
}

// Render News Articles
function renderNews(articles) {
    if (!articles || articles.length === 0) {
        showEmpty();
        return;
    }

    const newsHTML = articles.map(article => {
        const isBookmarked = bookmarkManager.isBookmarked(article.url);
        return `
            <div class="news-card">
                <div onclick="openArticleModal(${escapeJSON(JSON.stringify(article))})">
                    ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${sanitizeHTML(article.title)}" class="news-image" onerror="this.style.display='none'">` : ''}
                    <div class="news-content">
                        <div class="news-source">${sanitizeHTML(article.source.name)}</div>
                        <h3 class="news-title">${sanitizeHTML(article.title)}</h3>
                        <p class="news-description">${sanitizeHTML(truncateText(article.description, 150) || 'No description available')}</p>
                        <div class="news-footer">
                            <span class="news-date">${formatDate(article.publishedAt)}</span>
                            <div class="news-actions">
                                <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                                        onclick="event.stopPropagation(); toggleBookmarkUI(${escapeJSON(JSON.stringify(article))})"
                                        title="${isBookmarked ? 'Remove bookmark' : 'Add bookmark'}">
                                    ${isBookmarked ? '⭐' : '🔖'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('content').innerHTML = `<div class="news-grid">${newsHTML}</div>`;
}

function escapeJSON(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function openArticleModal(article) {
    modalManager.open(article);
}

function toggleBookmarkUI(article) {
    bookmarkManager.toggleBookmark(article);

    // Refresh current view
    if (currentView === 'bookmarks') {
        showBookmarks();
    } else {
        // Re-render to update bookmark icon
        const contentElement = document.getElementById('content');
        if (contentElement) {
            // Just refresh the view with current data
            if (window.lastArticles) {
                renderNews(window.lastArticles);
            }
        }
    }
}

// API Calls
async function searchNews() {
    const keyword = document.getElementById('keyword').value;
    const source = document.getElementById('source').value;
    const sortBy = document.getElementById('sortBy').value;

    if (!keyword && !source) {
        showError('Please enter a keyword or source');
        return;
    }

    showLoading();
    currentView = 'news';

    try {
        let url = `${CONFIG.API_BASE}/search?sortBy=${sortBy}`;
        if (keyword) {
            url += `&q=${encodeURIComponent(keyword)}`;
            searchHistoryManager.add(keyword);
        }
        if (source) url += `&sources=${encodeURIComponent(source)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            showError(data.message || 'Failed to fetch news');
            return;
        }

        window.lastArticles = data.articles.slice(0, CONFIG.MAX_ARTICLES);
        renderNews(window.lastArticles);
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function loadHeadlines(category = '', country = 'us') {
    showLoading();
    currentView = 'news';

    try {
        let url = `${CONFIG.API_BASE}/headlines?country=${country}`;
        if (category) url += `&category=${category}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            showError(data.message || 'Failed to fetch headlines');
            return;
        }

        window.lastArticles = data.articles.slice(0, CONFIG.MAX_ARTICLES);
        renderNews(window.lastArticles);
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

function showBookmarks() {
    currentView = 'bookmarks';
    const bookmarks = bookmarkManager.getAll();

    if (bookmarks.length === 0) {
        showEmpty('No bookmarks yet! Start saving articles you want to read later.');
        return;
    }

    window.lastArticles = bookmarks;
    renderNews(bookmarks);
}

// Category Tab Management
function initializeTabs() {
    const tabsContainer = document.getElementById('category-tabs');

    CATEGORIES.forEach(category => {
        const tab = document.createElement('button');
        tab.className = 'tab-btn' + (category.id === currentCategory ? ' active' : '');
        tab.textContent = category.name;
        tab.onclick = () => selectCategory(category.id);
        tabsContainer.appendChild(tab);
    });

    // Add bookmarks tab
    const bookmarksTab = document.createElement('button');
    bookmarksTab.className = 'tab-btn';
    bookmarksTab.innerHTML = '🔖 Bookmarks <span class="bookmark-count">0</span>';
    bookmarksTab.onclick = () => selectBookmarksTab();
    tabsContainer.appendChild(bookmarksTab);
}

function selectCategory(categoryId) {
    currentCategory = categoryId;

    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Load news for category
    loadHeadlines(categoryId, currentCountry);
}

function selectBookmarksTab() {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Show bookmarks
    showBookmarks();
}

// Country Selection
function initializeCountrySelect() {
    const select = document.getElementById('country');

    COUNTRIES.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        if (country.code === currentCountry) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        currentCountry = e.target.value;
        if (currentView === 'news') {
            loadHeadlines(currentCategory, currentCountry);
        }
    });
}

// Clear Search
function clearSearch() {
    document.getElementById('keyword').value = '';
    document.getElementById('source').value = '';
    document.getElementById('sortBy').value = 'publishedAt';
}

// Search History Management
class SearchHistoryManager {
    constructor() {
        this.HISTORY_KEY = 'newsverse-search-history';
        this.MAX_HISTORY = 5;
    }

    getHistory() {
        const saved = localStorage.getItem(this.HISTORY_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    add(keyword) {
        if (!keyword || keyword.trim() === '') return;

        let history = this.getHistory();
        // Remove duplicate if exists
        history = history.filter(item => item.toLowerCase() !== keyword.toLowerCase());
        // Add to front
        history.unshift(keyword);
        // Limit size
        history = history.slice(0, this.MAX_HISTORY);

        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
        this.render();
    }

    render() {
        const history = this.getHistory();
        const container = document.getElementById('search-history');
        if (!container) return;

        if (history.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-top: 10px;">
                <span style="font-size: 12px; color: var(--text-secondary);">Recent:</span>
                ${history.map(item => `
                    <span class="history-chip" onclick="document.getElementById('keyword').value='${sanitizeHTML(item)}'; searchNews();">
                        ${sanitizeHTML(item)}
                    </span>
                `).join('')}
            </div>
        `;
    }
}

const searchHistoryManager = new SearchHistoryManager();

// Initialize Application
function initializeApp() {
    initializeTabs();
    initializeCountrySelect();
    bookmarkManager.updateCount();

    // Create search history container if it doesn't exist
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
        const container = document.createElement('div');
        container.id = 'search-history';
        container.style.gridColumn = '1 / -1';
        searchSection.appendChild(container);
        searchHistoryManager.render();
    }

    // Load initial headlines
    loadHeadlines(currentCategory, currentCountry);

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+K or Cmd+K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('keyword').focus();
        }
    });
}

// Wait for DOM to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
