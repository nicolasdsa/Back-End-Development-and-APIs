require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
let isUrl = require('is-url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let count = 0;
const urls = {};

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body


  if(!isUrl(url)){
    res.send({error: 'Invalid URL'});
    return
  }

  count++;
  urls[count] = req.body.url;
  
  res.send({original_url: req.body.url, short_url: count});
  
});

app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params
  const url = urls[id];
  res.redirect(url);
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
