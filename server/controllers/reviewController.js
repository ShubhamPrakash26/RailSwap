const Review = require('../models/Review');
const Journey = require('../models/Journey');

exports.createReview = async (req, res) => {
  try {
    const { journeyId, rating, text, keywords } = req.body;

    const journey = await Journey.findById(journeyId);
    if (!journey) return res.status(404).json({ message: 'Journey not found' });

    const review = new Review({
      journey: journeyId,
      author: req.user._id,
      rating,
      text,
      keywords: keywords || []
    });

    await review.save();
    res.json({ review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listReviews = async (req, res) => {
  try {
    const { journeyId } = req.query;
    const filter = {};
    if (journeyId) filter.journey = journeyId;

    const reviews = await Review.find(filter).populate('author', 'username email').sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
