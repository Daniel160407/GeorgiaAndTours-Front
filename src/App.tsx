import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AdminHome from "./pages/AdminHome";
import AdminContact from "./pages/AdminContact";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/adminpanel/home" element={<AdminHome />} />
        <Route path="/adminpanel/contact" element={<AdminContact />} />
      </Routes>
    </Router>
  );
}

export default App;
