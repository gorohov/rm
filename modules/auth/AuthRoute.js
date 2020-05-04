const express = require('express');
const AuthController = require('./AuthController');
const UserController = require('../users/UserController');

const route = express.Router();

route.post('/signup', AuthController.signup, AuthController.createAndSendToken);
route.post(
    '/login',
    UserController.createPasswordCheckMiddleware('login'),
    AuthController.login,
    AuthController.createAndSendToken,
);
route.post('/forgot', AuthController.forgot);
route.patch(
    '/reset/:token',
    AuthController.reset,
    AuthController.createAndSendToken,
);
route.post('/logout', AuthController.logout);

module.exports = route;