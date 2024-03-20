import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showShiny, setShowShiny] = useState(false);
  const [pokemonData, setPokemonData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (pokemonName = "") => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      setPokemonData([response.data]);
      setError(null);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setError("Pokemon not found");
    }
    setIsLoading(false);
  };

  const handleRandomSearch = async () => {
    setIsLoading(true);
    try {
      const randomId = Math.floor(Math.random() * 898) + 1; // Max ID of existing Pokemon
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      setPokemonData([response.data]);
      setError(null);
    } catch (error) {
      console.error("Error fetching random Pokemon data:", error);
      setError("Failed to get random Pokemon");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (searchTerm !== "") {
      handleSearch(searchTerm);
    } else {
      setPokemonData([]);
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
        <div className="flex mb-4">
          <input
            className="flex-1 px-4 py-2 rounded-l-md bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            placeholder="Enter Pokemon name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded-r-md bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={handleRandomSearch}
          >
            Random Pokemon
          </button>
        </div>
        <label className="flex items-center mb-4 text-xl">
          <input
            type="checkbox"
            className="mr-2"
            checked={showShiny}
            onChange={() => setShowShiny(!showShiny)}
          />
          Show Shiny
        </label>
        {isLoading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {pokemonData.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-details bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="text-2xl mb-2">{pokemon.name}</h2>
            <img
              className="mx-auto mb-4"
              src={showShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default}
              alt={pokemon.name}
            />
            <p><span className="font-semibold">Types:</span> {pokemon.types.map((type) => type.type.name).join(", ")}</p>
            <p><span className="font-semibold">Abilities:</span> {pokemon.abilities.map((ability) => ability.ability.name).join(", ")}</p>
            <p><span className="font-semibold">Weight:</span> {pokemon.weight / 10} kg</p>
            <p><span className="font-semibold">Height:</span> {pokemon.height / 10} m</p>
            <p><span className="font-semibold">Hidden Ability:</span> {pokemon.abilities.find(ability => ability.is_hidden)?.ability.name || "None"}</p>
            <p>
              <span className="font-semibold text-red-500">More Info:</span>{" "}
              <a href={getPokemonLink(pokemon.name)} target="_blank" className="font-semibold text-red-500" rel="noopener noreferrer">Bulbapedia</a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
