const path = require('path');
const fs = require('fs');

// Load and cache JSON data from server/data
let DATA_CACHE = null;
function loadData() {
  if (DATA_CACHE) return DATA_CACHE;
  const dataDir = path.join(__dirname, '..', 'data');
  const trainsPath = path.join(dataDir, 'trains.json');
  const stationsPath = path.join(dataDir, 'stations.json');

  const trainsRaw = fs.readFileSync(trainsPath, 'utf8');
  const stationsRaw = fs.readFileSync(stationsPath, 'utf8');

  let trains = JSON.parse(trainsRaw);
  // If file is a GeoJSON FeatureCollection (many datasets use this), normalize
  if (trains && trains.type === 'FeatureCollection' && Array.isArray(trains.features)) {
    trains = trains.features.map(f => {
      const p = f.properties || {};
      const fromCode = (p.from_station_code || p.from || p.fromCode || p.fromStation || '').toUpperCase();
      const toCode = (p.to_station_code || p.to || p.toCode || p.toStation || '').toUpperCase();
      return {
        number: (p.number || p.train_number || p.no || '').toString(),
        name: p.name || p.train_name || '',
        distance: p.distance || p.distance_m || p.distance_km || null,
        // create minimal two-stop route when full stop list isn't available
        stops: [
          { stationCode: fromCode, departureTime: (p.departure || p.departure_time || p.dep_time || null), arrivalTime: (p.arrival || p.arrival_time || null), stopNumber: 1, distance: 0 },
          { stationCode: toCode, arrivalTime: (p.arrival || p.arrival_time || null), departureTime: (p.departure || p.departure_time || p.dep_time || null), stopNumber: 2, distance: p.distance || null }
        ]
      };
    });
  }
  const stations = JSON.parse(stationsRaw);

  // Normalize stations map: code -> { name }
  const stationMap = {};
  if (Array.isArray(stations)) {
    stations.forEach(s => {
      const code = (s.code || s.stationCode || s.station_code || s.code_uic || '').toUpperCase();
      if (code) stationMap[code] = s;
    });
  } else if (typeof stations === 'object') {
    Object.keys(stations).forEach(k => stationMap[k.toUpperCase()] = stations[k]);
  }

  DATA_CACHE = { trains, stationMap };
  return DATA_CACHE;
}

function stationName(code, stationMap) {
  const s = stationMap[code.toUpperCase()];
  if (!s) return code;
  return s.name || s.station_name || s.station || `${s.code || code}`;
}

function parseTime(t) {
  if (!t) return null;
  // Accept formats like "HH:MM" or "H:MM"
  const m = t.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  return hh * 60 + mm;
}

function durationMinutes(arrMin, depMin) {
  if (arrMin == null || depMin == null) return null;
  let diff = depMin - arrMin;
  if (diff < 0) diff += 24 * 60; // wrap next day
  return diff;
}

// Create a lightweight representation of a train's stops for fast lookups
function buildStopsMap(train) {
  const stops = train.stops || train.stop_list || train.route || [];
  // Standardize to array of { stationCode, arrivalTime, departureTime, stopNumber }
  return stops.map((s, idx) => ({
    stationCode: (s.stationCode || s.station_code || s.code || s.station || '').toUpperCase(),
    arrivalTime: s.arrivalTime || s.arrival || s.arr_time || s.at || null,
    departureTime: s.departureTime || s.departure || s.dep_time || s.dt || null,
    stopNumber: s.stopNumber || s.stop_number || s.position || idx + 1,
    distance: s.distance || s.distance_km || s.dist || null
  }));
}

function estimatePricePerClass(km) {
  if (!km || km <= 0) return null;
  // Base per-km pricing tiers (INR per km)
  let perKm = 1.1; // default
  if (km <= 100) perKm = 0.9;
  else if (km <= 300) perKm = 1.6;
  else if (km <= 700) perKm = 1.9;
  else perKm = 0.6;

  const base = km * perKm;
  const fee = 35; // booking/service fee (flat)
  const gstRate = 0.05; // 5% tax

  // Multipliers approximate relative fares for classes
  const classMultipliers = {
    SL: 1.0,   // Sleeper
    '3A': 2.5, // 3AC
    '2A': 3.2, // 2AC
    '1A': 4.0  // 1AC
  };

  const prices = {};
  Object.keys(classMultipliers).forEach(cls => {
    const subtotal = base * classMultipliers[cls];
    const total = Math.round(subtotal + fee + (subtotal + fee) * gstRate);
    prices[cls] = total;
  });

  return prices;
}

