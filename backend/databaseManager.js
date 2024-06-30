const sqlite3 = require('sqlite3').verbose();

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

            //this.db.run(`DROP TABLE IF EXISTS Artworks`);

            this.db.run(`
            CREATE TABLE IF NOT EXISTS Artworks (
                id INTEGER,
                name TEXT, 
                shortName TEXT, 
                unit INTEGER,
                PRIMARY KEY (id, name)
            )`);


            this.db.run(`
            CREATE TABLE IF NOT EXISTS Identifiers (
                ID INTEGER PRIMARY KEY,
                Location TEXT
            )`);

            this.db.run(`
            CREATE TABLE IF NOT EXISTS Artists (
                ID INTEGER PRIMARY KEY,
                ArtistName TEXT,
                ShortenedName TEXT,
                Society TEXT
            )`);

            this.db.run(`
            CREATE TABLE IF NOT EXISTS Medium (
                ID INTEGER PRIMARY KEY,
                Material TEXT
            )`);

            this.db.run(`
            CREATE TABLE IF NOT EXISTS Images (
                ID INTEGER PRIMARY KEY,
                ImageName TEXT
            )`);

            this.db.run(`
            CREATE TABLE IF NOT EXISTS Videos (
                ID INTEGER PRIMARY KEY,
                VideoLink TEXT,
                VideoTranscript TEXT
            )`);


        });

        this.db.serialize(() => {

            //This puts Mona Lisa into the database. Only for Artworks table
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, shortName, unit) Values (1, 'Mona Lisa', 'Mona', 1)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, shortName, unit) Values (2, 'The Last Supper', 'Supper', 1)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, shortName, unit) Values (3, 'The Starry Night', 'Night', 2)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, shortName, unit) Values (4, 'The Persistence of Memory', 'Memory', 2)`);

        });
    } //end of initializeDatabase


    fetchQueries(callback) {
        this.db.all(`SELECT * FROM Artworks`, callback);

    } //emd of fetchQueries

} //end of DatabaseManager

module.exports = DatabaseManager;