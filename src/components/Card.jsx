/* eslint-disable react-hooks/exhaustive-deps */
// Importa los módulos necesarios desde las bibliotecas de React y React Router
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Card.css";

// Define un componente funcional llamado "Card"
const Card = () => {
  // Define estados utilizando el hook useState para gestionar la información del componente
  const [img, setImg] = useState(""); // Para almacenar la imagen del Pokémon
  const [element, setElement] = useState(""); // Para almacenar el tipo del Pokémon
  const [states, setStates] = useState([]); // Para almacenar las estadísticas del Pokémon

  // Obtiene el parámetro "pokemon" de la URL utilizando el hook "useParams"
  const { pokemon } = useParams();

  // Obtiene una función de navegación para redirigir en caso de error
  const navigate = useNavigate();
  const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };

  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");

  // Utiliza el hook "useEffect" para cargar los datos del Pokémon cuando el componente se monta
  useEffect(() => {
    getPokemon();
  }, []);

  // Función asincrónica para obtener los datos del Pokémon
  const getPokemon = async () => {
    try {
      // Realiza una solicitud a la API de Pokémon para obtener los datos del Pokémon
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

      // Si el Pokémon no se encuentra (código 404), redirige a la página de inicio
      if (res.status === 404) navigate(`/${pokemon}`);

      // Convierte la respuesta en formato JSON y extrae la información relevante
      const { stats, types, sprites } = await res.json();

      // Actualiza los estados del componente con la información obtenida
      setImg(sprites.other.dream_world.front_default);
      setElement(types[0].type.name);
      setStates(stats);
      // Obtener el color de fondo correspondiente al tipo del Pokémon
      const type = types[0].type.name;
      const backgroundColor = typeColors[type] || "#FFFFFF";
      setBackgroundColor(backgroundColor);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  };

  return (
    <div className='container-card' style={{ backgroundColor }}>
      <div className='card'>
        <h2 className='text-uppercase text-center'>{pokemon}</h2>
        <div className='container-img-ul'>
          <div>
            <img src={img} alt='imagen-pokemon' className='imagen-pokemon' />
            <h3 className='mt-5 text-center'>
              {"Tipo"} : {element}
            </h3>
          </div>
          <div className='ul-data'>
            <ul className='list-unstyled'>
              {/* Mapea las estadísticas y muestra sus nombres */}
              {states.map((stat, index) => (
                <li key={index} className='ms-5'>
                  <strong>{stat.stat.name} :</strong>
                </li>
              ))}
            </ul>
            <ul className='list-unstyled'>
              {/* Mapea las estadísticas y muestra sus valores */}
              {states.map((stat, index) => (
                <li key={index} className='ms-5'>
                  {stat.base_stat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente "Card" para que pueda ser utilizado en otros lugares
export default Card;
