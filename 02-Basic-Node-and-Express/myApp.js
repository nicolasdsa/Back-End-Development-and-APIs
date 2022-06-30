let express = require('express');
let app = express();
const bodyParser = require('body-parser');

console.log('Hello World');

/* Exercise 2: app.get('/', function(req, res) {
  res.send('Hello Express');
});*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req,res,next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  const Path = __dirname + '/views/index.html'
  res.sendFile(Path);
});

/* Exercise 5: app.get('/json', function(req,res) {
  res.json({"message": "Hello json"});
});*/


app.get('/now', function(req, res, next){
  req.time = new Date().toString();
  next();
},
  function(req, res) {
    res.send({"time": req.time});
  }       
);

app.get('/json', function(req,res) {
  const hello = 'Hello json';
  let response;
  if(process.env.MESSAGE_STYLE === 'uppercase'){
    response = hello.toUpperCase();
  } 
  else{
    response = hello;
  }
  const dataResponse = {
    "message": response
  }
  res.json(dataResponse);
});

app.get('/:word/echo', function (req, res){
  res.json({echo: req.params.word});
})


app.get('/name', function (req, res){
  res.json({name: `${req.query.first} ${req.query.last}`});
})


app.post('/name', function (req, res){
  res.json({name: `${req.body.first} ${req.body.last}`});
})

 module.exports = app;
