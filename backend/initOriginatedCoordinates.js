
function initOriginatedCoordinates(db) {

    db.serialize(() => {
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (1, 17.083, -22.533)`); // Namibia
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (2, 1.053, 44.383)`);   // Lascaux, France
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (3, -99.639, 19.469)`);  // Tequixquiac, Mexico
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (4, 5.603, 24.280)`);    // Tassili n’Ajjer, Algeria
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (5, 48.252, 32.040)`);   // Susa, Iran
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (6, 53.934, 23.290)`);   // Arabian Peninsula
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (7, 120.395, 30.263)`);  // Liangzhu, China
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (8, -1.783, 51.183)`);   // Wiltshire, UK
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (9, 143.511, -6.038)`);  // Ambum Valley, Papua New Guinea
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (10, -99.133, 19.690)`); // Central Mexico
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (11, 160.0000, -10.5000)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (12, 31.4975, 45.5474)`); // White Temple and its ziggurat, Uruk (modern Warka, Iraq)
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (13, 27.1830, 31.4820)`); // Palette of King Narmer, Predynastic Egypt
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (14, 33.7434, 44.0411)`); // Statues of Votive Figures from the Square Temple at Eshnuna, Modern Tell Asmar Iraq
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (15, 29.8154, 31.0457)`); // Seated Scribe, Saqqara, Egypt
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (16, 31.4515, 45.6455)`); // Standard of Ur, Modern Tell el-Muqayyar, Iraq
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (17, 29.9792, 31.1342)`); // Great Pyramids and Great Sphinx, Giza, Egypt
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (18, 29.9792, 31.1342)`); // King Menkaura and queen, Egypt
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (19, 32.5468, 53.6544)`); // Code of Hammurabi, Babylon (modern Iran)
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (20, 25.7189, 32.6573)`); // Temple of Amun-Re and Hypostyle Hall, Karnak, near Luxor, Egypt
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (21, 25.7424, 32.6067)`); // Mortuary Temple of Hatshepsut, Near Luxor, Egypt
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (22, 25.6991, 32.6394)`); // Akhenaten, Nefertiti, and 3 daughters, New Kingdom (Amarna)
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (23, 25.7438, 32.6072)`); // Tutankhamun's tomb, innermost coffin, Egypt
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (24, 25.7312, 32.6108)`); // Last Judgement of Hunefer, from his tomb (page from the Book of the Dead), Egypt
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (25, 36.5264, 42.3384)`); // Lamassu from the citadel of Sargon II, modern Khorsabad, Iraq
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (26, 37.9838, 23.7275)`); // Athenian agora, Greece
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (27, 37.9783, 23.7264)`); // Anavysos Kouros, Greece
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (28, 37.9715, 23.7336)`); // Peplos Kore from the Acropolis, Greece
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (30, 29.9845, 52.5714)`); // Audience Hall of Darius and Xerxes, Persepolis, Iran
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (31, 42.0850, 12.4475)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (32, 42.2658, 11.7718)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (33, 37.9838, 23.7275)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (34, 40.8522, 14.2681)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (35, 37.9715, 23.7341)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (38, 37.8833, 27.1333)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (39, 40.7528, 14.4840)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (44, 41.8902, 12.4922)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (45, 41.8902, 12.4922)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (48, 41.8902, 12.4922)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (49, 41.8902, 12.4922)`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (51, 12.1343, 44.4174)`); // Ravenna, Italy
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (52, 28.9784, 41.0082)`); // Constantinople (Istanbul), Turkey
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (56, -4.0216, 37.8826)`); // Córdoba, Spain
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (58, 2.3424, 44.5632)`); // Conques, France
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (60, 1.4854, 48.1158)`); // Chartres, France
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (63, 11.8761, 45.4064)`); // Padua, Italy
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (65, -3.7094, 37.1762)`); // Granada, Spain
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (67, 11.2558, 43.7696)`); // Florence, Italy
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (70, 11.2558, 43.7696)`); // Florence, Italy
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (75, 12.4534, 41.9029)`); // Vatican City, Italy
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (82, 12.4823, 41.8947)`); // Rome, Italy
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (84, 26.5715, 41.6704)`); // Edirne, Turkey
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (88, 12.4823, 41.8947)`); // Rome, Italy
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (89, 12.4823, 41.8947)`); // Rome, Italy
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (93, 2.1300, 48.8049)`); // Versailles, France
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (95, -99.1332, 19.4397)`); // Basilica of Guadalupe, Mexico City
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (100, -1.5772, 53.3940)`); // England
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (101, 2.2137, 48.8566)`); // France
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (102, -78.5474, 37.5714)`); // Virginia, U.S
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (103, 2.2137, 48.8566)`); // France
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (104, 2.2137, 48.8566)`); // France`);
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (105, -77.4334, 37.5407)`); // Virginia State Capitol, Richmond, Virginia
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (106, 2.2137, 48.8566)`); // France
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (107, -3.7038, 40.4168)`); // Spain (Napoleon's conquest)
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (108, 2.2137, 48.8566)`); // French
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (112, -0.1276, 51.5074)`); // London, England
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (124, 41.8318, -87.6278)`); // Chicago, Illinois, U.S.
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (135, 49.0417, 2.1060)`); // Villa Savoye
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (139, 41.0069, -77.9390)`); // Fallingwater
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (146, 40.7406, -73.9932)`); // Seagram Building
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (151, 40.758, -111.891)`); // Spiral Jetty
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (152, 39.6456, -75.7244)`); // House in New Castle County
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (153, -9.4083, -77.9725)`); // Chavin de Huantar
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (154, 37.2308, -108.4654)`); // Mesa Verde Cliff Dwellings
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (155, 17.2916, -89.1537)`); // Yaxchilan
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (156, 39.4415, -83.4852)`); // Great Serpent Mound
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (157, 19.4326, -99.1332)`); // Templo Mayor
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (159, -13.5214, -71.9675)`); // City of Cusco
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (161, -13.1631, -72.5450)`); // City of Machu Picchu
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (163, 42.7473, -108.9752)`); // Bandolier Bag
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (164, 50.5061, -127.6305)`); // Transformation Mask
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (165, 43.2192, -108.7600)`); // Painted Elk Hide
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (166, 35.6828, -105.9380)`); // Black-on-Black Ceramic Vessel
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (167, -20.2675, 30.9309)`); // Conical Tower and Circular Wall of Great Zimbabwe
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (168, 13.5870, -8.0060)`); // Great Mosque of Djenne
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (169, 6.3333, 5.6000)`); // Wall Plaque from Oba's Palace
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (170, 7.0468, -0.4811)`); // Golden Stool
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (171, -5.6521, 24.6346)`); // Ndop (Portrait Figure)
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (172, -5.5833, 13.2833)`); // Nkisi N'Kondi
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (173, -6.9720, 17.1593)`); // Female Pwo Mask
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (174, 7.5825, -5.1554)`); // Portrait Mask (Mblo Mask)
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, latitude, longitude) VALUES (175, 8.4060, -12.5610)`); // Bundu Mask
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (176, 8.5150, 10.4515)`); // Ikenga, Nigeria
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (177, 21.3784, -2.8484)`); // Lukasa memory board, Democratic Republic of the Congo
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (178, 10.1591, 5.9589)`); // Aka elephant mask, Cameroon, western grassfields region
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (179, 11.5021, 3.8480)`); // Reliquary guardian figure, Southern Cameroon
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (180, 4.5572, 7.5233)`); // Veranda Post of enthroned king and senior wife, Olowe of Ise
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (181, 35.4444, 30.3285)`); // Petra, Jordan
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (182, 67.8328, 34.8498)`); // Buddha, Bamiyan, Afghanistan
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (183, 39.8262, 21.4225)`); // The Kaaba, Mecca, Saudi Arabia
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (184, 91.1324, 29.6570)`); // Jowo Rinpoche, Lhasa, Tibet
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (185, 35.2359, 31.7780)`); // Dome of the Rock, Jerusalem
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (186, 51.6766, 32.6546)`); // Great Mosque (Isfahan), Isfahan, Iran
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (187, 34.8526, 31.0474)`); // Folio from a Qur'an, Arab, North Africa, or Near East
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (189, 53.6833, 33.4167)`); // Bahram Gur Fights the Karg, Islamic
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (192, 77.3086, 23.1786)`); // Great Stupa at Sanchi, Madhya Pradesh, India
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (194, 118.7969, 32.0603)`); // Funeral banner of Lady Dai, China
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (195, 112.4540, 34.6194)`); // Longmen caves, Luoyang, China
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (196, 128.6126, 35.8886)`); // Gold and jade crown, Silla Kingdom, Korea
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (197, 135.8318, 34.6842)`); // Todai-ji, Nara, Japan
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (198, 110.2037, -7.6079)`); // Borobudur Temple, Central Java, Indonesia
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (199, 103.8667, 13.4125)`); // Angkor, the temple of Angkor Wat and the city of Angkor Thom, Angkor Thom Cambodia
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (200, 79.9334, 23.6260)`); // Khajuraho, India
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (202, 78.6580, 11.0168)`); // Shiva Nataraja (dancing) - India (Tamil Nadu)
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (203, 138.9345, 35.0263)`); // Kamakura Period, Japan
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (204, 113.7631, 27.1237)`); // Yuan Dynasty, China
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (205, 127.7669, 35.9078)`); // Korea
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (206, 116.4074, 39.9042)`); // Beijing, China
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (207, 135.7596, 35.0394)`); // Kyoto, Japan
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (208, 77.2157, 28.6139)`); // Jahangir Preferring a Sufi Shaikh to Kings
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (209, 78.0421, 27.1751)`); // Agra, Uttar Pradesh, India
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (210, 139.7785, 35.7023)`); // Tokyo, Japan
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (211, 139.7561, 35.6895)`); // Tokyo, Japan
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (212, 116.4074, 39.9042)`); // Beijing, China
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (213, 158.2093, 6.9723)`); // Pohnpei, Micronesia
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (214, -109.4237, -27.1061)`); // Rapa Nui (Easter Island)
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (215, -155.0152, 19.2030)`); // Hawaii
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (216, -159.7881, -21.2071)`); // Rarotonga, Cook Islands
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (217, -156.8196, -3.7917)`); // Nukuoro, Micronesia
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (218, 146.0694, -9.2710)`); // Torres Strait
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (219, -169.9180, -19.0608)`); // Niue
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (220, 174.7779, -41.2911)`); // New Zealand
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (221, 162.8384, 7.0100)`); // Marshall Islands, Micronesia
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (222, 152.0766, -2.2998)`); // New Ireland Province, Papua New Guinea
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (223, 178.4291, -17.7130)`); // Fiji
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (224, -74.0060, 40.7128)`); // New York, U.S
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (225, -77.0369, 38.9072)`); // Washington, D.C., U.S
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (228, -73.9830, 40.75);`); // Androgyne III
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (233, -73.9951, 40.7435);`); // Trade
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (240, -2.9467, 43.2630);`); // Guggenheim Museum Bilbao
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (244, -0.1207, 51.3591);`); // The Swing (after Fragonard)
        db.run(`INSERT OR IGNORE INTO OriginatedCoordinates (id, longitude, latitude) VALUES (249, 12.4826, 41.8892);`); // MAXXI National Museum of XXI Century Arts

    });
}

module.exports = {initOriginatedCoordinates};