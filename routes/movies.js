const router = require('express').Router();
const {
  getMovies, postMovie, deleteMovie,
} = require('../controllers/movies');
const { moviesValididty, idValidity } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', moviesValididty, postMovie);
router.delete('/:_id', idValidity, deleteMovie);

module.exports = router;
