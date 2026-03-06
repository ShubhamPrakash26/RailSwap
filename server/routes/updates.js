const express = require('express');
const router = express.Router();
const { addClient, removeClient } = require('../utils/sse');

// GET /api/updates/stream - Server Sent Events stream
router.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // send a comment to keep connection alive
  res.write(':ok\n\n');

  addClient(res);

  req.on('close', () => {
    removeClient(res);
  });
});

module.exports = router;
