const Issue = require('../models/Issue');
const Review = require('../models/Review');
const mongoose = require('mongoose');

exports.getIssues = async (req, res) => {
  try {
    // Allow admin to filter issues by station, train, status, category
    const { station, train, status, category, page = 1, limit = 50 } = req.query;
    const q = {};
    if (station) q.stationCode = String(station).toUpperCase();
    if (train) q.trainNumber = String(train).trim();
    if (status) q.status = String(status).trim();
    if (category) q.category = String(category).trim();

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const [issues, total] = await Promise.all([
      Issue.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Issue.countDocuments(q)
    ]);

    const userIds = issues.map(i => i.createdBy).filter(Boolean);
    let usersMap = {};
    if (userIds.length) {
      const users = await require('../models/User').find({ _id: { $in: userIds } }).select('username email').lean();
      usersMap = users.reduce((acc, u) => { acc[u._id] = u; return acc; }, {});
    }

    const populated = issues.map(i => ({
      ...i,
      createdBy: i.createdBy ? (usersMap[i.createdBy] || null) : null
    }));

    res.json({ items: populated, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, resolution } = req.body;
    if (!status) return res.status(400).json({ message: 'status required' });

    const allowed = ['open', 'resolved', 'under_process', 'unresolved'];
    const normalized = String(status).trim().toLowerCase();
    const map = {
      'resolved': 'resolved',
      'under process': 'under_process',
      'under_process': 'under_process',
      'in_progress': 'under_process',
      'un resolved': 'unresolved',
      'unresolved': 'unresolved',
      'open': 'open'
    };
    const s = map[normalized];
    if (!s || !allowed.includes(s)) return res.status(400).json({ message: 'invalid status' });

    const updates = { status: s };
    if (s === 'resolved') {
      updates.resolvedAt = new Date();
      updates.resolvedBy = req.user ? req.user._id : undefined;
      if (resolution) updates.resolution = String(resolution).trim();
    } else {
      updates.resolvedAt = null;
      updates.resolvedBy = null;
      if (resolution) updates.resolution = String(resolution).trim();
    }

    const issue = await require('../models/Issue').findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    if (!issue) return res.status(404).json({ message: 'Not found' });
    res.json({ issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('author', 'username email').populate('journey');
    res.json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewKeywordStats = async (req, res) => {
  try {
    // unwind keywords and group
    const pipeline = [
      { $unwind: '$keywords' },
      { $group: { _id: '$keywords', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ];

    const stats = await Review.aggregate(pipeline);
    res.json({ stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
