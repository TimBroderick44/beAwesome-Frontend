import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from "./pages/LandingPage/LandingPage.tsx";
import AllPostsPage from "./pages/AllPostsPage/AllPostsPage.jsx";
import NavBar from "./components/Navbar/Navbar.tsx";
import StarsCanvas from "./components/Stars/Stars.jsx";
import Flexbox from "./containers/Flexbox/Flexbox.tsx"

function App() {
  return (
    <BrowserRouter>
    <ToastContainer position="bottom-right" />
    <StarsCanvas />
    <NavBar />
    <Flexbox>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/posts" element={<AllPostsPage />} />
      </Routes>
    </Flexbox>
    </BrowserRouter>
  ); 
}

export default App