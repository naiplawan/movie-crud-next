import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function MovieDetail({ movie }) {
  const { id } = movie;
  const image = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  const [movieDetails, setMovieDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}?api_key=486a8087c67c0efa61f4e0c29a18d028`)
      .then((response) => {
        const movieData = response.data;
        setMovieDetails(movieData);
      })
      .catch((error) => {
        setError("An error occurred while fetching movie data: " + error.message);
      });
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="bg-slate-200 flex flex-col">
        <div className="text-2xl text-center mt-5">Movie Detail</div>
        <div className="flex flex-row m-5 px-5">
          <Image src={image} alt="poster" width={200} height={300} />
          <div className="flex flex-col ml-5">
            <div className="text-2xl">{movie.title}</div>
            <div className="text-xl">{movie.overview}</div>
            <div className="text-xl">Release Date: {movie.release_date}</div>
            <div className="text-xl">Vote Average: {movie.vote_average}</div>
            {movieDetails && (
              <>
                <div className="text-xl">Original Title: {movieDetails.original_title}</div>
                <div className="text-xl">Original Language: {movieDetails.original_language}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