function computeDistanceKmForTrainBetween(tr, fromCode, toCode) {
  const stops = tr.stops || [];
  const idxFrom = stops.findIndex(s => s.stationCode === fromCode);
  const idxTo = stops.findIndex(s => s.stationCode === toCode);
  if (idxFrom === -1 || idxTo === -1 || idxTo <= idxFrom) return null;

  const stopFrom = stops[idxFrom];
  const stopTo = stops[idxTo];

  // If both stops provide distance fields, use difference
  if (stopFrom.distance != null && stopTo.distance != null) {
    const d = Number(stopTo.distance) - Number(stopFrom.distance);
    if (!isNaN(d) && d >= 0) return d;
  }

  // If train has total distance and stops have indices, approximate proportionally
  if (tr.distance != null && stops.length >= 2) {
    const total = Number(tr.distance);
    if (!isNaN(total) && total > 0) {
      const proportion = (idxTo - idxFrom) / (stops.length - 1);
      return Math.max(1, Math.round(total * proportion));
    }
  }

  // Fallback: estimate by stop count * average km per stop
  const avgKmPerStop = 50; // rough average
  return Math.max(1, (idxTo - idxFrom) * avgKmPerStop);
}

// Main search: direct + one-transfer. Returns best candidate routes sorted by transfers and duration
exports.searchRoutes = (req, res) => {
  const fromRaw = (req.query.from || '').trim();
  const toRaw = (req.query.to || '').trim();
  const from = fromRaw.toUpperCase();
  const to = toRaw.toUpperCase();

  if (!from || !to) return res.status(400).json({ message: 'from and to required' });

  try {
    const { trains, stationMap } = loadData();

    const results = [];

    // Prebuild maps for fast lookup
    const trainsWithStops = trains.map(t => ({
      number: t.number || t.train_number || t.trainNo || t.no || t.code,
      name: t.name || t.train_name || t.title || '',
      stops: buildStopsMap(t)
    }));

    // Direct trains
    for (const tr of trainsWithStops) {
      const sFrom = tr.stops.find(s => s.stationCode === from);
      const sTo = tr.stops.find(s => s.stationCode === to);
      if (sFrom && sTo && sTo.stopNumber > sFrom.stopNumber) {
        // compute duration using times if possible
        const arr = parseTime(sFrom.departureTime) || parseTime(sFrom.arrivalTime);
        const dep = parseTime(sTo.arrivalTime) || parseTime(sTo.departureTime);
        const dur = durationMinutes(arr, dep) || Math.max(0, (sTo.stopNumber - sFrom.stopNumber) * 60);

        // compute distance and estimate price per class
        const distKm = computeDistanceKmForTrainBetween(tr, from, to) || tr.distance || null;
        const priceBreakdown = distKm ? estimatePricePerClass(distKm) : null;
        const priceDisplay = priceBreakdown ? Object.fromEntries(Object.entries(priceBreakdown).map(([k,v]) => [k, `₹${v}`])) : null;

        results.push({
          route: [ { code: from, name: stationName(from, stationMap) }, { code: to, name: stationName(to, stationMap) } ],
          trains: [ { number: tr.number, name: tr.name } ],
          transfers: 0,
          durationMinutes: dur,
          distanceKm: distKm,
          price: priceBreakdown,
          priceDisplay: priceDisplay
        });
      }
    }

    // If we have direct results, sort by duration and return top results
    if (results.length) {
      results.sort((a,b) => a.durationMinutes - b.durationMinutes);
      return res.json(results.slice(0, 10));
    }

    // One-transfer search
    // Step 1: find all candidate mid stations reachable from `from`
    const fromTrains = trainsWithStops.filter(tr => tr.stops.some(s => s.stationCode === from));
    const midCandidates = new Set();

    for (const tr of fromTrains) {
      const sFrom = tr.stops.find(s => s.stationCode === from);
      if (!sFrom) continue;
      tr.stops.forEach(s => {
        if (s.stopNumber > sFrom.stopNumber) midCandidates.add(s.stationCode);
      });
    }

    // For each mid, try to pair a train from `from`=>mid and mid=>to
    for (const mid of Array.from(midCandidates)) {
      // trains arriving at mid that depart after they left from
      const trainsToMid = trainsWithStops.filter(tr => {
        const sFrom = tr.stops.find(s => s.stationCode === from);
        const sMid = tr.stops.find(s => s.stationCode === mid);
        return sFrom && sMid && sMid.stopNumber > sFrom.stopNumber;
      });

      const trainsFromMidToDest = trainsWithStops.filter(tr => {
        const sMid = tr.stops.find(s => s.stationCode === mid);
        const sTo = tr.stops.find(s => s.stationCode === to);
        return sMid && sTo && sTo.stopNumber > sMid.stopNumber;
      });

      for (const t1 of trainsToMid) {
        for (const t2 of trainsFromMidToDest) {
          // Ensure there is at least some plausible transfer time if times exist
          const t1MidStop = t1.stops.find(s => s.stationCode === mid);
          const t2MidStop = t2.stops.find(s => s.stationCode === mid);

          const t1Arr = parseTime(t1MidStop.arrivalTime) || parseTime(t1MidStop.departureTime);
          const t2Dep = parseTime(t2MidStop.departureTime) || parseTime(t2MidStop.arrivalTime);

          // Accept if time data not available or t2Dep >= t1Arr (allow small negative with wrap)
          let ok = true;
          if (t1Arr != null && t2Dep != null) {
            // allow a minimum transfer of 10 minutes
            let diff = t2Dep - t1Arr;
            if (diff < 0) diff += 24*60;
            ok = diff >= 10;
          }

          if (!ok) continue;

          // compute total duration: from departure at `from` on t1 to arrival at `to` on t2
          const sFromOnT1 = t1.stops.find(s => s.stationCode === from);
          const sToOnT2 = t2.stops.find(s => s.stationCode === to);
          const startMin = parseTime(sFromOnT1.departureTime) || parseTime(sFromOnT1.arrivalTime) || 0;
          const endMin = parseTime(sToOnT2.arrivalTime) || parseTime(sToOnT2.departureTime) || (startMin + (t2.stops.find(s => s.stationCode === to).stopNumber - t2.stops.find(s => s.stationCode === mid).stopNumber) * 60);
          const totalDur = durationMinutes(startMin, endMin) || Math.max(0, ((t1.stops.find(s => s.stationCode === mid).stopNumber - sFromOnT1.stopNumber) + (sToOnT2.stopNumber - t2.stops.find(s => s.stationCode === mid).stopNumber)) * 60);

          // compute approximate distance (sum of segments) and price per class
          const dist1 = computeDistanceKmForTrainBetween(t1, from, mid) || t1.distance || null;
          const dist2 = computeDistanceKmForTrainBetween(t2, mid, to) || t2.distance || null;
          let totalKm = null;
          if (dist1 != null && dist2 != null) totalKm = dist1 + dist2;
          else if (dist1 != null) totalKm = dist1;
          else if (dist2 != null) totalKm = dist2;

          const priceBreakdown = totalKm ? estimatePricePerClass(totalKm) : null;
          const priceDisplay = priceBreakdown ? Object.fromEntries(Object.entries(priceBreakdown).map(([k,v]) => [k, `₹${v}`])) : null;

          results.push({
            route: [ { code: from, name: stationName(from, stationMap) }, { code: mid, name: stationName(mid, stationMap) }, { code: to, name: stationName(to, stationMap) } ],
            trains: [ { number: t1.number, name: t1.name }, { number: t2.number, name: t2.name } ],
            transfers: 1,
            durationMinutes: totalDur,
            distanceKm: totalKm,
            price: priceBreakdown,
            priceDisplay: priceDisplay
          });
        }
      }
    }

    // Sort by transfers (all 1 here) then duration
    results.sort((a,b) => a.transfers - b.transfers || (a.durationMinutes || 1e9) - (b.durationMinutes || 1e9));

    // Return top 10
    res.json(results.slice(0, 10));
  } catch (err) {
    console.error('Route search error', err);
    res.status(500).json({ message: 'Route search failed' });
  }
};
