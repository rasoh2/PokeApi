/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Card.css";

const Card = () => {
  const [img, setImg] = useState("");
  const [element, setElement] = useState("");
  const [states, setStates] = useState([]);

  const { pokemon } = useParams();

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

  useEffect(() => {
    getPokemon();
  }, []);

  const getPokemon = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

      if (res.status === 404) navigate(`/${pokemon}`);

      const { stats, types, sprites } = await res.json();

      setImg(sprites.other.dream_world.front_default);
      setElement(types[0].type.name);
      setStates(stats);

      const type = types[0].type.name;
      const backgroundColor = typeColors[type] || "#FFFFFF";
      setBackgroundColor(backgroundColor);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  };

  return (
    <div className='container-card'>
      <div className='card' style={{ backgroundColor }}>
        <h2 className='text-uppercase text-center'>{pokemon}</h2>
        <div className='container-img-ul'>
          <div>
            <div>
              <img src={img} alt='imagen-pokemon' className='imagen-pokemon' />
            </div>
            <h3 className='mt-5 text-center'>
              {"Tipo"} : {element}
            </h3>
          </div>
          <div className='ul-data'>
            <ul className='list-unstyled'>
              {states.map((stat, index) => (
                <li key={index} className='ms-5'>
                  <strong>{stat.stat.name} :</strong>
                </li>
              ))}
            </ul>
            <ul className='list-unstyled'>
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

export default Card;
