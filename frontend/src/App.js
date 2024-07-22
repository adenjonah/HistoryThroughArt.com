// App.js
import { Route, Routes } from 'react-router-dom';
import { useState } from "react";

import './App.css';
import './w3.css'

import NavBar from './components/NavBar'

import About from './pages/About/About';
import Exhibit from './pages/Exhibit/Exhibit'
import Home from './pages/Home/Home';
import Map from './pages/Map/Map'
import Museum from './pages/Museum/Museum'

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
                    <Route path='/museum' element={<Museum />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
