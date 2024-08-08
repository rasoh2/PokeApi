import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfesorOk from "../assets/img/PngItem_4780727.png";
import "./Gallery.css";

const Gallery = () => {
  const [pokemones, setPokemones] = useState([]);

  const [pokemon, setPokemon] = useState("");

  const [msgError, setMsgError] = useState(false);

  const navigate = useNavigate();

  const getPokemones = async () => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
      const { results } = await res.json();

      setPokemones(results);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  };

  const goCard = async () => {
    if (!pokemon) {
      setMsgError(true);
      return;
    }

    navigate(`/gallery/${pokemon}`);
  };

  useEffect(() => {
    getPokemones();
  }, []);

  return (
    <div className='container-gallery  '>
      <h1>Selecciona tu pokemón</h1>
      <div className=' container-img-gallery'>
        <img src={ProfesorOk} alt=' 4 pokemón originales' />
      </div>
      {msgError ? <span className='mb-3'>Selecciona un pokemon!!!</span> : null}
      <div>
        <p>
          ¡Bienvenido a la emocionante aventura de convertirte en un entrenador
          Pokémon! Es hora de elegir a tu primer compañero en esta travesía.
          ¡Selecciona sabiamente!
        </p>
      </div>

      <div className='container-select-button'></div>
      <select
        onChange={({ target }) => {
          setPokemon(target.value);
        }}
        name=''
        id=''
        type=''
      >
        <option value=''>Selecciona tu Pokemon</option>
        {pokemones
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
      </select>
      <button className='ver-detalle-button rounded' onClick={goCard}>
        ver detalle
      </button>
    </div>
  );
};

export default Gallery;
