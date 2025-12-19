# InsightGlobal 📰

> Precision News for the Global Professional. A modern, feature-rich news aggregator built with Node.js and vanilla JavaScript

![NewsVerse](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🌐 **Real-time News** - Fetch latest headlines from NewsAPI
- 🗂️ **Category Filtering** - Browse by Business, Technology, Sports, Entertainment, Health, Science
- 🌍 **Country Selection** - Get news from 8 different countries
- 🔖 **Bookmarks** - Save articles for later with localStorage persistence
- 🌙 **Dark/Light Theme** - Toggle between themes with preference saving
- 🔍 **Advanced Search** - Search by keywords, sources, and sorting options
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Glassmorphism effects, smooth animations, and premium design
- 📤 **Share Functionality** - Share articles on Twitter, Facebook, or copy links
- ⚡ **Performance** - Built-in caching to reduce API calls and improve speed

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- NewsAPI key (get free at [newsapi.org](https://newsapi.org))

### Installation

1. **Clone or download the repository**

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
NEWS_API_KEY=your_newsapi_key_here
PORT=3000
```

Alternatively, copy from the example:
```bash
cp .env.example .env
```

Then edit `.env` and add your API key.

4. **Start the server**
```bash
npm start
```

5. **Open in browser**

Navigate to `http://localhost:3000`

## 📁 Project Structure

```
newsverse/
├── public/
│   ├── css/
│   │   └── styles.css          # All styling including themes
│   ├── js/
│   │   ├── app.js              # Main application logic
│   │   ├── bookmarks.js        # Bookmark management
│   │   ├── modal.js            # Article preview modal
│   │   ├── theme.js            # Theme switcher
│   │   └── utils.js            # Utility functions
│   └── index.html              # Main HTML file
├── server.js                   # Express server with API endpoints
├── package.json                # Dependencies and scripts
├── .env.example                # Environment variables template
└── README.md                   # Documentation
```

## 🎯 Usage

### Browsing News

- **Categories**: Click category tabs (All, Business, Technology, etc.) to filter headlines
- **Countries**: Use the country dropdown to select news from different regions
- **Bookmarks**: Click the bookmark tab to view saved articles

### Searching

1. Enter keywords in the search field (e.g., "AI", "Climate")
2. Optionally specify a source (e.g., "bbc-news", "techcrunch")
3. Choose sorting: Latest, Relevance, or Popularity
4. Click "Search"

### Bookmarking Articles

- Click the 🔖 icon on any article card to bookmark it
- Bookmarked articles show a ⭐ icon
- Click again to remove from bookmarks
- View all bookmarks by clicking the "Bookmarks" tab

### Article Preview

- Click any article card to open a preview modal
- View full description and metadata
- Share on social media
- Open the full article in a new tab
- Add/remove bookmarks

### Theme Switching

- Click the 🌙/☀️ button in the header to toggle themes
- Your preference is automatically saved

## 🔧 API Endpoints

### Headlines
```
GET /api/headlines?country={country}&category={category}
```

**Parameters:**
- `country` (optional): 2-letter country code (default: us)
- `category` (optional): business, technology, sports, entertainment, health, science

**Example:**
```
/api/headlines?country=us&category=technology
```

### Search
```
GET /api/search?q={query}&sources={sources}&sortBy={sort}
```

**Parameters:**
- `q` (optional): Keywords to search for
- `sources` (optional): Comma-separated source IDs
- `sortBy` (optional): publishedAt, relevancy, popularity

**Example:**
```
/api/search?q=artificial%20intelligence&sortBy=publishedAt
```

### Sources
```
GET /api/sources?category={category}&language={lang}&country={country}
```

### Health Check
```
GET /api/health
```

## 💡 Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search input
- `Esc` - Close modal

## 🎨 Customization

### Changing Colors

Edit CSS variables in `public/css/styles.css`:

```css
:root {
    --primary: #00d4ff;
    --secondary: #0099cc;
    --accent: #ff006e;
    /* ... more variables */
}
```

### Adding Categories

Edit the `CATEGORIES` array in `public/js/utils.js`:

```javascript
const CATEGORIES = [
    { id: 'your-category', name: 'Your Category' },
    // ...
];
```

## 🐛 Troubleshooting

### API Key Issues
- Ensure your NewsAPI key is correctly set in `.env`
- Check the console for API key validation messages
- Free tier has rate limits (100 requests/day)

### Cache Issues
- Clear browser localStorage: `localStorage.clear()`
- Server cache auto-expires after 5 minutes
- Restart server to clear server-side cache

### News Not Loading
- Check browser console for errors
- Verify server is running on correct port
- Ensure you have internet connection
- Check NewsAPI status at [newsapi.org/status](https://newsapi.org/status)

## 📝 Development

### Adding New Features

1. Frontend logic → `public/js/app.js`
2. New API endpoints → `server.js`
3. Styling → `public/css/styles.css`
4. Utilities → `public/js/utils.js`

### Testing

The application includes:
- Error handling for network issues
- Fallback UI for empty states
- Loading indicators for async operations

## 🌟 Features Roadmap

- [ ] Search history
- [ ] Reading list with notes
- [ ] Pagination for large result sets
- [ ] Trending topics widget
- [ ] Email newsletter subscription
- [ ] PWA support for offline reading
- [ ] User authentication

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- News data provided by [NewsAPI.org](https://newsapi.org)
- Icons: Unicode Emoji
- Design inspired by modern news platforms

## 📧 Contact

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ using Node.js, Express, and Vanilla JavaScript**
