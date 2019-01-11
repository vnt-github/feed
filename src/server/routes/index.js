const express = require('express');

const router = express.Router();

router.use('/feed', require('./feed'));
router.use('/posts', require('./posts'));
router.use('/users', require('./users'));
router.use('/actions', require('./actions'));

module.exports = router;