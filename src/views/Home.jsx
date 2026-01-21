import PikaPika from "../assets/img/landscape-1456483171-pokemon2_y5n9.jpg";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleComenzarClick = () => {
    navigate("/gallery");
  };

  return (
    <main className='home-container'>
      <div className='container py-5'>
        <div className='row align-items-center justify-content-center min-vh-100'>
          <div className='col-12 col-lg-10 col-xl-8'>
            {/* Header con animación */}
            <div className='text-center mb-5 animate-fade-in'>
              <div className='pokemon-badge mb-4'>
                <i className='fas fa-star text-warning me-2'></i>
                Bienvenido, Entrenador
                <i className='fas fa-star text-warning ms-2'></i>
              </div>
              <h1 className='display-3 fw-bold text-dark mb-3 title-glitch'>
                <span className='text-gradient'>¡Conviértete en un</span>
                <br />
                <span className='text-danger'>Maestro Pokémon!</span>
              </h1>
              <p className='lead text-dark mb-4 px-3'>
                <i className='fas fa-bolt text-danger me-2'></i>
                Explora más de 1000 Pokémon de todas las generaciones
              </p>
            </div>

            {/* Imagen principal con efecto hover */}
            <div className='position-relative mb-5 animate-slide-up'>
              <div className='image-container'>
                <div className='image-glow'></div>
                <img
                  className='img-fluid rounded-4 shadow-lg pokemon-main-image'
                  src={PikaPika}
                  alt='Pokémon Iniciales'
                />
                <div className='image-overlay'>
                  <div className='overlay-content'>
                    <i className='fas fa-search-plus fa-3x text-white mb-3'></i>
                    <p className='text-white fw-bold'>
                      Descubre el mundo Pokémon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Características rápidas */}
            <div className='row g-4 mb-5 animate-fade-in-delay'>
              <div className='col-12 col-md-4'>
                <div className='feature-card text-center'>
                  <div className='feature-icon mb-3'>
                    <i className='fas fa-database fa-2x text-info'></i>
                  </div>
                  <h5 className='text-dark fw-bold'>+1000 Pokémon</h5>
                  <p className='text-secondary small mb-0'>
                    Base de datos completa
                  </p>
                </div>
              </div>
              <div className='col-12 col-md-4'>
                <div className='feature-card text-center'>
                  <div className='feature-icon mb-3'>
                    <i className='fas fa-bolt fa-2x text-warning'></i>
                  </div>
                  <h5 className='text-dark fw-bold'>Información Real</h5>
                  <p className='text-secondary small mb-0'>
                    Datos de PokéAPI oficial
                  </p>
                </div>
              </div>
              <div className='col-12 col-md-4'>
                <div className='feature-card text-center'>
                  <div className='feature-icon mb-3'>
                    <i className='fas fa-fire fa-2x text-danger'></i>
                  </div>
                  <h5 className='text-dark fw-bold'>Diseño Premium</h5>
                  <p className='text-secondary small mb-0'>
                    Interfaz moderna y atractiva
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de acción */}
            <div className='text-center animate-bounce-in'>
              <button
                className='btn-pokemon btn-lg px-5 py-3'
                onClick={handleComenzarClick}
              >
                <i className='fas fa-gamepad me-3'></i>
                Comenzar Aventura
                <i className='fas fa-arrow-right ms-3'></i>
              </button>
              <p className='text-dark mt-3 small'>
                <i className='fas fa-info-circle me-2'></i>
                ¡Atrápalos a todos!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
