import "./footer.css";

// Define el componente funcional Footer
const Footer = () => {
  return (
    <footer>
      {/* Contenedor para el contenido del pie de página */}
      <div className="container-footer">
        {/* Muestra el año actual y el texto "Photography" */}
        <p>&copy; {new Date().getFullYear()} PokeApi </p>
      </div>
    </footer>
  );
};

export default Footer;
