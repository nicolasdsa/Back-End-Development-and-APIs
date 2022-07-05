var express = require('express');
var cors = require('cors');
require('dotenv').config()
const fileUpload = require('express-fileupload');


var app = express();

app.use(fileUpload());
app.use(cors()); 
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', (req, res) => {
    res.json({name: req.files.upfile.name, type: req.files.upfile.mimetype, size: req.files.upfile.size});
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
