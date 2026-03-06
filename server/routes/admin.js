const express = require('express');
const router = express.Router();
const passport = require('passport');
const isAdmin = require('../middleware/isAdmin');
const ctrl = require('../controllers/adminController');

// Protect with JWT + isAdmin check
router.get('/issues', passport.authenticate('jwt', { session: false }), isAdmin, ctrl.getIssues);
router.get('/reviews', passport.authenticate('jwt', { session: false }), isAdmin, ctrl.getReviews);
router.get('/reviews/keywords', passport.authenticate('jwt', { session: false }), isAdmin, ctrl.getReviewKeywordStats);
router.patch('/issues/:id/status', passport.authenticate('jwt', { session: false }), isAdmin, ctrl.updateIssueStatus);
router.patch('/issues/:id/status', passport.authenticate('jwt', { session: false }), isAdmin, ctrl.updateIssueStatus);

module.exports = router;
