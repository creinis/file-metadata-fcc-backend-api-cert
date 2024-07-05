require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connection to DB successful'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Saída com erro se a conexão falhar
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, req.file.path);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error('File stat error:', err);
      return res.status(500).json({ error: 'Failed to retrieve file stats' });
    }

    const metadata = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      creationDate: stats.birthtime,
      lastModifiedDate: stats.mtime
    };

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('File unlink error:', err);
      }
    });

    res.json(metadata);
  });
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
