const TrainStop = require('../models/TrainStop');

// Simple route search: direct and one-transfer (no time checks)
exports.searchRoutes = async (req, res) => {
  const from = (req.query.from || '').toUpperCase();
  const to = (req.query.to || '').toUpperCase();

  if (!from || !to) return res.status(400).json({ message: 'from and to required' });

  try {
    const results = [];

    // Direct trains
    const fromStops = await TrainStop.find({ stationCode: from }).lean();
    const trainNumbers = [...new Set(fromStops.map(s => s.trainNumber))];

    for (const t of trainNumbers) {
      const stopFrom = fromStops.find(s => s.trainNumber === t);
      const stopTo = await TrainStop.findOne({ trainNumber: t, stationCode: to }).lean();
      if (stopTo && stopTo.stopNumber > (stopFrom.stopNumber || 0)) {
        results.push({
          route: [from, to],
          trains: [t],
          transfers: 0,
        });
      }
      if (results.length >= 10) break;
    }

    if (results.length) return res.json(results);

    // One-transfer: find intermediates reachable from `from`, then to `to`
    // Collect candidate intermediates from trains leaving `from`
    const intermediates = new Set();
    for (const s of fromStops) {
      const laterStops = await TrainStop.find({ trainNumber: s.trainNumber, stopNumber: { $gt: s.stopNumber } }).lean();
      laterStops.forEach(ls => intermediates.add(ls.stationCode));
    }

    // For each intermediate, check if there's a train from intermediate to to
    for (const mid of intermediates) {
      const trainsFromMid = await TrainStop.find({ stationCode: mid }).lean();
      const trainNums = [...new Set(trainsFromMid.map(t => t.trainNumber))];

      for (const t2 of trainNums) {
        const midStop = trainsFromMid.find(s => s.trainNumber === t2);
        const toStop = await TrainStop.findOne({ trainNumber: t2, stationCode: to }).lean();
        if (toStop && toStop.stopNumber > (midStop.stopNumber || 0)) {
          // we have a connection: find a train from `from` to `mid`
          const fromTrain = await TrainStop.findOne({ stationCode: from, stationCode: from, trainNumber: { $in: trainNumbers } });
          // Instead of strict time checks, pick any trainNumber from initial list that reaches mid
          const connector = await TrainStop.findOne({ trainNumber: { $in: trainNumbers }, stationCode: mid }).lean();
          if (connector) {
            results.push({
              route: [from, mid, to],
              trains: [connector.trainNumber, t2],
              transfers: 1
            });
          }
        }
        if (results.length >= 10) break;
      }
      if (results.length >= 10) break;
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Route search failed' });
  }
};
