import React, { useState, useEffect } from "react";
import ControlBar from "./ControlBar/ControlBar";
import Catalog from "./Catalog";

function Museum() {
  const [search, setSearch] = useState("");
  const [artPiecesArray, setArtPiecesArray] = useState([]);
  const [layout, setLayout] = useState("table");
  const [sort, setSort] = useState(
    () => localStorage.getItem("sort") || "ID Ascending"
  );
  const [unitFilters, setUnitFilters] = useState(() => {
    const savedFilters = localStorage.getItem("unitFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
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

  // Save sort to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sort", sort);
  }, [sort]);

  // Save unitFilters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("unitFilters", JSON.stringify(unitFilters));
  }, [unitFilters]);

  return (
    <div className="min-h-screen bg-[var(--background-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-color)] text-center mb-6">
          Art Gallery
        </h1>

        {/* Control Bar */}
        <div className="mb-6">
          <ControlBar
            search={search}
            setSearch={setSearch}
            layout={layout}
            setLayout={setLayout}
            setSort={setSort}
            sort={sort}
            unitFilters={unitFilters}
            setUnitFilters={setUnitFilters}
          />
        </div>

        {/* Catalog */}
        <Catalog
          artPiecesArray={artPiecesArray}
          search={search}
          setArtPiecesArray={setArtPiecesArray}
          layout={layout}
          sort={sort}
          unitFilters={unitFilters}
        />
      </div>
    </div>
  );
}

export default Museum;
