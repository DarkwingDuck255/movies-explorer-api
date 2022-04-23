const movie = require('../models/movie');
const BadRequest = require('../utils/bad-request');
const NotFound = require('../utils/not-found');
// const DefaultError = require('../utils/default-error');
const AccessDenied = require('../utils/access-denied');

const getMovies = (req, res, next) => {
  const cardMovie = {};
  return movie.find(cardMovie)
    .then((result) => res.status(200).send(result))
    .catch(next);
};

const postMovie = (req, res, next) => {
  const {
    nameRU, nameEN, thumbnail, trailerLink, image, description, year, duration, director, country,
    movieId,
  } = req.body;
  const owner = req.user._id;

  return movie.create({
    nameRU,
    nameEN,
    thumbnail,
    trailerLink,
    image,
    description,
    year,
    duration,
    director,
    country,
    owner,
    movieId,
  })
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при добавлении карточки'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { id } = req.params;

  return movie.findById(id)
    .orFail(new NotFound('Карточка в базе не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new AccessDenied('не удаляй фильм чужой!'));
      }
      return card.remove()
        .then(() => res.status(200).send({ message: 'Твой фильм удален, холоп))' }));
    })
    .catch(next);
};

module.exports = {
  getMovies, postMovie, deleteMovie,
};
