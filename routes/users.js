const router = require('express').Router();
const { aboutUserValidity } = require('../middlewares/validation');

const { patchUser, getCurrentUser } = require('../controllers/users');

// router.get('/', getUsers);
router.get('/me', getCurrentUser);
// router.get('/:id', idValidity, getUser);
router.patch('/me', aboutUserValidity, patchUser);
// router.patch('/me/avatar', avatarLinkValidity, patchUserAvatar);

module.exports = router;
