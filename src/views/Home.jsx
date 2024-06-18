import PikaPika from "../assets/img/landscape-1456483171-pokemon2_y5n9.jpg";
import "./Home.css";

// Importa la función useNavigate de react-router-dom para navegar a otras rutas
import { useNavigate } from "react-router-dom";

// Define el componente funcional Home
const Home = () => {
  // Usa el hook useNavigate para obtener la función de navegación
  const navigate = useNavigate();

  // Función que se ejecuta cuando se hace clic en el botón "Comenzar"
  const handleComenzarClick = () => {
    navigate("/gallery"); // Navega a la ruta "/gallery" al hacer clic
  };

  // Retorna la estructura del componente que se va a renderizar
  return (
    <div className='container-home'>
      <h1 className='titulo'>Bienvenido maestro pokemón</h1>
      <img className='rounded' src={PikaPika} alt='4 pokemón originales' />
      <button className='rounded' onClick={handleComenzarClick}>
        Comenzar
      </button>
    </div>
  );
};

export default Home;
