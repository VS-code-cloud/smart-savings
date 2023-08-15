const express = require('express');
import('node-fetch');
const jsdom = require("jsdom");
const app = express();
const PORT = 3000; // Port on which your proxy server will run
var juice = require('juice');

// Endpoint to handle proxy requests
app.get('/proxy', async (req, res) => {
  const url = req.query.url; // Get the URL to proxy from the query parameter
  console.log('url', url)
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    /*const response = await fetch(url);
    const content = await response.text();
    console.log('after parser, before declared')
    const { document } = new jsdom.JSDOM(content).window;
    console.log('after dom')
    let results = document.body.getElementsByClassName('.puis-v2x6wtqv5na4492f8vtnbmmr0ma .puis-expand-height, .puis-v2x6wtqv5na4492f8vtnbmmr0ma.puis.puis-expand-height')
    var final
    for (let i=0; i<results.length; i++) {
      final+=results[i].outerHTML
    }*/
    const response = await fetch(url)
    const content = await response.text()
    //const dom = new jsdom.JSDOM(content);
    var domString = juice(content);
    console.log('type of domstring', typeof domString)
    const dom = new jsdom.JSDOM(domString)

    let results = dom.window.document.getElementsByClassName('s-result-item s-asin');
    var stringRes;
    for (let i=0; i<results.length; i++) {
      stringRes+=results[i].outerHTML
    }
    res.send(dom.window.document.head.outerHTML+dom.window.document.body.outerHTML+results[0].outerHTML);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the content' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
