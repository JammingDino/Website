import SideBar from './components/SideBar/SideBar.jsx';
import DropDown from './components/SideBar/DropDown.jsx';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Resources from './pages/Resources.jsx';
import About from "./pages/About";
import Camera2D from "./pages/Camera2D";
import CameraShake2D from "./pages/Camera2D/CameraShake.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DropDown />}>
          <Route index element={<Home />}/>
          <Route path="About" element={<About />}/>
          <Route path="Resources" element={<Resources />}/>
          <Route path="Camera2d" element={<Camera2D />}/>
          <Route path="Camera2d/CameraShake" element={<CameraShake2D />}/>


        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App
