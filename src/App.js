import React, { useEffect, useState } from "react";
import { getImages, searchImages } from "./api";
import "./App.css";

function App() {
  const [image, setImage] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const responseJson = await getImages();
      setImage(responseJson.resources);
      setNextCursor(responseJson.next_cursor);
    };
    fetchData();
  }, []);

  const handleLoadMoreButtonClicked = async () => {
    const responseJson = await getImages(nextCursor);
    setImage((currentImageList) => [
      ...currentImageList,
      ...responseJson.resources,
    ]);
    setNextCursor(responseJson.next_cursor);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const responseJson = await searchImages(searchValue, nextCursor);
    setImage(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
  };

  const resetForm = async () => {
    const responseJson = await getImages();
    setImage(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
    setSearchValue("");
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          required="required"
          placeholder="Enter a search value..."
        ></input>
        <button type="submit">Search</button>
        <button type="button" onClick={resetForm}>
          Clear
        </button>
      </form>
      <div className="image-grid">
        {image.map((image) => (
          <img src={image.url} alt={image.public_id}></img>
        ))}
      </div>
      <div className="footer">
        {nextCursor && (
          <button onClick={handleLoadMoreButtonClicked}>Load More</button>
        )}
      </div>
    </>
  );
}

export default App;
