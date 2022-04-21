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
        return next(new AccessDenied('не удааляй фильм чужой!'));
      }
      return card.remove()
        .then(() => res.status(200).send({ message: 'Твой фильм удален, холоп))' }));
    })
    .catch(next);
};

// const putCardLike = (req, res, next) => {
//   const { id } = req.params;

// eslint-disable-next-line max-len
//   return movie.findOneAndUpdate({ _id: id }, { $addToSet: { likes: req.user._id } }, { new: true })
//     .orFail(new NotFound('Передан несуществующий _id карточки.'))
//     .then((result) => res.status(200).send(result))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequest('Переданы некорректные данные для постановки/снятиия лайка'));
//       } else {
//         next(err);
//       }
//     });
// };

// const deleteCardLike = (req, res, next) => {
//   const { id } = req.params;

//   return movie.findOneAndUpdate({ _id: id }, { $pull: { likes: req.user._id } }, { new: true })
//     .orFail(new NotFound('Передан несуществующий _id карточки.'))
//     .then((result) => res.status(200).send(result))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequest('Переданы некорректные данные для постановки/снятиия лайка'));
//       } else {
//         next(err);
//       }
//     });
// };

module.exports = {
  getMovies, postMovie, deleteMovie,
};
