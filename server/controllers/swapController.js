const Journey = require('../models/Journey');
const SwapRequest = require('../models/SwapRequest');

exports.createJourney = async (req, res) => {
  try {
    const { pnr, trainNumber, coach, seat, seatType, travelDate } = req.body;
    if (!pnr || !trainNumber) return res.status(400).json({ message: 'pnr and trainNumber required' });

    const j = new Journey({
      pnr: String(pnr).trim(),
      user: req.user ? req.user._id : undefined,
      trainNumber: String(trainNumber).trim(),
      coach: coach ? String(coach).trim() : undefined,
      seat: seat ? String(seat).trim() : undefined,
      seatType: seatType ? String(seatType).trim() : undefined,
      travelDate: travelDate ? new Date(travelDate) : undefined
    });

    await j.save();
    res.status(201).json(j);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ message: 'PNR already exists' });
    res.status(500).json({ message: 'Failed to create journey' });
  }
};

exports.listJourneys = async (req, res) => {
  try {
    const { pnr, mine, all } = req.query;
    const q = {};
    if (pnr) q.pnr = String(pnr).trim();

    // By default, return only the authenticated user's journeys when authenticated.
    // If `all=true` is provided, allow returning all journeys (use with caution).
    if (req.user) {
      if (!(all === 'true' || all === '1')) {
        q.user = req.user._id;
      }
    } else {
      // If not authenticated and `mine` was requested, reject; otherwise return no journeys to anonymous users.
      if (mine) return res.status(401).json({ message: 'Unauthorized' });
      // anonymous users: do not expose journeys
      return res.json({ items: [] });
    }

    const items = await Journey.find(q).sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list journeys' });
  }
};

exports.createSwapRequest = async (req, res) => {
  try {
    const { journeyId, desiredSeatType, desiredCoach } = req.body;
    if (!journeyId) return res.status(400).json({ message: 'journeyId required' });

    const journey = await Journey.findById(journeyId).lean();
    if (!journey) return res.status(404).json({ message: 'Journey not found' });

    const sr = new SwapRequest({
      journey: journey._id,
      createdBy: req.user ? req.user._id : undefined,
      trainNumber: journey.trainNumber,
      coach: journey.coach,
      seat: journey.seat,
      seatType: journey.seatType,
      desiredSeatType: desiredSeatType || 'Any',
      desiredCoach: desiredCoach
    });

    await sr.save();
    res.status(201).json(sr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create swap request' });
  }
};

exports.listSwapRequests = async (req, res) => {
  try {
    const { train, seatType, coach, excludeMine } = req.query;
    const q = { status: 'open' };
    if (train) q.trainNumber = String(train).trim();
    if (seatType) q.seatType = String(seatType).trim();
    if (coach) q.coach = String(coach).trim();
    if (excludeMine && req.user) q.createdBy = { $ne: req.user._id };

    let items = await SwapRequest.find(q).sort({ createdAt: -1 }).limit(200).populate('journey').populate({ path: 'createdBy', select: 'name email' }).lean();

    // attach convenient createdByName for client display
    items = items.map(it => ({
      ...it,
      createdByName: it.createdBy ? (it.createdBy.name || (it.createdBy.email ? it.createdBy.email.split('@')[0] : 'User')) : null
    }));

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list swap requests' });
  }
};

exports.listMySwapRequests = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { journeyId } = req.query;
    const q = { createdBy: req.user._id };
    if (journeyId) q.journey = journeyId;
    const items = await SwapRequest.find(q).sort({ createdAt: -1 }).populate('journey').lean();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list my swap requests' });
  }
};

