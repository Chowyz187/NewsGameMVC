const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const demoProfile = require('./data/users.json').profile;
const demoGames = require('./data/games.json').games;
const demoCategories = require('./data/categories.json').categories.map((category) => {
    const categoryGames = demoGames.filter((game) => game.genre === category.name);
    return {
        ...category,
        games: categoryGames,
        gameCount: categoryGames.length
    };
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Set up view engine and static files
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));


// Home page
app.get('/', (req, res) => {
    res.render('pages/home');
});

// Authentication pages
app.get('/login', (req, res) => {
    res.render('pages/auth/login');
});

app.get('/register', (req, res) => {
    res.render('pages/auth/register');
});

// Demo profile pages (read-only fixture data)
app.get('/users/profile', (req, res) => {
    res.render('pages/users/profile', { profile: demoProfile });
});

app.get('/users/edit-profile', (req, res) => {
    res.render('pages/users/edit-profile', { profile: demoProfile });
});

// Demo game pages (read-only fixture data)
app.get('/games', (req, res) => {
    res.render('pages/games/index', { games: demoGames });
});

app.get('/games/new', (req, res) => {
    res.render('pages/games/form', { isEdit: false, game: {} });
});

app.get('/games/:slug/edit', (req, res) => {
    const game = demoGames.find((item) => item.slug === req.params.slug);
    if (!game) {
        return res.status(404).render('pages/errors/404');
    }

    res.render('pages/games/form', { isEdit: true, game });
});

app.get('/games/:slug', (req, res) => {
    const game = demoGames.find((item) => item.slug === req.params.slug);
    if (!game) {
        return res.status(404).render('pages/errors/404');
    }

    res.render('pages/games/detail', { game });
});

// Demo categories page (read-only fixture data)
app.get('/categories', (req, res) => {
    res.render('pages/categories/index', { categories: demoCategories });
});

// Error pages
app.get('/403', (req, res) => {
    res.status(403).render('pages/errors/403');
});

app.get('/404', (req, res) => {
    res.status(404).render('pages/errors/404');
});

app.get('/500', (req, res) => {
    res.status(500).render('pages/errors/500');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
