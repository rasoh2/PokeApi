import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfesorOk from "../assets/img/PngItem_4780727.png";
import "./Gallery.css";

const Gallery = () => {
  // Estado para almacenar la lista de pokemones
  const [pokemones, setPokemones] = useState([]);

  // Estado para almacenar el nombre del Pokémon seleccionado
  const [pokemon, setPokemon] = useState("");

  // Estado para manejar mensajes de error
  const [msgError, setMsgError] = useState(false);

  // Hook de React Router para navegar entre páginas
  const navigate = useNavigate();

  // Función para obtener la lista de pokemones
  const getPokemones = async () => {
    try {
      // Realiza una solicitud a la API para obtener información sobre los pokemones
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
      const { results } = await res.json(); // Extrae la lista de resultados

      // Actualiza el estado con la lista de pokemones
      setPokemones(results);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  };

  // Función para manejar la acción de ver el detalle del Pokémon
  const goCard = async () => {
    if (!pokemon) {
      // Si no se ha seleccionado un Pokémon, muestra un mensaje de error
      setMsgError(true);
      return;
    }

    // Navega a la página de detalle del Pokémon seleccionado
    navigate(`/gallery/${pokemon}`);
  };

  // Se ejecuta al cargar el componente para obtener la lista de pokemones
  useEffect(() => {
    getPokemones();
  }, []);

  return (
    <div className='container-gallery '>
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
