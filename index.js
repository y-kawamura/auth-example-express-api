const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const auth = require('./auth');
const notes = require('./api/notes');
const users = require('./api/users');
const middlewares = require('./auth/middlewares');

const app = express();

app.use(volleyball);
app.use(
  cors({
    origin: 'http://localhost:8080'
  })
);
app.use(express.json());

// rate limit for login request
// app.use(
//   rateLimit('/auth/login', {
//     windowMs: 15 * 60 * 1000, // 15 min
//     max: 100
//   })
// );

app.use(middlewares.checkTokenSetUser);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello penta!',
    user: req.user
  });
});

app.use('/auth', auth);
app.use('/api/v1/notes', middlewares.isLoggedIn, notes);
app.use('/api/v1/users', users);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
