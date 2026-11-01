function setGameImage(container, game, className) {
    if (!container || !game) {
        return;
    }

    const image = document.createElement('img');
    image.className = className;
    image.src = game.thumbnail;
    image.alt = game.title;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('load', () => container.classList.add('api-image-loaded'), { once: true });
    image.addEventListener('error', () => {
        image.remove();
        container.classList.remove('api-image-loaded');
        console.warn(`Không tải được hình game: ${game.title}`);
    }, { once: true });
    container.prepend(image);
}

async function loadFeaturedGameImages() {
    try {
        const response = await fetch('/api/games/featured');
        if (!response.ok) {
            throw new Error(`API ảnh game trả về HTTP ${response.status}`);
        }

        const payload = await response.json();
        if (!Array.isArray(payload.games) || payload.games.length === 0) {
            throw new Error('API ảnh game không trả về dữ liệu hợp lệ');
        }

        const games = payload.games;
        const heroGame = games[7] || games[0];
        const hero = document.querySelector('.hero-art');
        if (hero) {
            setGameImage(hero, heroGame, 'hero-api-image');
        }

        document.querySelectorAll('.news-image').forEach((container, index) => {
            const game = games[index + 4];
            if (game) {
                setGameImage(container, game, 'api-cover-image');
            }
        });

        document.querySelectorAll('.game-card').forEach((card, index) => {
            const game = games[index];
            if (!game) {
                return;
            }

            const cover = card.querySelector('.game-cover');
            const title = card.querySelector('.game-info h3 a');
            const description = card.querySelector('.game-info > p');
            const platform = card.querySelector('.cover-platform');

            setGameImage(cover, game, 'api-cover-image');
            if (title) title.textContent = game.title;
            if (description) description.textContent = game.genre;
            if (platform) platform.textContent = game.platform;
        });
    } catch (error) {
        console.warn('Đang dùng giao diện ảnh dự phòng vì không tải được API game:', error);
    }
}

loadFeaturedGameImages();
