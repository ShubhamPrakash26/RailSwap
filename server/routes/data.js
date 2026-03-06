const router = require('express').Router();
const data = require('../controllers/dataController');

router.get('/stations', data.getStations);
router.get('/trains', data.getTrains);
router.get('/train/:number/stops', data.getTrainStops);
router.get('/stops', data.getStopsByStation);

module.exports = router;
