"use client";
import React, { useState, useEffect } from "react";
import {ShoppingCartOutlined} from "@ant-design/icons";
import { Button,Modal,Card, Pagination,Tooltip } from "antd";
import Image from "next/image";
import useCart from "../app/hooks/useCart";
import Link from "next/link";


export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [movieSelectedtohomePage, setMovieSelectedtohomePage] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [movies, setMovies] = useState([]);
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notFound, setNotFound] = useState(false);
  const { addToCart,movieSelected} = useCart();

    const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const getMoviebyName = async (name, page) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=486a8087c67c0efa61f4e0c29a18d028&query=${name}&page=${page}`
      );
      const data = await response.json();
      const results = data.results;

      setMovies(results);
      if (results.length === 0) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleMovieSelect = (movie) => {
    const existingMovieIndex = movieSelectedtohomePage.findIndex((m) => m.id === movie.id);

    if (existingMovieIndex !== -1) {
      const updatedMovieList = [...movieSelectedtohomePage];
      updatedMovieList[existingMovieIndex].quantity += 1;
      setMovieSelectedtohomePage(updatedMovieList);
    } else {
      setMovieSelectedtohomePage((prevMovies) => [
        ...prevMovies,
        { movie, id: movie.id, quantity: 1 },
      ]);
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleClick = (movie) => {
    addToCart(movie, movie.id);
    handleMovieSelect(movie);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      getMoviebyName(name, currentPage);
    }, 500); 

    return () => clearTimeout(timeout);
  }, [currentPage, name]);


  useEffect(() => {
    const newTotalPrice = movieSelectedtohomePage.reduce(
      (total, movie) => total + movie.quantity * 100, // Assuming each movie costs 100
      0
    );
    setTotalPrice(newTotalPrice);
  }, [movieSelectedtohomePage]);

  console.log("movie in CartModal", movieSelectedtohomePage);
  console.log("movieSelected in Movie List",movieSelected);


  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center ">
        <nav
          className="top-0 z-1 bg-slate-500 w-full mb-10 flex flex-row
        justify-between items-center p-5 "
        >
          <div className="text-white text-3xl">Movie IMDB APP</div>
          <Button
            className="bg-slate-100 text-slate-800 "
            shape="round"
            icon=<ShoppingCartOutlined />
            size="large"
            onClick={showModal}
          >
            Cart
          </Button>
          <Modal
            className="flex flex-col text-center"
            title="Movie Cart"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <ul className="text-xs flex flex-col ">
              {movieSelectedtohomePage.map((movie) => (
                <div key={movie.id}
                className="flex flex-col text-start border-x-0 bg-slate-50 mb-3 p-3">
                  <h2>{movie.movie.title}</h2>
                  <p>Quantity: {movie.quantity}</p>
                  <p>Total Price: ${movie.quantity * 100}</p>
                </div>
              ))}
              <p className="text-xl">Total Cart Price: ${totalPrice}</p>
            </ul>
          </Modal>
        </nav>
      {/* Search bar */}
        <div className="bg-slate-200 flex flex-col w-1/2 rounded-full ">
        <div className="text-white text-5xl text-center mt-5">Search Movie</div>
        <div className="flex flex-row m-5 px-5 justify-center">
          <input
            className="px-5 w-1/2 h-10 rounded-full text-sm  text-center focus:outline-none border border-gray-400"
            type="text"
            placeholder="Search movie here ... 🔎"
            value={name}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getMoviebyName(name, currentPage);
                setCurrentPage(1);
              }
            }}
          />
        </div>
      </div>
      {/* Movie list */}
      <div className="min-h-screen flex flex-col justify-center items-center">
        {Array.isArray(movies) && movies.length > 0 ? (
          <>
            <div className="flex flex-wrap">
              {movies.map((movie, index) => (
                <div
                  className="w-1/4 h-2/4 flex justify-center mt-5 mb-20"
                  key={index}
                >
                  <Card
                    title={
                      movie.title.length > 25
                        ? `${movie.title.slice(0, 25)}...`
                        : movie.title
                    }
                    bordered={false}
                    style={{
                      width: 300,
                      height: 400,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 10px",
                    }}
                  >
                    <div className="flex justify-center ">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        alt={movie.title}
                        width="100"
                        height="100"
                      />
                    </div>
                    <p className="text-xs text-center py-1">
                      Popularity: {movie.popularity}
                    </p>
                    <p className="text-xs text-center py-1 ">
                      Release Date: {movie.release_date}
                    </p>
                    <p className="text-xs text-center py-1 mb-5">
                      Vote Average: {movie.vote_average}
                    </p>
                    <div className="flex flex-row justify-center space-x-4 
                    ">
                      <Button
                        className="w-1/2 h-10 rounded-full text-sm  text-center focus:outline-none border border-gray-400 "
                        type="secondary"
                      >
                        <Link
                          href={`/moviedetail/${movie.id}`}
                          as={`/moviedetail/${movie.id}`}
                        >
                          Detail
                        </Link>
                      </Button>
                      <Tooltip title="Add to Cart">
                        <Button
                          className="mt-1 hover:bg-slate-400"
                          type="dashed"
                          shape="circle"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => handleClick(movie)}
                        />
                      </Tooltip>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-5">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={movies.length}
                onChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="text-center text-2xl mt-5">
            {notFound ? "Not found what you find 🙇🏻‍♂️ " : ""}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
