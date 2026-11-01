const express = require('express');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Website NewsGame đang chạy!');
});
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