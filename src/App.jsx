import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Gallery from "./views/Gallery";
import Home from "./views/Home";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Card from "./components/Card";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className='container-app'>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home></Home>} />
          <Route path='/gallery' element={<Gallery></Gallery>} />
          <Route path='/gallery/:pokemon' element={<Card></Card>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
