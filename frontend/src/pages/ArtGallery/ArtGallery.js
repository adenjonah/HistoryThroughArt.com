import React, { useState, useEffect } from "react";
import ControlBar from "./ControlBar/ControlBar";
import "./ArtGallery.css";
import Catalog from "./Catalog";

function Museum() {
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [artPiecesArray, setArtPiecesArray] = useState([]);
  const [layout, setLayout] = useState("table");
  const [sort, setSort] = useState(
    () => localStorage.getItem("sort") || "ID Ascending"
  ); // Load saved sort preference
  const [unitFilters, setUnitFilters] = useState(() => {
    // Load saved filters or initialize with defaults
    const savedFilters = localStorage.getItem("unitFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          // All content areas disabled by default
          unit1: false,
          unit2: false,
          unit3: false,
          unit4: false,
          unit5: false,
          unit6: false,
          unit7: false,
          unit8: false,
          unit9: false,
          unit10: false,
        };
  });

  // Save `sort` to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sort", sort);
  }, [sort]);

  // Save `unitFilters` to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("unitFilters", JSON.stringify(unitFilters));
  }, [unitFilters]);

  return (
    <div>
      <h1 className="title w3-center">Art Gallery</h1>
      <div className="contentBox w3-center">
        <ControlBar
          search={search}
          searchBy={searchBy}
          setSearch={setSearch}
          setSearchBy={setSearchBy}
          layout={layout}
          setLayout={setLayout}
          setSort={setSort}
          sort={sort}
          unitFilters={unitFilters}
          setUnitFilters={setUnitFilters}
        />
        <Catalog
          className={"catalog"}
          artPiecesArray={artPiecesArray}
          search={search}
          setArtPiecesArray={setArtPiecesArray}
          layout={layout}
          sort={sort}
          unitFilters={unitFilters}
          searchBy={searchBy}
        />
      </div>
    </div>
  );
}

export default Museum;