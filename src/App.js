import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showShiny, setShowShiny] = useState(false);
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);

  const fetchPokemonData = async () => {
    try {
      let url = `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`;
      if (showShiny) {
        url += "?shiny=true";
      }
      console.log("Request URL:", url);
      const response = await axios.get(url);
      console.log("Response data:", response.data);
      setPokemonData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setPokemonData(null);
      setError("Pokemon not found");
    }
  };

  useEffect(() => {
    if (searchTerm !== "") {
      fetchPokemonData();
    } else {
      setPokemonData(null);
      setError(null);
    }
  }, [searchTerm, showShiny]);

  const getPokemonLink = (pokemonName) => {
    const formattedName = pokemonName.toLowerCase().replace(" ", "-");
    return `https://bulbapedia.bulbagarden.net/wiki/${formattedName}_(Pok%C3%A9mon)`;
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl mb-4">Pokemon Search</h1>
      <div className="w-full max-w-md">
        <input
          className="w-full px-4 py-2 rounded-md mb-4 bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-500"
          type="text"
          placeholder="Enter Pokemon name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label className="flex items-center mb-4 text-xl">
          <input
            type="checkbox"
            className="mr-2"
            checked={showShiny}
            onChange={() => setShowShiny(!showShiny)}
          />
          Show Shiny
        </label>
        {error && <p className="text-red-500">{error}</p>}
        {pokemonData && (
          <div className="pokemon-details bg-gray-800 rounded-lg p-4">
            <h2 className="text-2xl mb-2">{pokemonData.name}</h2>
            <img
              className="mx-auto mb-4"
              src={showShiny ? pokemonData.sprites.front_shiny : pokemonData.sprites.front_default}
              alt={pokemonData.name}
            />
            <p><span className="font-semibold">Types:</span> {pokemonData.types.map((type) => type.type.name).join(", ")}</p>
            <p><span className="font-semibold">Abilities:</span> {pokemonData.abilities.map((ability) => ability.ability.name).join(", ")}</p>
            <p><span className="font-semibold">Weight:</span> {pokemonData.weight / 10} kg</p>
            <p><span className="font-semibold">Height:</span> {pokemonData.height / 10} m</p>
            <p><span className="font-semibold">Hidden Ability:</span> {pokemonData.abilities.find(ability => ability.is_hidden)?.ability.name || "None"}</p>
            <p>
              <span className="font-semibold text-red-500">More Info:</span>{" "}
              <a href={getPokemonLink(pokemonData.name)} target="_blank" className="font-semibold text-red-500" rel="noopener noreferrer">Bulbapedia</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
