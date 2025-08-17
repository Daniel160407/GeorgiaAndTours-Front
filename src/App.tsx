import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AdminHome from "./pages/AdminHome";
import AdminContact from "./pages/AdminContact";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/adminpanel/home" element={<AdminHome />} />
        <Route path="/adminpanel/contact" element={<AdminContact />} />
      </Routes>
    </Router>
  );
}

export default App;
