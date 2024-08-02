import PikaPika from "../assets/img/landscape-1456483171-pokemon2_y5n9.jpg";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleComenzarClick = () => {
    navigate("/gallery");
  };

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
