<p align="center"><img src="docs/assets/banner.webp" alt="InsightGlobal banner" width="100%"></p>

# InsightGlobal 📰

> Precision News for the Global Professional. A modern, feature-rich news aggregator built with Node.js and vanilla JavaScript

## What's in the repository

- `server.js`: an Express server that proxies [NewsAPI](https://newsapi.org/) through `/api/headlines` (country and category), `/api/search` and `/api/sources`, with a 5-minute in-memory cache and a `/api/health` endpoint. The API key stays on the server.
- `public/`: a vanilla JavaScript front end with category browsing, search, an article modal, bookmarks and a light/dark theme (bookmarks and theme are saved in `localStorage`).

## Run locally

Requires Node.js and a NewsAPI key.

```bash
npm install
echo "NEWS_API_KEY=your_newsapi_key" > .env
npm start
```

Then open http://localhost:3000.

## License

[MIT](LICENSE)
