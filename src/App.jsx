import SideBar from './components/SideBar/SideBar.jsx';
import DropDown from './components/SideBar/DropDown.jsx';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DropDown />}>
          <Route index element={<Home />}/>
          <Route path="about" element={<About />}/>

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App
