import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AdminHome from "./pages/AdminHome";
import AdminContact from "./pages/AdminContact";
import Posts from "./pages/Posts";
import AdminForm from "./components/forms/AdminForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/adminpanel/home" element={<AdminHome />} />
        <Route path="/adminpanel/contact" element={<AdminContact />} />
        <Route path="/login" element={<AdminForm />} />
      </Routes>
    </Router>
  );
}

export default App;
