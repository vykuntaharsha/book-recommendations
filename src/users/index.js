const router = require('express').Router();

const users = require('./users');

router.post('/', users);

module.exports = router;
