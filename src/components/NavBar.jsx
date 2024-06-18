import { NavLink, Link } from "react-router-dom";
import SvgPika from "../assets/img/pokeball-icon-27042.png";
import "../components/NavBar.css";

const NavBar = () => {
  return (
    <nav className='navbar navbar-expand-lg bg-secondary'>
      <div className='container-fluid'>
        <Link to='/' className='nav-link active' aria-current='page'>
          <img src={SvgPika} alt='logo' className='pokeball-animation' />
        </Link>
        <button
          className='navbar-toggler'
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
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink
                to='/'
                className={({ isActive }) => (isActive ? "active" : undefined)}
                aria-current='page'
              >
                Home
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                to='/gallery'
                className={({ isActive }) => (isActive ? "active" : undefined)}
                aria-current='page'
              >
                Pokemones
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
