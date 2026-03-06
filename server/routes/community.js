const router = require('express').Router();
const passport = require('passport');
const ctrl = require('../controllers/communityController');

// Create requires authentication
router.post('/issues', passport.authenticate('jwt', { session: false }), ctrl.createIssue);

// Listing remains public
router.get('/issues', ctrl.listIssues);
router.get('/issues/:id', ctrl.getIssue);

// Update (resolve) requires authentication
router.patch('/issues/:id', passport.authenticate('jwt', { session: false }), ctrl.updateIssue);

module.exports = router;
