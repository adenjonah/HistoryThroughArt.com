const DatabaseManager = require('./databaseManager');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());
const db = new DatabaseManager();
const fs = require('fs');
db.initializeDatabase();


app.get('/', (req, res) => {
  console.log("home");
});

app.get('/museum', (req, res) => {
  console.log("museum");

    fs.readFile('artworks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
        } else {

            res.json(JSON.parse(data));
        }
    });
});

app.get('/museum-images', (req, res) => {
  console.log("museum-images");

  db.fetchArtworkImages((err, rows) => {
    if(err) {
      res.status(500).send('Internal Server Error');
    }
    else {
      res.json(rows);
    }
  });

});

app.get('/exhibit', (req, res) => {
  const id = req.query.id;
  console.log(`exhibit, id: ${id}`);

  db.fetchExhibit(id, (err, rows) => {
    if(err) {
      res.status(500).send('Internal Server Error');
    }
    else {
      res.json(rows);
    }
  });

});

app.get('/exhibit-images', (req, res) => {
    const id = req.query.id;
    console.log(`exhibit-images, id: ${id}`);

    db.fetchSpecificArtworkImages(id, (err, rows) => {
      if(err) {
        res.status(500).send('Internal Server Error');
      }
      else {
        res.json(rows);
      }
    });

});

app.get('/exhibit-videos', (req, res) => {
  const id = req.query.id;
  console.log(`exhibit-videos, id: ${id}`);

  db.fetchVideos(id, (err, rows) => {
    if(err) {
      res.status(500).send('Internal Server Error');
    }
    else {
      res.json(rows);
    }
  });
});

app.get('/displayed-locations', (req, res) => {
    console.log("displayed-locations");

    db.fetchDisplayedLocations((err, rows) => {
        if(err) {
        res.status(500).send('Internal Server Error');
        }
        else {
        res.json(rows);
        }
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
