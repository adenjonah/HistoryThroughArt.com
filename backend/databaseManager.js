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
                artist_culture TEXT,
                museum TEXT, 
                location TEXT,
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

        //This puts all the artworks into the database.
        //Created through a python script.
        this.db.serialize(() => {


            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (1, "Apollo 11 Stones", "Namibia", "State museum of Namibia", "Keetmanshoop, Namibia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (2, "Great Hall of the Bulls", "Paleolithic Europe", "Caves of Lascaux", "Montignac, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (3, "Camelid Sacrum in the Shape of a Canine", "Tequixqixquiac", "National Museum of Anthropology", "Mexico City, Mexico", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (4, "Running Horned Woman", "None", "Algerian section of the Sahara Desert", "Algeria", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (5, "The Beaker with Ibex Motif", "Susa, Iran", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (6, "Anthropomorphic Stele", "None", "National Museum", "Riyad, Saudi Arabia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (7, "Jade Cong", "None", "MET ", "New York City, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (8, "Stonehenge", "None", "None", "England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (9, "Ambum Stone", "Papua New Guinea", "National Gallery of Australia", "Canberra, Australia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (10, "Tlatilco Female Figure", "Central Mexico", "Princeton Universtiy of Art Museum", "Princeton, New Jersey", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (11, "Terra Cotta Fragment", "Lapita", "Dept. of Anthropology Univ. of Auckland", "Auckland, New Zealand", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (12, "White Temple and its ziggurat", "Sumerian", "Iraq", "Warka, Iraq", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (13, "Palette of King Narmer", "Predynastic Egypt", "Egptian Museum", "Cairo, Egypt", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (14, "Statues of Votive Figures from the Square Temple at Eshnuna", "Sumerian", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (15, "Seated Scribe", "Oild Kingdom", "Louvre", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (16, "Standard of Ur", "Sumerian", "British Museum", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (17, "Great Pyramids and Great Sphinx", "Old Kingdom", "None", "Cairo, Egypt", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (18, "King Menkaura and queen", "Old Kingdom", "Museum of Fine Arts", "Boston, Massachusettes", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (19, "Code of Hammurabi", "Babylon Susian", "Louvre", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (20, "Temple of Amun-Re and Hypostyle Hall", "New Kingdom", "None", "Egypt", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (21, "Mortuary Temple of Hatshepsut", "New Kingdom", "None", "Egypt", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (22, "Akhenaten, Nefertuiti, and 3 daughters", "New Kingdom Armana", "Neues Museum, Staatliche Museen zu Berlin", "Berlin, Germany", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (23, "Tutankhamun's tomb, innermost coffin", "New Kingdom", "the Egyptian Museum", "Cairo, Egypt", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (24, "Last Judgement of Hunefer, from his tomb (page from the Book of the Dead)", "New Kingdom", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (25, "Lamassu from the citadel of Sargon II", "Neo-Assyrian", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (26, "Athenian agora", "Archaic through Hellenistic", "None", "Athens, Greece", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (27, "Anavysos Kouros", "Archaic", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (28, "Peplos Kore from the Acropolis", "Archaic", "Acropolis Museum", "Athens, Greece", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (29, "Sarcophagus of the Spouses", "Etruscan", "National Etruscan Museum of Villa Giulia", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (30, "Audience Hall of Darius and Xerxes", "Persian", "Iran", "Shiraz, Iran", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (31, "Temple of Minerva and sculpture of Apollo", "Etruscan", "National Etruscan Museum", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (32, "Tomb of the Triclinium", "Etruscan", "Tarquinia national museum", "Tarquinia, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (33, "Niobides Krater", "Classic", "Louvre", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (34, "Doryphoros", "Polykleitos", "Museo Archeologico Nazionale di Napoli", "Naples, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (35, "Acropolis", "Classic", "None", "Athens, Greece", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (36, "Grave Stele of Hegeso", "Kallimachos", "National Archaeological Museum", "Athens, Greece", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (37, "Winged Victory of Samothrace", "Hellenistic", "Louvre", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (38, "Great Altar of Zeus and Athena at Pergamon", "Hellenistic", "Pergamon Museum", "Berlin, Germany", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (39, "House of Vetti", "Imperial Roman", "None", "Pompeii, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (40, "Alexander Mosaic from the House of Faun", "Republican Rome", "Museo Archeologico Nazionale di Napoli", "Naples, NItaly", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (41, "Seated Boxer", "Hellenistic", "Palazzo Massimo alle Terme", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (42, "Head of a Roman Patrician", "Republican Rome", "Palazzo Torionia", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (43, "Augustus of Prima Porta", "Imperial Roman", "Braccio Nuovo Vatican Museums", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (44, "Colosseum", "Imperial Roman", "None", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (45, "Forum of Trajan", "Apollodorus of Damascus", "None", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (46, "Pantheon", "Imperial Roman", "None", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (47, "Ludovisi Battle Sarcophagus", "Late Imperial Roman", "Palazzo Altemps in National Museum ", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (48, "Catacomb of Priscilla", "Late Antique Rome", "None", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (49, "Santa Sabina", "Late Antique Rome", "None", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (50, "Rebecca and Eliezer at the Well and Jacob Wrestling the Angel, from the Vienna Genesis", "Byzantine", "Osterreichische Nationalbibliothek", "Vienna, Austria", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (51, "San Vitale", "Byzantine", "None", "Ravenna, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (52, "Hagia sophia", "Byzantine", "None", "Istanbul, Turkey", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (53, "Merovingian looped fibulae", "Byzantine", "Chateau de Saint-Germain-en-Laye", "Saint-Germain-en-Laye, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (54, "Theootokos", "Byzantine", "St. Catherine's Monastery", "Sinai, Egypt", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (55, "Lindisfarne Gospels", "None", "British Library in London", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (56, "Great Mosque of Cordoba", "None", "None", "Cordoba, Spain", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (57, "Pyxis of al-Mughira", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (58, "Church of Sainte-Foy", "None", "None", "Conques, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (59, "Bayeux Tapestry", "None", "None", "Bayeux, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (60, "Chartres Cathedral", "None", "None", "Chartres, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (61, "Dedication Page with Blanche of Castile", "None", "Morgan Library and Museum", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (62, "Rottgen Pieta", "None", "Rheinisches Landesmuseum", "Bonn, Germany", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (63, "Arena Scrovegni Chapel", "None", "None", "Padua, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (64, "Golden Haggadah", "None", "British Library in London", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (65, "Alhambra", "None", "None", "Granada, Spain", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (66, "Annunciation Triptych (Merode Altarpiece)", "Robert Campin", "The Cloister, New York City", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (67, "Pazzi Chapel", "Filippo Brunelleschi", "None", "Florence, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (68, "The Arnolfini Portrait", "Jan van Eyck", "National Gallery", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (69, "David", "Donetello", "Bargello National Museum", "Florence, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (70, "Palazzo Rucellai", "None", "None", "Florence, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (71, "Madonna and Child with Two Angels", "Fillipo Lippi", "Uffizi Galleries' Museum", "Florence, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (72, "Birth of Venus", "Boticelli", "Uffizi Galleries' Museum", "Florence, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (73, "Last Supper", "Lenoardo da Vinci", "Dominican convent of Santa maria delle Grazie", "Milan, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (74, "Adam and Eve", "Durer", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (75, "Sistine Chapel", "Michelangelo", "Vatican Museums", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (76, "School of Athens", "Raphael", "Vatican Museums", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (77, "Isenheim altarpiece", "Matthias Grunewald", "Unterlinden Museum ", "Colmar, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (78, "Entombment of Christ", "Pontormo", "Santa Felicita", "Florence, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (79, "Allegory of Law and Grace", "Lucas Cranach the Elder", "Schlossmuseum", "Gotha, Germany", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (80, "Venus of Urbino", "Titian", "Uffizi Galleries' Museum", "Florence, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (81, "Frontispiece of the Codex Mendoza", "None", "Bodleian Libraries, University of Oxford", "Oxford, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (82, "Il Gesu", "None", "None", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (83, "Hunters in the Snow", "Pieter Bruegel", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (84, "Mosque of Selim II", "None", "None", "Edirne, Turkey", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (85, "Calling of Saint Matthew ", "Caravaggio", "San Luigi dei Francesi, Rome", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (86, "Henry IV Receives the Portrait of Marie de' medici", "Paul Rubens", "Louvre Museum", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (87, "Self-Portrait with Saskia", "Rembrandt", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (88, "San Carlo alle Quattro Fontane", "None", "None", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (89, "Ecstacy of Saint Teresa", "Gian Lorenzo Bernini", "Santa Maria della Vittoria", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (90, "Angel with Arquebus", "La Pas School", "Museo Nacional de Arte", "La Paz, Bolivia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (91, "Las Meninas", "Diego Velazquez", "Museo Nacional de Prado", "Madrid, Spain", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (92, "Woman Holding a Balance", "Johannes Vermeer", "National Gallery", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (93, "The Palace at Versailles", "None", "None", "Versailles, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (94, "Screen with the Siege of Belgrade and Hunnting Scene", "None", "Brooklyn Museum, NYC", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (95, "The Virgin of Guadalupe", "Nicolas Enriquez", "Bascillica at Tepeyac", "Mexico City, Mexico", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (96, "Fruit and Insects", "Rachel Ruysch", "Uffizi Galleries' Museum", "Florence, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (97, "Spaniard and Indian Produce a Mestizo", "Juan Rodriguez Juarez", "Breamore House", "Hampshire, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (98, "The Tete a tete", "William Hogarth", "National Portrait Gallery", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (99, "Portrait of Sor Juana Ines de la Cruz", "Miguel Cabrera", "Philadelphia Museum of Art", "Philadelphia, Pennsylvania", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (100, "A Philosopher Giving a Lecture on the Orrery", "Joseph Wright of Derby", "Derby Museum and Art Gallery", "Derby, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (101, "The Swing", "Fragonard", "Wallace Collection", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (102, "Monticello", "Thomas Jefferson", "None", "Charlottesville, Virginia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (103, "The Oath of the Horatii", "Jacques-Louis David", "Louvre", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (104, "Self -Portrait (Le Brun)", "LeBrun", "Uffizi Galleries' Museum", "Florence, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (105, "And There is Nothing to be Done", "Francisco Goya", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (106, "La Grande Odalisque", "Ingres", "Louvre", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (107, "Liberty Leading the People", "Eugene Delacroix", "Louvre", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (108, "George Washington", "Houdon", "State capitol building", "Richmond, Virginia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (109, "The Oxbow", "Thomas Cole", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (110, "Still Life in Studio", "Daguerre", "None", "None", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (111, "Slave Ship", "JMW Turner", "Museum of Fine Arts", "Boston, Massachusetts", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (112, "Palace of Westminster", "Barry and Pugin", "None", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (113, "The Stone Breakers", "Courbet", "None", "None", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (114, "Nadar Raising Photography to the Height of Art", "Honore Daumier", "Brooklyn Museum, NYC", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (115, "Olympia", "Edouard Manet", "Musee D'Orsay", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (116, "The Saint-Lazare Station", "Claude Monet", "Musee D'Orsay", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (117, "The Horse in Motion", "Eadweard Muybridge", "Library of Congress", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (118, "The Valley of Mexico from the Hillside of Santa Isabel", "Jose Maria Velasco", "Mueseo National de Arte", "Mexico City, Mexico", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (119, "Burghers of Calais", "Auguste Rodin", "Brooklyn Museum, NYC", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (120, "The Starry Night", "Vincent Van Gogh", "MOMA", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (121, "The Coiffure", "Mary Cassatt", "National Gallery", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (122, "The Scream", "Edvard Munch", "National Gallery of Norway", "Oslo, Norway", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (123, "Where Do We Come From? What Are We? ", "Paul Gaughin", "Museum of Fine Arts", "Boston, Massachusetts", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (124, "Carson, Pirie, Scott and Company Building", "Louis Sullivan", "None", "Chicago, Illinois", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (125, "Mont Sainte-Victoire", "Paul Cezanne", "Philadelphia Museum of Art", "Philadelphia, Pennsylvania", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (126, "Les Demoiselles d'Avignon", "Pablo Picasso", "MOMA", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (127, "The Steerage", "Alfred Stieglitz", "Los Angeles County Museum of Art", "Los Angeles, California", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (128, "The Kiss by Klimt", "Gustav Klimt", "Osterreichische Galerie Belvedere", "Versailles, Austria", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (129, "The Kiss by Brancusi", "Constantin Brancusi", "Philadelphia Museum of Art", "Philadelphia, Pennsylvania", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (130, "The Portuguese", "Georges Braque", "Kunstmuseum Basel ", "Basel, Switzerland", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (131, "Goldfish", "Henri matissse", "Pushkin Museum of Art", "Moscow, Russia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (132, "Improvisation 28 (second version)", "Vassily Kandinsky", "Guggenheim Museum", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (133, "Self-Portrait as a Soldier", "Ernst Kirchner", "Allen Memorial Art Museum, Oberlin College", "Oberlin, Ohio", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (134, "Memorial Sheet for Karl Liebknecht", "Kathe Kollwitz", "Art Institute of Chicago", "Chicago, Illinois", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (135, "Villa Savoye", "Le Corbusier", "None", "Poissy, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (136, "Composition with Red, Blue and Yellow", "Piet Mondrian", "Kunsthaus", "Zurich, Switzerland", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (137, "Illustration from the Results of the First Five Year Plan", "Varvara Stepanova", "State Museum of Contemporary Russian History", "Moscow, Russia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (138, "Object (Le Dejeuner en fourrure)", "Meret Oppenheim", "MOMA", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (139, "Fallingwater", "Frank Lloyd Wright", "MET", "Mill Run, Pennsylvania", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (140, "The Two Fridas", "Frida Kahlo", "Museo de Arte Moderno", "Mexico City, Mexico", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (141, "The Migration of the Negro, Panel no. 49", "Jacob Lawrence", "Phillips Collection", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (142, "The Jungle", "Wifredo Lam", "MOMA", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (143, "Dream of a Sunday Aftenoon in the Alameda Park", "Diego Rivera", "Museo Mural Diego Rivera", "Mexico City, Mexico", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (144, "Fountain", "Marcel Duchamp", "San Francisco Museum of Modern Art", "San Francisco, California", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (145, "Woman I", "Willem de Kooning", "MOMA", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (146, "Seagram Building", "Ludwig Mies van der Rohe", "New York City", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (147, "Marilyn Diptych", "Andy Warhol", "Tate Museum", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (148, "Narcissus Garden", "Yayoi Kusama", "The Board", "Los Angeles, California", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (149, "The Bay", "Helen Frankenthaler", "Detroit Institute of Arts", "Detroit, Michigan", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (150, "Lipstick Ascending on Caterpillar Tracks", "Claes Oldenburg", "Yale University", "New Haven, Connecticut", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (151, "Spiral jetty", "Robert Smithson", "None", "Great Salt Lake, Utah", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (152, "House in new Castle County", "Robert Venturi", "None", "Castle County, Delaware", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (153, "Chavin de Huantar", "None", "None", "Peru", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (154, "Mesa Verde cliff dwellings", "None", "None", "Colorado", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (155, "Yaxchilan", "None", "None", "Chiapas, Mexico", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (156, "Great Serpent Mound", "None", "None", "Adams County, Ohio", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (157, "Templo Mayor", "None", "None", "Mexico City, Mexico", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (158, "Ruler's feather headdress", "None", "Weltmuseum Wien", "Vienna, Austria", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (159, "City of Cusco", "None", "None", "Cusco, Peru", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (160, "miaize cobs", "None", "Denver Art Museum", "Denver, Colorado", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (161, "City of Machu Picchu", "None", "None", "Peru", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (162, "All-T'oqapu Tunic", "None", "Dumbarton Oaks", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (163, "Bandolier bag", "None", "National Museum of the American Indian", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (164, "Transformation Mask", "None", "Brooklyn Museum, NYC", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (165, "Painted elk hide", "Cotsiogo (Cadzi Cody)", "Indian Arts Research Center, School for Advanced Research", "Santa Fe, New Mexico", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (166, "Black-on-Black ceramic vessel", "Maria Martinez", "National Museum of Women in the Arts", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (167, "Conical tower and circular wall of Great Zimbabwe", "None", "None", "Zimbabwe", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (168, "Great Mosque of Djenne", "None", "None", "Djenne, Mali", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (169, "Wall Plaque from Oba's Palace", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (170, "Golden Stool", "None", "None", "Ghana", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (171, "Ndop (Portrait Figure)", "None", "Brooklyn Museum, NYC", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (172, "Nkisi N'Kondi", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (173, "Female Pwo Mask", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (174, "Portrait mask (Mblo Mask)", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (175, "Bundu mask", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (176, "Ikenga", "None", "University of Pennsylvania Museum of Archaeology", "Philidelphia, Pennsylvania", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (177, "Lukasa memory board", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (178, "Aka elephant mask", "None", "Seattle Art Museum", "Seattle, Washington", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (179, "Reliquary guardian figure", "None", "Brooklyn Museum, NYC", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (180, "Veranda Post of enthroned king and senior wife", "Olowe of ise", "Chicago Art Institute", "Chicago, Illinois", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (181, "Petra, Jordan", "None", "None", "Petra, Jordan", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (182, "Buddha ", "None", "None", "Destroyed", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (183, "The Kaaba", "None", "None", "Mecca, Saudi Arabia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (184, "Jowo Rinpoche", "None", "Jokhang Temple", "Lhasa, Tibet", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (185, "Dome of the Rock", "None", "None", "Jerusalem, Israel", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (186, "Great Mosque (Isfahan)", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (187, "Folio from a Qur'an", "None", "Morgan Library and Museum", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (188, "Basin", "Muhammad ibn al-Zain", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (189, "Bahram Gur Fights the Karg, folio from the Great Il-Khanid Shahnama", "None", "Harvard Art Museums/ Arthur M. Sackler Museum", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (190, "The Court of Gayumars, folio from Shah Tahmasp's Shahnama", "Sultan Muhammad ", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (191, "The Ardabil carpet", "None", "Victoria and Albert Museum", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (192, "Great Stupa at Sanchi", "None", "None", "Sanchi, India", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (193, "Terra cotta warriors from mausoleum of the first Qin emperor of China", "None", "None", "China", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (194, "Funeral banner of Lady Dai", "None", "Hunan Provincial Museum", "China", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (195, "Longmen caves", "None", "None", "China", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (196, "Gold and jade crown", "None", "Gyeongju National Museum", "Korea", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (197, "Todai-ji", "None", "None", "Nara, Japan", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (198, "Borobudur Temple", "None", "None", "Indonesia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (199, "Angkor, the temple of Angkor Wat and the city of Angkor Thom", "None", "None", "Cambodia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (200, "Lakshmana Temple", "None", "None", "India", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (201, "Travelers among Mountains and Streams", "Fan Kuan", "National Palace Museum", "Beijing, China", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (202, "Shiva Nataraja (dancing)", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (203, "Night Attack on the Sanjo Palace", "None", "Museum of Fine Arts", "Boston, Massachusetts", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (204, "The David Vases", "None", "British Museum", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (205, "Portrait of Sin Sukju", "None", "South Korea", "S. Korea", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (206, "Forbidden City", "None", "None", "Beijing, China", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (207, "Ryoan-ji", "None", "None", "Kyoto, Japan", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (208, "Jahangir Preferring a Sufi Shaikh to Kings", "Bichitr", "Freer Gallery of Art", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (209, "Taj Mahal", "None", "None", "Dharmapuri, India", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (210, "White and Red Plum Blossoms", "None", "MOA Museum of Art", "Atami, Japan", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (211, "The Great Wave", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (212, "Chairman Mao en Route to Anyuan", "None", "My classroom!", "Spokane, Washington", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (213, "Nan Madol", "None", "Nanwei", "Pohnpei Island, Federated States of Micronesia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (214, "Moai on platform", "None", "Easter Island known as Rapa Nui", "Rapa Nui, Pacific", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (215, "Ahu 'ula (feather cape)", "None", "Natural History Museum", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (216, "Staff god", "None", "British Museum", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (217, "Female deity", "None", "Muse du Quai Branly-Jacques Chirac", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (218, "Buk (mask)", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (219, "Hiapo (tapa)", "None", "Aukland War Memorial Museum", "Aukland, New Zealand", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (220, "Tamati Waka Nene", "Gottfried Lindauer", "Aukland Art Gallery", "Aukland, New Zealand", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (221, "Navigation Chart", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (222, "Malagan display and mask", "None", "The Penn Museum", "Philadelphia, Pennsylvania", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (223, "Tapa cloth", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (224, "The Gates", "Christo and Jeanne-Claude", "None", "None", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (225, "Vietnam Veterans Memorial", "Maya Lin", "Washington Mall", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (226, "Horn Players", "Jean-Michel Basquiat", "The Board", "Los Angeles, California", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (227, "Summer Trees", "Song Su-nam", "British Museum", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (228, "Androgyne III", "Magdalena Abakanowicz", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (229, "A Book from the Sky", "Xu Bing", "None", "None", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (230, "Pink Panther", "jeff Koons", "MOMA", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (231, "Untitled (#228) Cindy Sherman", "Cindy Sherman", "MOMA", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (232, "Dancing at the Louvre", "Faith Ringgold", "Gund Gallery, Kenyon College", "Gambier, Ohio", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (233, "Trade", "Jaune Quick-to-se-Smith", "Chrysler Museum of Art", "Norfolk, Virginia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (234, "Earth's Creation", "Emily kngwarreye", "National Museum", "Canberra, Australia", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (235, "Rebellious Silence", "Shirin Neshat", "Barbara Gladstone Gallery", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (236, "No Crying in the Barbershop", "pepon Osorio", "None", "Puerto Rico", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (237, "Pisupo Lua Afe (Corned Beef 2000)", "Michel Tuffery", "Museum of New Zealand", "Aukland, New Zealand", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (238, "Electronic Superhighway", "Nam June Paik", "Smithsonian American Art Museum", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (239, "The Crossing", "Bill Viola", "Guggenheim Museum", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (240, "Guggenheim Museum Bilbao", "Frank Gehry", "None", "Bilbao, Spain", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (241, "Pure Land", "Mariko Mori", "Los Angeles County Museum of Art", "Los Angeles, California", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (242, "Lying with the Wolf", "Kiki Smith", "Centre Pompidou", "Paris, France", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (243, "Darkytown Rebellion", "Kara Walker", "Musée d’Art Moderne Grand-Duc Jean", "Luxembourg City, Luxembourg", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (244, "The Swing (after Fragonard)", "yinka Shonibare", "Tate Museum", "London, England", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (245, "El Anatsui, but not Old Man's Cloth", "El Anatsui", "MET One in sculpture, one in African Art", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (246, "Stadia II", "Julie Mehretu", "Carnegie Museum of Art", "Pittsburgh, Pennsylvania", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (247, "Preying Mantra", "Wangechi Mutu", "Brooklyn Museum", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (248, "Shibboleth", "Doris Salcedo", "Tate Museum", "London", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (249, "MAXXI National Museum of XXI Century Arts", "Zaha Hadid", "None", "Rome, Italy", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (250, "Sunflower Seeds", "Ai Weiwei", "None", "None", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (251, "Anthropomorphic Stele", "None", "Freer/Sackler", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (252, "Jade Cong", "None", "Freer/Sackler", "Washington DC", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (253, "Tlatilco Female Figure", "None", "Los Angeles County Museum of Art", "Los Angeles, California", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (254, "Stonehenge", "None", "Maryhill Museum", "Maryhill, Washington State", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (255, "Statue of Hatshepsut", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (256, "Tlatilco Female Figure", "None", "MET", "NYC, New York", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (257, "Statues of Votive Figures from the Square Temple at Eshnuna", "None", "Oriental Institute at University of Chicago", "Chicago, Illinois", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (258, "Nkisi N'Kondi", "None", "Seattle Art Museum", "Seattle, Washington", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (259, "Ikenga (similar pieces)", "None", "Seattle Art Museum", "Seattle, Washington", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (260, "Old Man's Cloth (a version of it)", "None", "Seattle Art Museum", "Seattle, Washington", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (261, "Old Man's Cloth (a version of it)", "None", "The Board", "Los Angeles, California", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (262, "Stadia II (something like it)", "None", "The Board", "Los Angeles, California", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (263, "Stonehenge (Carhenge)", "None", "None", "Alliance, Nebraska", 0)`);
            this.db.run(`INSERT OR IGNORE INTO Artworks (id, name, artist_culture, museum, location, unit) VALUES (264, "Stonehenge (Foamhenge)", "None", "None", "Natural Bridge, Virginia", 0)`);


        });

    } //end of initializeDatabase


    fetchQueries(callback) {
        this.db.all(`SELECT * FROM Artworks`, callback);

    } //emd of fetchQueries

} //end of DatabaseManager

module.exports = DatabaseManager;