const router = require('express').Router();
const passport = require('passport');
const ctrl = require('../controllers/swapController');

// Journeys
router.post('/journey', passport.authenticate('jwt', { session: false }), ctrl.createJourney);
router.get('/journeys', passport.authenticate('jwt', { session: false }), ctrl.listJourneys);

// Swap requests
router.post('/requests', passport.authenticate('jwt', { session: false }), ctrl.createSwapRequest);
router.get('/requests', ctrl.listSwapRequests);
router.get('/requests/my', passport.authenticate('jwt', { session: false }), ctrl.listMySwapRequests);
router.post('/requests/:id/accept', passport.authenticate('jwt', { session: false }), ctrl.acceptSwap);
router.post('/requests/:id/cancel', passport.authenticate('jwt', { session: false }), ctrl.cancelSwap);

module.exports = router;
