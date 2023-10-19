//SETUP - Modules
var express = require('express');
var router = express.Router();

//SETUP - Import Routes
const add = require('./add')
const one = require('./one')
const create = require('./create')
const update = require('./update')
// const cancel = require('./cancel')


router.use('/', add);
router.use('/', one);
router.use('/', create);
router.use('/', update);
// router.use('/', update);
// router.use('/', cancel);


module.exports = router;