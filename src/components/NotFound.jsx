import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='not-found-container'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-8 text-center'>
            {/* Animación 404 */}
            <div className='error-animation mb-4'>
              <div className='pokeball-error'>
                <div className='pokeball-top'></div>
                <div className='pokeball-middle'>
                  <div className='pokeball-button'></div>
                </div>
                <div className='pokeball-bottom'></div>
              </div>
              <div className='error-code'>404</div>
            </div>

            {/* Mensaje principal */}
            <h1 className='error-title mb-3'>
              <i className='fas fa-exclamation-triangle text-warning me-3'></i>
              ¡Pokémon No Encontrado!
            </h1>

            <p className='error-message mb-4'>
              Parece que este Pokémon se escapó o no existe en tu Pokédex.
              <br />
              <span className='text-warning fw-bold'>
                El Pokémon que buscas está en otro servidor...
              </span>
            </p>

            {/* Ilustración divertida */}
            <div className='error-illustration mb-4'>
              <div className='confused-pikachu'>
                <i className='fas fa-question-circle fa-3x text-warning'></i>
              </div>
            </div>

            {/* Consejos */}
            <div className='error-tips mb-4'>
              <p className='mb-2'>
                <i className='fas fa-lightbulb text-info me-2'></i>
                Revisa la URL o intenta buscar otro Pokémon
              </p>
            </div>

            {/* Botones de acción */}
            <div className='error-actions'>
              <button
                className='btn-404 btn-primary-404'
                onClick={() => navigate("/")}
              >
                <i className='fas fa-home me-2'></i>
                Volver al Inicio
              </button>
              <button
                className='btn-404 btn-secondary-404'
                onClick={() => navigate("/gallery")}
              >
                <i className='fas fa-th me-2'></i>
                Ver Pokédex
              </button>
            </div>

            {/* Mensaje gracioso adicional */}
            <p className='error-footer mt-4'>
              <i className='fas fa-sad-tear me-2'></i>
              Hasta los mejores entrenadores se pierden a veces...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
