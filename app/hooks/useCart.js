import { useState } from 'react';

function useCart() {
  const [movieSelected, setMoviesSelected] = useState([]);

  const addToCart = (movie, id) => {
    setMoviesSelected((prevMovies) => [...prevMovies, { ...movie, id }]);
  };
  

  const removeMovie = (id) => {
    setMoviesSelected((prevMoviesSelected) => prevMoviesSelected.filter((movie) => movie.id !== id));
  };

  const clearCart = () => {
    setMoviesSelected([]);
  };


  const price = 100;


  return { addToCart, movieSelected ,price,removeMovie,clearCart};
}

export default useCart;