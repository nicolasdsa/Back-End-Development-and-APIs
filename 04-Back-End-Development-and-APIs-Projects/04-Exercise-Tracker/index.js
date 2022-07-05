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


app.post('/api/users/:_id/exercises', async (req, res) => {
  const createLog = await Log.create({userId: req.params._id, description: req.body.description, duration: req.body.duration, date: req.body.date ? (new Date(req.body.date).toDateString()) : (new Date().toDateString())
  })
  const userData = await user.findById(req.params._id);
  res.json({username: userData.username, description: createLog.description, duration: createLog.duration, date: createLog.date.toDateString(), _id: req.params._id});
})

app.get('/api/users/:_id/logs', async (req, res) => {
   const limit = parseInt(req.query.limit);
   const to = req.query.to ? new Date(req.query.to).getTime() : 9999999999999;
   const from = req.query.from ? new Date(req.query.from).getTime() : 0;
  
   const userData = await user.findById(req.params._id);
   const logDatacount = await Log.find({userId: req.params._id}).count({});
   const logData = await Log.find({userId: req.params._id}, 'description duration date -_id');
  
    const logDataFilter = logData.filter( item => {
      return item.date.getTime() >= from && item.date.getTime() <= to
    })

  console.log(logDataFilter);
  
   const logDataFormat = logDataFilter.map(item => {
     return {
       description: item.description,
       duration: item.duration,
       date: item.date.toDateString()
     }
   })

   const logDataLimit = limit ? logDataFormat.slice(0, 
limit) : logDataFormat;
  
   res.json({username: userData.username, count: logDatacount, _id: userData._id, log: logDataLimit});
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
