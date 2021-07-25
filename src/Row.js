import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import instance from "./axios";
import "./Row.css";

function Row({ title, fetchUrl, isLargeRow }) {
  const baseImgUrl = "https://image.tmdb.org/t/p/original";

  const [movies, setMovies] = useState([]);

  const [trailerUrl, setTrailerUrl] = useState("");

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    instance
      .get(fetchUrl)
      .then((res) => {
        // console.log(res.data.results);
        if (res.data.results !== undefined) {
          setMovies(res.data.results);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fetchUrl]);

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="row">
      {/* title */}
      <h2>{title}</h2>

      <div className="row_posters">
        {/* container->several_posters */}
        {movies.map((movie) =>
          movie.poster_path != null && movie.backdrop_path != null ? (
            <img
              onClick={() => handleClick(movie)}
              className={`row_poster ${isLargeRow && "row_posterLarge"}`}
              src={`  ${baseImgUrl}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
              key={movie.id}
            >
              {/* `${console.log(movie)}` */}
            </img>
          ) : (
            <div key={movie.id} />
          )
        )}
      </div>

      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
