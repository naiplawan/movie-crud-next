"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Card,
  Pagination,
  Tooltip,
  Popover,
  Space,
  Statistic,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import Image from "next/image";
import useCart from "../app/hooks/useCart";
import QRCode from "qrcode.react";
import { motion } from 'framer-motion';



export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movieSelectedtohomePage, setMovieSelectedtohomePage] = useState(() => {
    if (typeof window !== "undefined") {
      const storedMovieList = localStorage.getItem("movieList");
      return storedMovieList ? JSON.parse(storedMovieList) : [];
    }
    return [];
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [movies, setMovies] = useState([]);
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [notFound, setNotFound] = useState(false);
  const { addToCart, movieSelected } = useCart();
  const { Countdown } = Statistic;
  const deadline = Date.now() + 1000 * 60; //

  const showModal = () => {
    setOpen(true);
  };

  const onFinish = () => {
    Modal.destroyAll();
    message.success("Time Up!");
  };

  const content = (movie) => (
    <div className="flex flex-col p-3">
      {movie && (
        <div className="text-start">
          <p className="font-serif text-xs">{movie.overview}</p>
          <p>{movie.genres}</p>
        </div>
      )}
    </div>
  );

  const getMoviebyName = async (name, page) => {
    const input = name.trim();
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=486a8087c67c0efa61f4e0c29a18d028&query=${name}&page=${page}`
      );
      const data = await response.json();
      const results = data.results;

      setMovies(results);
      if (input && results.length === 0) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 5000); // delay setting isLoading to false by 5 seconds
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setName(event.target.value);
  };

  const handleMovieSelect = (movie) => {
    const existingMovieIndex = movieSelectedtohomePage.findIndex(
      (m) => m.id === movie.id
    );

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

  const clearCart = () => {
    setMovieSelectedtohomePage([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setCurrentPage(current);
    setPageSize(size);
  };

  const handleClick = (movie) => {
    addToCart(movie, movie.id);
    handleMovieSelect(movie);
  };

  const handleRemoveMovie = (index) => {
    const updatedMovieList = [...movieSelectedtohomePage];
    updatedMovieList.splice(index, 1);
    setMovieSelectedtohomePage(updatedMovieList);
  };

  const clickOrder = () => {
    const content = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <QRCode value="https://github.com/naiplawan" />
        <Row gutter={20}>
          <Col span={20}>
            <Countdown title="Countdown" value={deadline} onFinish={onFinish} />
          </Col>
          <Button onClick={() => modal.destroy()}>Close</Button>
        </Row>
      </div>
    );

    const modal = Modal.info({
      title: "Scan to complete your order",
      content: content,
      okButtonProps: { style: { display: "none" } }, // Hide the OK button
      cancelButtonProps: { style: { display: "none" } }, // Hide the Cancel button
    });
  };

  // Fetch movie by name
  useEffect(() => {
    const timeout = setTimeout(() => {
      getMoviebyName(name, currentPage);
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentPage, name]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/157336?api_key=486a8087c67c0efa61f4e0c29a18d028"
        );
        const data = await response.json();
        setMovies([data]); // set the movie data as an array
        console.log("Data Movie first fetch", data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };

    fetchMovie();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "movieSelectedtohomePage",
        JSON.stringify(movieSelectedtohomePage)
      );
    }
  }, [movieSelectedtohomePage]);

  // Calculate total price and discount function
  useEffect(() => {
    const movieCount = movieSelectedtohomePage.length;
    const basePrice = movieCount * 100;
    const discount =
      movieCount > 5 ? basePrice * 0.2 : movieCount > 3 ? basePrice * 0.1 : 0;
    const newTotalPrice = basePrice - discount;
    setDiscount(discount);
    setTotalPrice(newTotalPrice);
  }, [movieSelectedtohomePage]);

  console.log("movie in CartModal", movieSelectedtohomePage);
  console.log("movieSelected in Movie List", movieSelected);
  console.log("Data Movie", movies);

  // Save movieSelectedtohomePage to localStorage
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(
        "movieSelectedtohomePage",
        JSON.stringify(movieSelectedtohomePage)
      );
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [movieSelectedtohomePage]);

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center ">
        <nav className="top-0 z-1 bg-slate-500 w-full  mb-10 flex flex-row
        justify-between items-center p-10 "
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
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
            footer={null}
            onCancel={() => setOpen(false)}
          >
            {movieSelectedtohomePage.length === 0 ? (
              <p className="text-xl">Empty Cart</p>
            ) : (
              <ul className="text-xs flex flex-col pb-2">
                {movieSelectedtohomePage.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex flex-col text-start border-x-0 bg-slate-50 mb-3 p-3 w-full rounded-xl"
                  >
                    <div className="flex flex-row justify-between items-center p-1">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.movie.poster_path}`}
                        alt={movie.title}
                        width="50"
                        height="50"
                        style={{ borderRadius: "10px" }}
                      />
                      <div className="m-2">
                        <p className="font-bold">
                          {movie.movie.title.slice(0, 15)}
                        </p>
                        <p>Quantity: {movie.quantity}</p>
                        <p>Price: ${movie.quantity * 100}</p>
                      </div>
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={handleRemoveMovie}
                      ></Button>
                    </div>
                  </div>
                ))}
                <p className="text-3xl">Total Cart Price: ${totalPrice}</p>
                {discount !== 0 && (
                  <p className="text-xs text-red-500">
                    Discount Price: ${discount}
                  </p>
                )}
              </ul>
            )}
            {movieSelectedtohomePage.length > 0 && (
              <div className="space-x-5">
                <Button
                  className="bg-slate-100 text-slate-800"
                  onClick={clickOrder}
                >
                  Order 🛒
                </Button>
                <Button
                  className="bg-slate-100 text-slate-800"
                  onClick={clearCart}
                >
                  Clear 🗑
                </Button>
              </div>
            )}
          </Modal>
        </nav>
        {/* Search bar */}
        <div className="bg-slate-200 flex flex-col w-1/2 rounded-3xl mb-5 ">
          <div className="text-white text-5xl text-center mt-5">
            Search Movie
          </div>
          <div className="flex flex-row m-5 px-5 justify-center">
            <input
              className="px-5 w-1/2 h-10 rounded-xl text-sm  text-center focus:outline-none border border-gray-400"
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
          {isLoading ? (
            <Spin size="large" />
          ) : Array.isArray(movies) && movies.length > 0 ? (
            <>
              <div className="flex flex-wrap">
                {movies.map((movie, index) => (
                  <motion.div
                    className="w-1/4 h-2/4 flex justify-center mt-5 m-5 mb-20"
                    key={index}
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px 2px #FFFFFF" }}
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
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center mt-5">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={movies.length}
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageSizeChange}
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
