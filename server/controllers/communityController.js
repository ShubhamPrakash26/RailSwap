const Issue = require('../models/Issue');

exports.createIssue = async (req, res) => {
  try {
    let { stationCode, trainNumber, category, location, description } = req.body;

    stationCode = stationCode ? String(stationCode).trim().toUpperCase() : undefined;
    trainNumber = trainNumber ? String(trainNumber).trim() : undefined;

    if (!stationCode && !trainNumber) {
      return res.status(400).json({ message: 'stationCode or trainNumber required' });
    }

    // Server-side validation
    if (!category || String(category).trim().length < 3) {
      return res.status(400).json({ message: 'category is required (min 3 chars)' });
    }
    if (!description || String(description).trim().length < 8) {
      return res.status(400).json({ message: 'description is required (min 8 chars)' });
    }

    const issue = new Issue({ stationCode, trainNumber, category: category.trim(), location, description: description.trim(), createdBy: req.user ? req.user._id : undefined });
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create issue' });
  }
};

exports.listIssues = async (req, res) => {
  try {
    const { station, train, status, page = 1, limit = 20 } = req.query;
    const q = {};
    if (station) q.stationCode = station.toUpperCase();
    if (train) q.trainNumber = train;
    if (status) q.status = status;

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Issue.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Issue.countDocuments(q)
    ]);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list issues' });
  }
};

exports.getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).lean();
    if (!issue) return res.status(404).json({ message: 'Not found' });
    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get issue' });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const updates = {};
    if (req.body.status) {
      const raw = String(req.body.status).trim();
      // Accept human labels or normalized values
      const map = {
        'resolved': 'resolved',
        'open': 'open',
        'under process': 'under_process',
        'under_process': 'under_process',
        'in_progress': 'under_process',
        'un resolved': 'unresolved',
        'unresolved': 'unresolved'
      };
      const key = raw.toLowerCase();
      const s = map[key];
      if (!s) return res.status(400).json({ message: 'invalid status' });
      updates.status = s;
    }
    if (req.body.resolution) {
      if (String(req.body.resolution).trim().length < 3) return res.status(400).json({ message: 'resolution too short' });
      updates.resolution = String(req.body.resolution).trim();
    }
    if (updates.status === 'resolved') {
      updates.resolvedAt = new Date();
      if (req.user) updates.resolvedBy = req.user._id;
    } else {
      // clear resolved metadata when status is not resolved
      updates.resolvedAt = null;
      updates.resolvedBy = null;
    }

    const issue = await Issue.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).lean();
    if (!issue) return res.status(404).json({ message: 'Not found' });
    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update issue' });
  }
};
