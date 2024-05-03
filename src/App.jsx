import SideBar from './components/SideBar/SideBar.jsx';
import DropDown from './components/SideBar/DropDown.jsx';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="flex">
        <DropDown />
      </div>
      <Routes>
        <Route></Route>
      </Routes>
    </Router>
  );
};

export default App
