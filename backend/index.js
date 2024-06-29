const DatabaseManager = require('./databaseManager');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
const db = new DatabaseManager();
db.initializeDatabase();


app.get('/', (req, res) => {
  console.log("home");
});

app.get('/museum', (req, res) => {
  console.log("museum");
  db.fetchQueries((err, rows) => {
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
