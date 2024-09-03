import { Route, Routes } from 'react-router-dom';
import { useState } from "react";

import './App.css';
import './w3.css'

import NavBar from './components/NavBar'

import About from './pages/About/About';
import Exhibit from './pages/Exhibit/Exhibit'
import Home from './pages/Home/Home';
import Map from './pages/Map/Map'
import ArtGallery from './pages/ArtGallery/ArtGallery'
import Calendar from './pages/Calendar/Calendar';

function App() {
    const [menuOpened, setMenuOpened] = useState(false);

    return (
        <>
            <NavBar menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
            <div className={`spacer ${menuOpened ? "spaceopen" : "spaceclosed"}`}>
            <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/exhibit' element={<Exhibit />} />
                    <Route path='/map' element={<Map />} />
                    <Route path='/artgallery' element={<ArtGallery />} />
                    <Route path='/calendar' element={<Calendar />} />
                </Routes>
            </div>
            <button className="feedback-button" onClick={() => window.open('https://forms.gle/3Bngm7bphSjygE2Q7', '_blank')}>
                Feedback
            </button>
        </>
    );
}

export default App;