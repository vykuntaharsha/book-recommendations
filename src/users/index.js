const users = require('express').Router();

const user = require('./users');

users.post('/', user);

module.exports = users;
