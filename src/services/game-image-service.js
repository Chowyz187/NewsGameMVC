const API_URL = 'https://www.freetogame.com/api/games?sort-by=popularity';
const IMAGE_HOST = 'www.freetogame.com';
const CACHE_DURATION_MS = 15 * 60 * 1000;

let cachedGames = null;
let cacheExpiresAt = 0;

function normalizeGame(game) {
    if (!game || typeof game.title !== 'string' || typeof game.thumbnail !== 'string') {
        return null;
    }

    let imageUrl;
    try {
        imageUrl = new URL(game.thumbnail);
    } catch {
        return null;
    }

    if (imageUrl.protocol !== 'https:' || imageUrl.hostname !== IMAGE_HOST) {
        return null;
    }

    return {
        title: game.title,
        thumbnail: imageUrl.href,
        genre: typeof game.genre === 'string' ? game.genre : 'Game',
        platform: typeof game.platform === 'string' ? game.platform : 'Đa nền tảng'
    };
}

async function getFeaturedGames() {
    if (cachedGames && Date.now() < cacheExpiresAt) {
        return cachedGames;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(API_URL, {
            headers: { Accept: 'application/json' },
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`FreeToGame trả về HTTP ${response.status}`);
        }

        const payload = await response.json();
        if (!Array.isArray(payload)) {
            throw new Error('Dữ liệu trả về từ FreeToGame không đúng định dạng');
        }

        const games = payload.map(normalizeGame).filter(Boolean).slice(0, 8);
        if (games.length === 0) {
            throw new Error('FreeToGame không trả về game có hình ảnh hợp lệ');
        }

        cachedGames = games;
        cacheExpiresAt = Date.now() + CACHE_DURATION_MS;
        return games;
    } finally {
        clearTimeout(timeout);
    }
}

module.exports = { getFeaturedGames };
