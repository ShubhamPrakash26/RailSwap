const path = require('path');
const fs = require('fs');

let FAQ_CACHE = null;
function loadFaq() {
  if (FAQ_CACHE) return FAQ_CACHE;
  const dataDir = path.join(__dirname, '..', 'data');
  const faqPath = path.join(dataDir, 'faq.json');
  let raw = '[]';
  try {
    raw = fs.readFileSync(faqPath, 'utf8');
  } catch (e) {
    console.warn('FAQ file not found', faqPath);
  }
  const arr = JSON.parse(raw || '[]');
  // normalize into { id, question, answer, keywords }
  const items = (arr || []).map(f => ({
    id: f.id,
    question: (f.question || '').trim(),
    answer: (f.answer || '').trim(),
    keywords: (f.keywords || []).map(k => (k||'').toLowerCase())
  }));
  FAQ_CACHE = items;
  return FAQ_CACHE;
}

function scoreMatch(query, faq) {
  if (!query) return 0;
  const q = query.toLowerCase();

  // exact question match
  if (faq.question && faq.question.toLowerCase() === q) return 100;

  // keyword matches
  let score = 0;
  for (const kw of (faq.keywords || [])) {
    if (!kw) continue;
    if (q.includes(kw)) score += 30;
    if (kw.includes(q)) score += 10;
  }

  // partial match by words overlap
  const qWords = q.split(/\s+/).filter(Boolean);
  const fq = (faq.question || '').toLowerCase();
  let overlap = 0;
  for (const w of qWords) if (w && fq.includes(w)) overlap++;
  score += overlap * 5;

  // small boost for substring presence
  if (fq.includes(q)) score += 15;

  return score;
}

// POST /api/faq  { q: "question text" }
exports.ask = (req, res) => {
  const q = (req.body && req.body.q) ? String(req.body.q).trim() : (req.query.q ? String(req.query.q).trim() : '');
  if (!q) return res.status(400).json({ message: 'q is required' });

  try {
    const faqs = loadFaq();
    const scored = faqs.map(f => ({ f, score: scoreMatch(q, f) }));
    scored.sort((a,b) => b.score - a.score);

    const best = scored[0];
    if (best && best.score >= 30) {
      // return best match
      return res.json({ answer: best.f.answer, matchedQuestion: best.f.question, id: best.f.id });
    }

    // otherwise return top 3 suggestions
    const suggestions = scored.slice(0,3).map(s => ({ id: s.f.id, question: s.f.question, score: s.score }));
    return res.json({ answer: null, suggestions });
  } catch (err) {
    console.error('FAQ ask error', err);
    res.status(500).json({ message: 'FAQ lookup failed' });
  }
};
