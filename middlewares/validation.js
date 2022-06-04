const { celebrate, Joi } = require('celebrate');

const loginValidity = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const linkAddress = /^(https?:\/\/)?(www.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?$/;

const signupValidity = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const aboutUserValidity = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    // password: Joi.string().required(),
  }),
});

const moviesValididty = celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(linkAddress),
    trailerLink: Joi.string().pattern(linkAddress),
    image: Joi.string().pattern(linkAddress),
    description: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    director: Joi.string().required(),
    country: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

const idValidity = celebrate({
  params: Joi.object({
    _id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  loginValidity, signupValidity, aboutUserValidity, moviesValididty, idValidity,
};
