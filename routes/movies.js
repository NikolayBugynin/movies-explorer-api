const router = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validationCreateMovie, validationMovieId } = require('../validation/validation');

// возвращает все сохранённые пользователем фильмы
router.get('/', getMovies);
// создаёт фильм
router.post('/', validationCreateMovie, createMovie);
// удаляет сохранённый фильм
router.delete('/:movieId', validationMovieId, deleteMovie);

module.exports = router;
