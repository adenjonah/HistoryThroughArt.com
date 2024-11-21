import React, { useState } from "react";
import ControlBar from "./ControlBar/ControlBar";
import "./ArtGallery.css";
import Catalog from "./Catalog";

function Museum() {
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [artPiecesArray, setArtPiecesArray] = useState([]);
  const [layout, setLayout] = useState("table");
  const [sort, setSort] = useState("ID Ascending");
  const [unitFilters, setUnitFilters] = useState({
    unit1: false,
    unit2: false,
    unit3: false,
    unit4: false,
    unit5: false,
    unit6: false,
    unit7: false,
    unit8: false,
  });

  return (
    <div>
      <h1 className="title">Art Gallery</h1>
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
