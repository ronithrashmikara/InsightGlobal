// Modal Management
class ModalManager {
    constructor() {
        this.modal = null;
        this.currentArticle = null;
        this.initialize();
    }

    initialize() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div id="article-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Article Preview</h2>
                        <button class="modal-close" id="modal-close">&times;</button>
                    </div>
                    <div class="modal-body" id="modal-body">
                        <!-- Content will be inserted here -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('article-modal');
    }

    attachEventListeners() {
        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(article) {
        this.currentArticle = article;
        this.render();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    render() {
        const article = this.currentArticle;
        const isBookmarked = bookmarkManager.isBookmarked(article.url);

        const content = `
            ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${sanitizeHTML(article.title)}" class="modal-image" onerror="this.style.display='none'">` : ''}
            <h1 class="modal-title">${sanitizeHTML(article.title)}</h1>
            <div class="modal-meta">
                <span class="news-source">${sanitizeHTML(article.source.name)}</span>
                <span>•</span>
                <span>${formatDate(article.publishedAt)}</span>
            </div>
            <p class="modal-description">${sanitizeHTML(article.description || 'No description available')}</p>
            <div class="share-buttons">
                <button class="share-btn" onclick="modalManager.openOriginal()">
                    📰 Read Full Article
                </button>
                <button class="share-btn" onclick="modalManager.toggleBookmark()">
                    ${isBookmarked ? '⭐ Remove Bookmark' : '🔖 Bookmark'}
                </button>
                <button class="share-btn" onclick="modalManager.share('twitter')">
                    🐦 Share on Twitter
                </button>
                <button class="share-btn" onclick="modalManager.share('facebook')">
                    📘 Share on Facebook
                </button>
                <button class="share-btn" onclick="modalManager.copyLink()">
                    🔗 Copy Link
                </button>
            </div>
        `;

        document.getElementById('modal-body').innerHTML = content;
    }

    openOriginal() {
        window.open(this.currentArticle.url, '_blank');
    }

    toggleBookmark() {
        bookmarkManager.toggleBookmark(this.currentArticle);
        this.render(); // Refresh modal to update bookmark button

        // Refresh the main view if we're on bookmarks page
        if (window.currentView === 'bookmarks') {
            window.showBookmarks();
        }
    }

    share(platform) {
        const url = encodeURIComponent(this.currentArticle.url);
        const title = encodeURIComponent(this.currentArticle.title);

        let shareUrl;
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    copyLink() {
        navigator.clipboard.writeText(this.currentArticle.url).then(() => {
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }
}

// Initialize modal manager
const modalManager = new ModalManager();
