const express = require('express');
const router = express.Router();
const passport = require('passport');
const ctrl = require('../controllers/reviewController');

router.post('/', passport.authenticate('jwt', { session: false }), ctrl.createReview);
router.get('/', passport.authenticate('jwt', { session: false }), ctrl.listReviews);

module.exports = router;
