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

});

app.get('/museum', (req, res) => {

  db.fetchQueries((err, rows) => {
    if(err) {
      res.status(500).send('Internal Server Error');
    }
    else {
      res.json(rows);
    }
  });
  console.log("Haiii");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
