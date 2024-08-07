const sqlite3 = require('sqlite3').verbose();
const videos = require('./initVideos.js');
const images = require('./initImages.js');
const artworks = require('./initArtworks.js');
const displayed = require('./initDisplayed.js');

class DatabaseManager {

    constructor() {
        this.db = new sqlite3.Database('APArtHistory.db', (err) => {
            if (err) {
                console.error('Error connecting to database:', err.message);
            } else {
                console.log('Connected to the database.');
            }
        });
    }

    initializeDatabase() {

        this.db.serialize(() => {

            //We will want to delete this later
            this.db.run(`DROP TABLE IF EXISTS Artworks`);
            this.db.run(`DROP TABLE IF EXISTS Identifiers`);
            this.db.run(`DROP TABLE IF EXISTS Artists`);
            this.db.run(`DROP TABLE IF EXISTS Images`);
            this.db.run(`DROP TABLE IF EXISTS Videos`);


            this.db.run(`
            CREATE TABLE IF NOT EXISTS Artworks (
                id INTEGER,
                name TEXT, 
                location TEXT,
                artist_culture TEXT,
                date TEXT,
                materials TEXT,
                unit INTEGER,
                PRIMARY KEY (id, name)
            )`);


            this.db.run(`
            CREATE TABLE IF NOT EXISTS Displayed (
                id INTEGER, 
                museum TEXT,
                displayedLocation TEXT,
                FOREIGN KEY (id) REFERENCES Artworks(id)
            )`);

            this.db.run(`
            CREATE TABLE IF NOT EXISTS Images (
                id INTEGER, 
                image TEXT,
                FOREIGN KEY (id) REFERENCES Artworks(id)
            )`);

            this.db.run(`
            CREATE TABLE IF NOT EXISTS Videos (
                id INTEGER,
                videoLink TEXT,
                transcript TEXT,
                FOREIGN KEY (id) REFERENCES Artworks(id)
            )`);

        });

        //This puts all the artworks into the database.
        //Created through a python script.
        artworks.initializeArtworks(this.db);
        console.log("Finished Initializing Artworks");

        displayed.initializeDisplayed(this.db);
        console.log("Finished Initializing Displayed");

        images.initializeImages(this.db);
        console.log("Finished Initializing Images");

        videos.initializeVideos(this.db);
        console.log("Finished Initializing Videos");


    } //end of initializeDatabase


    fetchArtworks(callback) {
        this.db.all(`SELECT id, name, location, artist_culture, date, materials, unit, transcript FROM Artworks LEFT JOIN Videos using (id)`, callback);

    } //emd of fetchQueries

    fetchArtworkImages(callback) {
        this.db.all(`SELECT * FROM Images`, callback);
    }

    fetchExhibit(id, callback) {
        this.db.all(`SELECT * FROM Artworks JOIN Displayed USING (id) WHERE id = ?`, id, callback);
    }

    fetchSpecificArtworkImages(id, callback) {
        this.db.all(`SELECT * FROM Images WHERE id = ?`, id, callback);
    }

    fetchVideos(id, callback) {
        this.db.all(`SELECT * FROM Videos WHERE id = ?`, id, callback);
    }

    fetchDisplayedLocations(callback) {
        this.db.all(`SELECT * FROM Displayed JOIN Artworks USING (id) JOIN Images USING (id) GROUP BY id`, callback);
    }

} //end of DatabaseManager

module.exports = DatabaseManager;