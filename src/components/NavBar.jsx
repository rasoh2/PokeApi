import { NavLink, Link } from "react-router-dom";
import SvgPika from "../assets/img/pokeball-icon-27042.png";
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className='navbar navbar-expand-lg navbar-dark pokemon-navbar sticky-top'>
      <div className='container-fluid px-4'>
        <Link to='/' className='navbar-brand d-flex align-items-center'>
          <img
            src={SvgPika}
            alt='PokéDex Logo'
            className='pokeball-animation me-2'
          />
          <span className='brand-text d-none d-md-inline'>
            <i className='fas fa-bolt text-warning me-1'></i>
            PokéDex Ultimate
          </span>
        </Link>

        <button
          className='navbar-toggler border-0'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav ms-auto align-items-lg-center'>
            <li className='nav-item mx-2'>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  isActive ? "nav-link px-3 py-2 active" : "nav-link px-3 py-2"
                }
              >
                <i className='fas fa-home me-2'></i>
                Inicio
              </NavLink>
            </li>
            <li className='nav-item mx-2'>
              <NavLink
                to='/gallery'
                className={({ isActive }) =>
                  isActive ? "nav-link px-3 py-2 active" : "nav-link px-3 py-2"
                }
              >
                <i className='fas fa-th me-2'></i>
                Pokédex
              </NavLink>
            </li>
            <li className='nav-item ms-3'>
              <div className='nav-badge'>
                <i className='fas fa-database text-warning'></i>
                <span className='ms-1 d-none d-lg-inline'>+1000 Pokémon</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
