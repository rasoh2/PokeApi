import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from '@gravity-ui/uikit';
import { PokemonThemeProvider } from './context/PokemonThemeContext';
import "./App.css";
import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import DetailView from "./views/DetailView";
import BattleSimulator from "./components/BattleSimulator";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <ThemeProvider theme="dark">
      <PokemonThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className='container-app'>
            <NavBar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/gallery' element={<Dashboard />} />
              <Route path='/gallery/:pokemon' element={<DetailView />} />
              <Route path='/battle' element={<BattleSimulator />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </PokemonThemeProvider>
    </ThemeProvider>
  );
}

export default App;