// Accept a swap: try to pair requester `id` with the authenticated user's swap request (or their journey)
exports.acceptSwap = async (req, res) => {
  try {
    const id = req.params.id; // swap request to accept (the one listed)
    const swap = await SwapRequest.findById(id);
    if (!swap) return res.status(404).json({ message: 'Swap request not found' });
    if (swap.status !== 'open') return res.status(400).json({ message: 'Swap not available' });

    // Find acceptor's own swap request or journey
    // Preference: acceptor must have a journey matching trainNumber
    const { myJourneyId } = req.body; // optional: client provides journeyId to use for swap
    let myJourney;
    if (myJourneyId) myJourney = await Journey.findById(myJourneyId).lean();
    else if (req.user) myJourney = await Journey.findOne({ user: req.user._id, trainNumber: swap.trainNumber }).sort({ createdAt: -1 }).lean();

    if (!myJourney) return res.status(400).json({ message: 'No journey found to accept with on this train' });

    // Simple compatibility check: either desiredSeatType matches my seatType or either is 'Any'
    const ok = (swap.desiredSeatType === 'Any') || (String(swap.desiredSeatType).toLowerCase() === String(myJourney.seatType).toLowerCase()) || (String(myJourney.seatType).toLowerCase() === 'rac' && String(swap.desiredSeatType).toLowerCase() === 'rac');
    if (!ok) return res.status(400).json({ message: 'Seat types not compatible for swap' });

    // Create new SwapRequest for acceptor if not exists
    const mySwap = new SwapRequest({
      journey: myJourney._id,
      createdBy: req.user ? req.user._id : undefined,
      trainNumber: myJourney.trainNumber,
      coach: myJourney.coach,
      seat: myJourney.seat,
      seatType: myJourney.seatType,
      desiredSeatType: 'Any'
    });
    await mySwap.save();

    // pair them
    swap.pairedWith.push(mySwap._id);

    // If both are RAC, mark confirmed/accepted
    const isRacA = String(swap.seatType || '').toLowerCase() === 'rac';
    const isRacB = String(mySwap.seatType || '').toLowerCase() === 'rac' || String(myJourney.seatType || '').toLowerCase() === 'rac';

    if (isRacA && isRacB) {
      swap.status = 'accepted';
      swap.confirmed = true;
      swap.confirmationNote = 'Grouped two RACs; allocation pending';

      mySwap.pairedWith.push(swap._id);
      mySwap.status = 'accepted';
      mySwap.confirmed = true;
      mySwap.confirmationNote = 'Grouped two RACs; allocation pending';
    } else {
      swap.status = 'paired';
      mySwap.pairedWith.push(swap._id);
      mySwap.status = 'paired';
    }

    await swap.save();
    await mySwap.save();

    // Update journey seat/coach ownership details so both accounts reflect the swap
    try {
      const requesterJourney = await Journey.findById(swap.journey);
      const acceptorJourney = await Journey.findById(myJourney._id);
      if (requesterJourney && acceptorJourney) {
        // Swap coach, seat and seatType between journeys
        const tmp = { coach: requesterJourney.coach, seat: requesterJourney.seat, seatType: requesterJourney.seatType };
        requesterJourney.coach = acceptorJourney.coach;
        requesterJourney.seat = acceptorJourney.seat;
        requesterJourney.seatType = acceptorJourney.seatType;

        acceptorJourney.coach = tmp.coach;
        acceptorJourney.seat = tmp.seat;
        acceptorJourney.seatType = tmp.seatType;

        await requesterJourney.save();
        await acceptorJourney.save();
      }
    } catch (e) {
      console.error('Failed to update journeys after swap pairing', e);
    }

    // Return swap objects and (fresh) journeys so client can reflect changes immediately
    const updatedRequesterJourney = await Journey.findById(swap.journey).lean();
    const updatedAcceptorJourney = await Journey.findById(myJourney._id).lean();

    // Broadcast via SSE to connected clients so both users see updated journeys in real-time
    try {
      const { sendEvent } = require('../utils/sse');
      sendEvent('swapAccepted', { updatedRequesterJourney, updatedAcceptorJourney });
    } catch (e) {
      console.error('SSE broadcast failed', e);
    }

    res.json({ swap, mySwap, updatedRequesterJourney, updatedAcceptorJourney });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to accept swap' });
  }
};

exports.cancelSwap = async (req, res) => {
  try {
    const id = req.params.id;
    const swap = await SwapRequest.findById(id);
    if (!swap) return res.status(404).json({ message: 'Not found' });
    // Only owner can cancel
    if (!req.user || String(swap.createdBy) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    swap.status = 'cancelled';
    await swap.save();
    res.json({ message: 'Cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel' });
  }
};
