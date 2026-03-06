const router = require('express').Router();
const routeCtrl = require('../controllers/routeController');

router.get('/search', routeCtrl.searchRoutes);

module.exports = router;
