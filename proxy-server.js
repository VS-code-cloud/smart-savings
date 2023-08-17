const express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const PORT = 3000; // Port on which your proxy server will run
var cors = require('cors')

/*var corsOptions = {
  origin: 'https://www.amazon.com',
  referer: 'https://www.google.com/',
  User-Agent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
}*/

// Endpoint to handle proxy requests
app.get('/proxy', cors(/*corsOptions*/), async (req, res) => {
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
    console.log('w')
    const response = await axios.get(url, { headers: { 'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/115.0.1901.203" } })
    const html = response.data;

       const $ = cheerio.load(html);

       const items = [];

       $('div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20').each((_idx, el) => {
           const item = $(el)
           const title = item.find('span.a-size-base-plus.a-color-base.a-text-normal').text()
           const image = item.find('img.s-image').attr('src')
           const link = item.find('a.a-link-normal.a-text-normal').attr('href')
           const reviews = item.find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small').children('span').last().attr('aria-label')
           const stars = item.find('div.a-section.a-spacing-none.a-spacing-top-micro > div > span').attr('aria-label')
           const price = item.find('span.a-price > span.a-offscreen').text()
            let element = {
                title,
                image,
                link: `https://amazon.com${link}`,
                price: price.split('$')[1],
            }
            if (reviews) {
                element.reviews = reviews
            }
        
            if (stars) {
                element.stars = stars
            }
           items.push(element)
       });

    res.send(items);
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: 'An error occurred while fetching the content: ' + error });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running rn on port ${PORT}`);
});
