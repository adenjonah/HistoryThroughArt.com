import React, { useEffect, useState } from "react";
import Card from "./ArtCard";
import "./Catalog.css";
import artPiecesData from "../../data/artworks.json";
const images = require.context("../../artImages", false, /\.webp$/);

function Catalog({
  search,
  setArtPiecesArray,
  layout,
  sort,
  unitFilters,
  searchBy,
}) {
  const [currPageNumber, setCurrPageNumber] = useState(1);
  const [fullArtPiecesArray, setFullArtPiecesArray] = useState([]);
  const [artPiecesArray, setLocalArtPiecesArray] = useState([]);
  const [preloadedImages, setPreloadedImages] = useState([]);

  const getImagePath = (imageName) => {
    try {
      return images(`./${imageName}`);
    } catch (e) {
      console.error(`Cannot find image: ${imageName}`);
      return "";
    }
  };
  useEffect(() => {
    const preloadImages = () => {
      const image = artPiecesData.map((item) => {
        const img = new Image();
        img.src = getImagePath(item.image[0]);
        return img;
      });
      setPreloadedImages(image);
    };

    preloadImages();
    setFullArtPiecesArray(artPiecesData);
    setLocalArtPiecesArray(artPiecesData);
  }, []);

  const parseYear = (date) => {
    return date.replace(/[bce]/gi, "").trim();
  };
  const extractYear = (dateString) => {
    return parseInt(dateString.split("/")[0].split("~")[0].trim());
  };

  useEffect(() => {
    const korusArray = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 19, 25, 30, 13, 15, 17, 18,
      20, 21, 22, 23, 24, 26, 27, 28, 33, 34, 35, 36, 37, 38, 41, 29, 31, 32,
      39, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 58, 59,
      60, 61, 62, 64, 63, 67, 69, 70, 71, 72, 73, 76, 75, 80, 78, 66, 68, 74,
      77, 79, 83, 82, 85, 86, 87, 88, 89, 91, 92, 93, 96, 98, 153, 159, 160,
      161, 162, 155, 157, 158, 154, 156, 163, 164, 165, 166, 81, 90, 94, 95, 97,
      99, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
      213, 217, 221, 218, 214, 215, 216, 219, 220, 222, 223, 181, 183, 185, 186,
      187, 56, 57, 65, 188, 189, 190, 191, 208, 209, 84, 202, 200, 192, 199,
      182, 198, 184, 195, 197, 207, 193, 194, 201, 204, 206, 212, 205, 196, 203,
      210, 211, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 110,
      114, 117, 127, 113, 116, 118, 115, 119, 120, 121, 122, 123, 124, 125, 126,
      128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
      143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 224, 225, 226, 227, 228,
      229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243,
      244, 245, 246, 247, 248, 249, 250,
    ];
    //Allows for O(1) access of the index of the art piece in the korusArray
    const korusMap = new Map(korusArray.map((id, index) => [id, index]));

    let filteredArtPieces = fullArtPiecesArray
      .filter((item) => {
        //Gets the transcript from each available video
        //and fetches only the text and puts it into the transcriptText
        let transcriptText = "";
        if (item.transcript) {
          const tempArr = item.transcript.map((x) => JSON.parse(x));
          transcriptText = tempArr.map((x) => x.map((y) => y.text)).join(" ");
        }

        //Checks the string for the search key
        const checkIncludes = (item, date) => {
          if (!date) {
            return item.toString().toLowerCase().includes(search.toLowerCase());
          } else {
            //Need to parse the year from item.date
            return item
              .toString()
              .toLowerCase()
              .includes(parseYear(search.toLowerCase()));
          }
        };

        switch (searchBy) {
          case "name":
            return checkIncludes(item.name);
          case "id":
            return checkIncludes(item.id);
          case "artist/culture":
            return checkIncludes(item.artist_culture);
          case "medium":
            return checkIncludes(item.materials);
          case "year":
            return checkIncludes(item.date, 1);
          case "location":
            return checkIncludes(item.location);
          case "transcript":
            return item.transcript && checkIncludes(transcriptText);
          default:
            return (
              checkIncludes(item.name) ||
              checkIncludes(item.id) ||
              checkIncludes(item.artist_culture) ||
              checkIncludes(item.date, 1) ||
              checkIncludes(item.materials) ||
              checkIncludes(item.location) ||
              (item.transcript && checkIncludes(transcriptText))
            );
        }
      })
      .sort((a, b) => {
        switch (sort) {
          case "Name Descending":
            return b.name.localeCompare(a.name);
          case "Name Ascending":
            return a.name.localeCompare(b.name);
          case "Unit Descending":
            return b.unit - a.unit;
          case "Unit Ascending":
            return a.unit - b.unit;
          case "ID Descending":
            return b.id - a.id;
          case "ID Ascending":
            return a.id - b.id;
          case "Date Descending":
            return extractYear(b.date) - Math.abs(extractYear(a.date)); //Funky math stuff
          case "Date Ascending":
            return Math.abs(extractYear(a.date)) - extractYear(b.date);
          case "Korus Sort":
            return korusMap.get(a.id) - korusMap.get(b.id); //Sort by the order Korus teaches the art pieces
          default:
            return a.id - b.id;
        }
      });

    if (!Object.values(unitFilters).every((value) => !value)) {
      filteredArtPieces = filteredArtPieces.filter(
        (item) => unitFilters[`unit${item.unit}`]
      );
    }

    setLocalArtPiecesArray(filteredArtPieces);
    setArtPiecesArray(filteredArtPieces);

    if (currPageNumber > Math.ceil(filteredArtPieces.length / itemsPerPage)) {
      setCurrPageNumber(1);
    }
  }, [
    search,
    sort,
    unitFilters,
    fullArtPiecesArray,
    currPageNumber,
    setArtPiecesArray,
    searchBy,
  ]);

  //Changes the page number
  const handlePageClick = (pageNum) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrPageNumber(pageNum);
  };

  const itemsPerPage = 50;
  const startIndex = (currPageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArtPieces = artPiecesArray.slice(startIndex, endIndex);

  //Passes the image index to the Card component
  return (
    <div>
      <div className="w3-row-padding">
        {currentArtPieces.map((item, index) => (
          <div key={index} className="w3-col s12 m6 l4">
            <Card
              item={item}
              layout={layout}
              image={preloadedImages[item.id - 1]}
              search={search.toLowerCase()}
            />
          </div>
        ))}
        {artPiecesArray.length === 0 && (
          <p className={`blurb`}>No results found</p>
        )}
      </div>
      <div className="w3-bar">
        {[...Array(Math.ceil(artPiecesArray.length / itemsPerPage)).keys()].map(
          (pageNum) => (
            <a
              key={pageNum}
              href={`#${pageNum + 1}`}
              className={`w3-button w3-margin-left ${
                currPageNumber === pageNum + 1 ? "w3-blue" : "w3-light-gray"
              }`}
              onClick={() => handlePageClick(pageNum + 1)}
            >
              {pageNum + 1}
            </a>
          )
        )}
      </div>
      <br />
    </div>
  );
}

export default Catalog;
