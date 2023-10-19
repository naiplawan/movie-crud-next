import { useState } from 'react';

function useCart() {
  const [movieSelected, setMoviesSelected] = 
  useState([]);

  const addToCart = (movie, id) => {
    setMoviesSelected((prevMovies) => [...prevMovies, { ...movie, id }]);
  };
  
  const removeMovie = (id) => {
    setMoviesSelected((prevMoviesSelected) => prevMoviesSelected.filter((movie) => movie.id !== id));
  };

  return { addToCart, movieSelected ,removeMovie,};
}

export default useCart;