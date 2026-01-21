import "./footer.css";

const Footer = () => {
  return (
    <footer className='pokemon-footer'>
      <div className='container py-4'>
        <div className='row align-items-center'>
          {/* Logo y Copyright */}
          <div className='col-12 col-md-4 text-center text-md-start mb-3 mb-md-0'>
            <div className='footer-brand'>
              <i className='fas fa-bolt text-warning me-2'></i>
              <span className='fw-bold'>PokéDex Ultimate</span>
            </div>
            <p className='footer-copyright mb-0'>
              &copy; {new Date().getFullYear()} | Creado con
              <i className='fas fa-heart text-danger mx-1'></i>
              para entrenadores
            </p>
          </div>

          {/* Redes Sociales */}
          <div className='col-12 col-md-4 text-center mb-3 mb-md-0'>
            <div className='social-links'>
              <a
                href='https://github.com'
                target='_blank'
                rel='noopener noreferrer'
                className='social-icon'
              >
                <i className='fab fa-github'></i>
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='social-icon'
              >
                <i className='fab fa-twitter'></i>
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='social-icon'
              >
                <i className='fab fa-instagram'></i>
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='social-icon'
              >
                <i className='fab fa-linkedin'></i>
              </a>
            </div>
          </div>

          {/* Info adicional */}
          <div className='col-12 col-md-4 text-center text-md-end'>
            <p className='footer-text mb-1'>
              <i className='fas fa-database me-1'></i>
              Powered by{" "}
              <a
                href='https://pokeapi.co'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-link'
              >
                PokéAPI
              </a>
            </p>
            <p className='footer-text mb-0'>
              <i className='fas fa-code me-1'></i>
              React + Vite + Bootstrap
            </p>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className='row mt-3'>
          <div className='col-12 text-center'>
            <p className='footer-quote'>
              “¡Hazte con todos!” - Gotta catch 'em all!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
