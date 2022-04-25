const router = require('express').Router();
const {
  getMovies, postMovie, deleteMovie,
} = require('../controllers/movies');
const { moviesValididty, idValidity } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', moviesValididty, postMovie);
router.delete('/:id', idValidity, deleteMovie);
// router.put('/:id/likes', idValidity, putCardLike);
// router.delete('/:id/likes', idValidity, deleteCardLike);

module.exports = router;
