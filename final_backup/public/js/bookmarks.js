// Bookmarks Management
class BookmarkManager {
    constructor() {
        this.BOOKMARKS_KEY = 'newsverse-bookmarks';
        this.bookmarks = this.load();
    }

    load() {
        const saved = localStorage.getItem(this.BOOKMARKS_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    save() {
        localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(this.bookmarks));
        this.updateCount();
    }

    add(article) {
        // Check if already bookmarked
        if (this.isBookmarked(article.url)) {
            return false;
        }

        const bookmark = {
            url: article.url,
            title: article.title,
            description: article.description,
            source: article.source,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            savedAt: new Date().toISOString()
        };

        this.bookmarks.unshift(bookmark);
        this.save();
        return true;
    }

    remove(url) {
        this.bookmarks = this.bookmarks.filter(b => b.url !== url);
        this.save();
    }

    isBookmarked(url) {
        return this.bookmarks.some(b => b.url === url);
    }

    getAll() {
        return this.bookmarks;
    }

    clear() {
        this.bookmarks = [];
        this.save();
    }

    updateCount() {
        const countElement = document.querySelector('.bookmark-count');
        if (countElement) {
            countElement.textContent = this.bookmarks.length;
        }
    }

    toggleBookmark(article) {
        if (this.isBookmarked(article.url)) {
            this.remove(article.url);
            return false;
        } else {
            this.add(article);
            return true;
        }
    }
}

// Initialize bookmark manager
const bookmarkManager = new BookmarkManager();
