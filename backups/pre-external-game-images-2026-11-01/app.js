const express = require('express');


const app = express();
const PORT = process.env.PORT || 3000;

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
