const Station = require('../models/Station');
const Train = require('../models/Train');
const TrainStop = require('../models/TrainStop');

exports.getStations = async (req, res) => {
  try {
    const stations = await Station.find({}).limit(1000).lean();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stations' });
  }
};

exports.getTrains = async (req, res) => {
  try {
    const trains = await Train.find({}).limit(1000).lean();
    res.json(trains);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trains' });
  }
};

exports.getTrainStops = async (req, res) => {
  const { number } = req.params;
  try {
    const stops = await TrainStop.find({ trainNumber: number }).sort({ stopNumber: 1 }).lean();
    res.json(stops);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch train stops' });
  }
};

exports.getStopsByStation = async (req, res) => {
  const { station } = req.query;
  try {
    const stops = await TrainStop.find({ stationCode: station }).sort({ trainNumber: 1 }).lean();
    res.json(stops);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stops for station' });
  }
};
