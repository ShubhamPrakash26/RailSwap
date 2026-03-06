const router = require('express').Router();
const faqCtrl = require('../controllers/faqController');

// Accepts POST { q: 'question text' } or GET /?q=...
router.post('/', faqCtrl.ask);
router.get('/', faqCtrl.ask);

module.exports = router;
