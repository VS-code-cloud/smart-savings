const express = require('express');
import('node-fetch');
const app = express();
const PORT = 3000; // Port on which your proxy server will run

// Endpoint to handle proxy requests
app.get('/proxy', async (req, res) => {
  const url = req.query.url; // Get the URL to proxy from the query parameter

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await fetch(url);
    const content = await response.text();
    res.send(content);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the content' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
