const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bodyParser = require('body-parser');




mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const userSchema = new Schema({username: String});

const logSchema = new Schema({
  userId: String,
  description: String,
  duration: Number,
  date: Date
})

let Log = mongoose.model('UserLog', logSchema)
let user = mongoose.model('User', userSchema) ;

app.post('/api/users', (req, res) => {
  const {username} = req.body
  user.create({username: username}, (err, result) => {
     if (err){
       return console.log(err);
     } 
      res.json({ _id: result._id, username: result.username })
  })
})



app.get('/api/users', (req, res) => {
  user.find({}, (err, results) => {
    return res.send(results);
  })
})


app.post('/api/users/:_id/exercises', (req, res) => {
  Log.create({userId: req.params._id, description: req.body.description, duration: req.body.duration, date: req.body.date ? (new Date(req.body.date).toDateString()) : (new Date().toDateString())
  })
})

app.get('/api/users/:_id/logs', async (req, res) => {
   const userData = await user.findById(req.params._id);
  console.log(userData);
   const logDatacount = await Log.find({userId: req.params._id}).count({});
   const logData = await Log.find({userId: req.params._id}, 'description duration date -_id');
  console.log(logData[0].date.toDateString());
  res.json({username: userData.username, count: logDatacount, _id: userData._id, log: logData});
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})