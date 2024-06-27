import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import NavBar from './components/NavBar'
import ArtGallery from './pages/ArtGallery'
import {useState} from "react";


function App() {

    const [menuOpened, setMenuOpened] = useState(false);
    const spaceType = () => {
        return menuOpened ? "spaceclosed" : "spaceopen";
    };
  return (
    <>
      <NavBar menuOpened={menuOpened} setMenuOpened={setMenuOpened}/>
      <div className={spaceType()}>
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/art-gallery' element={<ArtGallery />} />
        <Route />

      </Routes>
        </div>
    </>
  );
}

export default App;
