const Movie = require('../models/movie');
const { STATUS_CODE_OBJECT_CREATED } = require('../utils/constants');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (_, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies.reverse()))
    .catch((error) => next(error));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailerLink, nameRU,
    nameEN, thumbnail, movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(STATUS_CODE_OBJECT_CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => { throw new NotFoundError('_id фильма не найден'); })
    .then((movie) => {
      if (movie.owner.toString() !== owner) {
        throw new ForbiddenError('Нет прав для удаления');
      } else {
        Movie.findByIdAndDelete(movieId)
          .then(() => {
            res.send({ message: `Фильм  '${movie.nameRU}' удален из избранного` });
          })
          .catch(next);
      }
    })
    .catch(next);
};
