require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.NEWS_API_KEY;
if (!API_KEY) {
    console.warn('NEWS_API_KEY is not set. Add it to .env before starting the server.');
}
const API_BASE = 'https://newsapi.org/v2';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Cache middleware
function getCached(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    cache.delete(key);
    return null;
}

function setCache(key, data) {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Search endpoint
app.get('/api/search', async (req, res) => {
    try {
        const { q, sources, sortBy } = req.query;
        const cacheKey = `search:${q}:${sources}:${sortBy}`;

        // Check cache
        const cached = getCached(cacheKey);
        if (cached) {
            console.log('Returning cached search results');
            return res.json(cached);
        }

        let url = `${API_BASE}/everything?sortBy=${sortBy || 'publishedAt'}&apiKey=${API_KEY}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        if (sources) url += `&sources=${encodeURIComponent(sources)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // Cache the result
        setCache(cacheKey, data);
        res.json(data);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Headlines endpoint with category support
app.get('/api/headlines', async (req, res) => {
    try {
        const { country = 'us', category = '' } = req.query;
        const cacheKey = `headlines:${country}:${category}`;

        // Check cache
        const cached = getCached(cacheKey);
        if (cached) {
            console.log('Returning cached headlines');
            return res.json(cached);
        }

        let url = `${API_BASE}/top-headlines?country=${country}&apiKey=${API_KEY}`;
        if (category) url += `&category=${category}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // Cache the result
        setCache(cacheKey, data);
        res.json(data);
    } catch (error) {
        console.error('Headlines error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Sources endpoint
app.get('/api/sources', async (req, res) => {
    try {
        const { category = '', language = '', country = '' } = req.query;
        const cacheKey = `sources:${category}:${language}:${country}`;

        // Check cache
        const cached = getCached(cacheKey);
        if (cached) {
            console.log('Returning cached sources');
            return res.json(cached);
        }

        let url = `${API_BASE}/sources?apiKey=${API_KEY}`;
        if (category) url += `&category=${category}`;
        if (language) url += `&language=${language}`;
        if (country) url += `&country=${country}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // Cache the result
        setCache(cacheKey, data);
        res.json(data);
    } catch (error) {
        console.error('Sources error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        cache_size: cache.size
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 NewsVerse Server Running`);
    console.log(`${'='.repeat(50)}`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🔑 API Key: ${API_KEY ? '✓ Configured' : '✗ Missing'}`);
    console.log(`💾 Cache: Enabled (5 min TTL)`);
    console.log(`${'='.repeat(50)}\n`);
});
