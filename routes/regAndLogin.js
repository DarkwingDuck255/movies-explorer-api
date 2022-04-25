const router = require('express').Router();
const { loginValidity, signupValidity } = require('../middlewares/validation');
const { login, postUser } = require('../controllers/users');

router.post('/signin', loginValidity, login);
router.post('/signup', signupValidity, postUser);

module.exports = router;
