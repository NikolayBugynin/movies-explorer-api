const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login, signOut } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validationCreateUser, validationLogin } = require('../validation/validation');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);
router.use(auth);

// Маршрут для выхода пользователя
router.post('/signout', signOut);
// // Роутеры, требующие авторизации
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('*', (req, res, next) => { next(new NotFoundError('Страница не найдена')); });

module.exports = router;
