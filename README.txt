NEWSGAME MVC - ERROR PAGES

Files:
- views/pages/errors/403.pug
- views/pages/errors/404.pug
- views/pages/errors/500.pug
- public/css/error-pages.css

Copy the 3 Pug files into your project's views/pages/errors/ folder.
Copy error-pages.css into your project's public/css/ folder.

The Pug pages are standalone HTML documents and do not depend on your main layout.
They load the stylesheet from /css/error-pages.css, so make sure Express serves
public as a static directory, for example:

app.use(express.static('public'));

Example Express routes (adapt to your current routing setup):

app.get('/demo/403', (req, res) => res.status(403).render('pages/errors/403'));
app.get('/demo/404', (req, res) => res.status(404).render('pages/errors/404'));
app.get('/demo/500', (req, res) => res.status(500).render('pages/errors/500'));

For a real 404 fallback, register this AFTER all other routes:
app.use((req, res) => res.status(404).render('pages/errors/404'));

For a real 500 page, use an error handler with four arguments:
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('pages/errors/500');
});

Do not expose stack traces or private error details to visitors in production.
