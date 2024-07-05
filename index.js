var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer')
const upload = multer()


var app = express();

app.use(cors());
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/fileanalyse", upload.single('upfile'), (req, res) => {

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
  
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});


module.exports = app;
