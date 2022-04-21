const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./movies');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
