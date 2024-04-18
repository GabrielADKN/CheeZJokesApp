import React, { useEffect, useCallback } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";
import useStateHooks from "./hooks/useStateHooks";

/** List of jokes as a functional component */

function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useStateHooks([]);
  const [isLoading, setIsLoading] = useStateHooks(true);

  const getJokes = useCallback(async () => {
    try {
      let newJokes = [];
      let seenJokes = new Set();

      while (newJokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let joke = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          newJokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }

      setJokes(newJokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [numJokesToGet]);

  useEffect(() => {
    if (isLoading) getJokes();
  }, [isLoading, getJokes]);

  const generateNewJokes = () => {
    setJokes([]);
    setIsLoading(true);
  };

  const vote = (id, delta) => {
    setJokes((jokes) =>
      jokes.map((joke) =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      )
    );
  };

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>
      {sortedJokes.map((j) => (
        <Joke key={j.id} id={j.id} text={j.joke} votes={j.votes} vote={vote} />
      ))}
    </div>
  );
}

export default JokeList;
