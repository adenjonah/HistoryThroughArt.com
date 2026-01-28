import React, { useEffect, useState } from "react";
import Card from "./ArtCard";
import JSZip from "jszip";
import { useArtworks } from "../../hooks/useSanityData";

// Extract first year from a date string for sorting
const extractYear = (dateString) => {
  return parseInt(dateString.split("/")[0].split("~")[0].trim());
};

// Extract all years from a date string (handles ranges like "-1500/-1400" or "1500/1510")
const extractAllYears = (dateString) => {
  const matches = dateString.match(/-?\d+/g);
  return matches ? matches.map((y) => Math.abs(parseInt(y))) : [];
};

// Calculate relevance score for smart search ranking
const calculateRelevanceScore = (item, searchTerm) => {
  if (!searchTerm) return 0;

  const term = searchTerm.toLowerCase().trim();
  const termAsNumber = parseInt(term, 10);
  const isNumericSearch = !isNaN(termAsNumber);
  let score = 0;

  // Priority 1: Exact ID match (highest priority)
  if (isNumericSearch && item.id === termAsNumber) {
    score += 10000;
  }
  // Priority 2: ID starts with search term
  else if (isNumericSearch && item.id.toString().startsWith(term)) {
    score += 5000;
  }
  // Priority 3: ID contains search term
  else if (item.id.toString().includes(term)) {
    score += 2000;
  }

  // Priority 4: Name starts with search term (case insensitive)
  const nameLower = item.name.toLowerCase();
  if (nameLower.startsWith(term)) {
    score += 1500;
  }
  // Priority 5: Name contains search term as a word boundary
  else if (nameLower.includes(` ${term}`) || nameLower.includes(`${term} `)) {
    score += 1000;
  }
  // Priority 6: Name contains search term anywhere
  else if (nameLower.includes(term)) {
    score += 500;
  }

  // Priority 7: Year/date matches (for numeric searches)
  if (isNumericSearch) {
    const years = extractAllYears(item.date);
    // Exact year match
    if (years.includes(termAsNumber)) {
      score += 400;
    }
    // Year starts with term (e.g., "15" matches 1500, 1510, etc.)
    else if (years.some((y) => y.toString().startsWith(term))) {
      score += 300;
    }
    // Year contains term
    else if (years.some((y) => y.toString().includes(term))) {
      score += 200;
    }
  }

  // Priority 8: Location match
  const locationLower = (item.location || "").toLowerCase();
  if (locationLower.startsWith(term)) {
    score += 150;
  } else if (locationLower.includes(term)) {
    score += 100;
  }

  // Priority 9: Artist/culture match
  const artistLower = (item.artist_culture || "").toLowerCase();
  if (artistLower.startsWith(term)) {
    score += 80;
  } else if (artistLower.includes(term)) {
    score += 50;
  }

  // Priority 10: Materials match
  const materialsLower = (item.materials || "").toLowerCase();
  if (materialsLower.includes(term)) {
    score += 30;
  }

  // Priority 11: Museum match
  const museumLower = (item.museum || "").toLowerCase();
  if (museumLower.includes(term)) {
    score += 20;
  }

  // Priority 12: Transcript match (lowest priority - fallback search)
  if (item.transcript && score === 0) {
    try {
      const transcriptText = item.transcript
        .map((t) => JSON.parse(t))
        .flat()
        .map((segment) => segment.text)
        .join(" ")
        .toLowerCase();
      if (transcriptText.includes(term)) {
        score += 10;
      }
    } catch (e) {
      // Skip if transcript parsing fails
    }
  }

  return score;
};

function Catalog({ search, setArtPiecesArray, layout, sort, unitFilters }) {
  const [currPageNumber, setCurrPageNumber] = useState(1);
  const [fullArtPiecesArray, setFullArtPiecesArray] = useState([]);
  const [artPiecesArray, setLocalArtPiecesArray] = useState([]);

  // Fetch artworks from Sanity CMS
  const { artworks: artPiecesData, loading, error } = useArtworks();

  // Get image path - now images are direct URLs from Sanity
  const getImagePath = (imageUrl) => {
    // If it's already a URL (from Sanity), return it directly
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return imageUrl || "";
  };

  // Initialize art pieces data when loaded from Sanity
  useEffect(() => {
    if (artPiecesData.length > 0) {
      setFullArtPiecesArray(artPiecesData);
      setLocalArtPiecesArray(artPiecesData);
    }
  }, [artPiecesData]);

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
    // O(1) access of the index of the art piece in the korusArray
    const korusMap = new Map(korusArray.map((id, index) => [id, index]));

    // Calculate relevance scores for all items when there's a search term
    const itemsWithScores = fullArtPiecesArray.map((item) => ({
      ...item,
      relevanceScore: search ? calculateRelevanceScore(item, search) : 0,
    }));

    let filteredArtPieces = itemsWithScores
      .filter((item) => {
        // If no search term, show all
        if (!search) return true;

        // Only show items with a relevance score > 0
        return item.relevanceScore > 0;
      })
      .sort((a, b) => {
        // When searching and sort is "Relevance" (or default), sort by relevance score
        if (search && (sort === "Relevance" || sort === "ID Ascending")) {
          const scoreDiff = b.relevanceScore - a.relevanceScore;
          if (scoreDiff !== 0) return scoreDiff;
          // Secondary sort by ID for items with same relevance
          return a.id - b.id;
        }

        switch (sort) {
          case "Name Descending":
            return b.name.localeCompare(a.name);
          case "Name Ascending":
            return a.name.localeCompare(b.name);
          case "Unit Descending":
          case "Content Area Descending":
            return b.unit - a.unit;
          case "Unit Ascending":
          case "Content Area Ascending":
            return a.unit - b.unit;
          case "ID Descending":
            return b.id - a.id;
          case "ID Ascending":
            return a.id - b.id;
          case "Date Descending":
            return extractYear(b.date) - Math.abs(extractYear(a.date));
          case "Date Ascending":
            return Math.abs(extractYear(a.date)) - extractYear(b.date);
          case "Korus Sort":
            return korusMap.get(a.id) - korusMap.get(b.id);
          case "Relevance":
            // When no search, relevance sort falls back to ID
            return a.id - b.id;
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
  }, [search, sort, unitFilters, fullArtPiecesArray, currPageNumber, setArtPiecesArray]);

  // Changes the page number
  const handlePageClick = (pageNum) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrPageNumber(pageNum);
  };

  const itemsPerPage = 50;
  const startIndex = (currPageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArtPieces = artPiecesArray.slice(startIndex, endIndex);
  const totalPages = Math.ceil(artPiecesArray.length / itemsPerPage);

  const handleDownloadAllArtworks = async () => {
    const zip = new JSZip();
    let totalImages = 0;
    let processedImages = 0;

    // Create a status message element
    const statusElement = document.createElement("div");
    statusElement.className =
      "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] w-[90%] max-w-[300px] text-center p-4 sm:p-6 bg-[var(--foreground-color)] rounded-xl shadow-xl";
    document.body.appendChild(statusElement);
    statusElement.innerHTML =
      '<p class="text-[var(--text-color)]">Preparing to download all images...</p>';

    try {
      // Count total images first
      artPiecesData.forEach((artPiece) => {
        if (artPiece.image && Array.isArray(artPiece.image)) {
          totalImages += artPiece.image.length;
        }
      });

      statusElement.innerHTML = `<p class="text-[var(--text-color)]">Starting download of ${totalImages} images...</p>`;

      // Process each artwork
      for (const artPiece of artPiecesData) {
        if (
          !artPiece.image ||
          !Array.isArray(artPiece.image) ||
          artPiece.image.length === 0
        ) {
          continue;
        }

        // Create a folder for each artwork
        const folderName = `${artPiece.id}_${artPiece.name.replace(
          /[^\w\s]/gi,
          ""
        )}`;

        // Process each image for this artwork
        for (const imageName of artPiece.image) {
          if (!imageName) continue;

          const imagePath = getImagePath(imageName);
          if (!imagePath) continue;

          try {
            const response = await fetch(imagePath);
            const blob = await response.blob();
            zip.file(`${folderName}/${imageName}`, blob);

            processedImages++;
            statusElement.innerHTML = `<p class="text-[var(--text-color)]">Downloaded ${processedImages} of ${totalImages} images...</p>`;
          } catch (error) {
            console.error(`Failed to fetch image ${imageName}:`, error);
          }
        }
      }

      statusElement.innerHTML =
        '<p class="text-[var(--text-color)]">Creating ZIP file...</p>';

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Create a download link for the zip file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = "all_artwork_images.zip";
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      statusElement.innerHTML =
        '<p class="text-[var(--text-color)]">Download complete!</p>';

      // Remove status element after a short delay
      setTimeout(() => {
        document.body.removeChild(statusElement);
      }, 3000);
    } catch (error) {
      console.error("Failed to create ZIP file:", error);
      statusElement.innerHTML = `<p class="text-red-400">Error: ${error.message}</p>`;

      // Remove status element after a longer delay for error messages
      setTimeout(() => {
        document.body.removeChild(statusElement);
      }, 5000);
    }
  };

  // Create image object for lazy loading
  const getImage = (item) => {
    if (!item.image || !item.image[0]) return null;
    const img = new Image();
    img.src = getImagePath(item.image[0]);
    return img;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-pulse text-lg text-[var(--text-color)]">
            Loading artworks...
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-lg text-red-500">
            Failed to load artworks. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Result count display - light text on dark bg for contrast */}
      <div className="flex items-center justify-between mb-4 px-2">
        <p className="text-sm text-[var(--text-color)]">
          Showing {currentArtPieces.length} of {artPiecesArray.length} artworks
          {artPiecesArray.length !== artPiecesData.length && (
            <span> (filtered from {artPiecesData.length} total)</span>
          )}
        </p>
      </div>

      {/* Art cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {currentArtPieces.map((item) => (
          <Card
            key={item.id}
            item={item}
            layout={layout}
            image={getImage(item)}
            search={search.toLowerCase()}
          />
        ))}
        {artPiecesArray.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[var(--text-color)] mb-2">
              No artworks found
            </h3>
            <p className="text-[var(--text-color)] max-w-md">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-2 mt-8 flex-wrap"
          aria-label="Pagination"
        >
          {[...Array(totalPages).keys()].map((pageNum) => {
            const isActive = currPageNumber === pageNum + 1;
            return (
              <button
                key={pageNum}
                className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg font-medium transition-colors
                           focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:ring-offset-2
                           ${
                             isActive
                               ? "bg-[var(--button-color)] text-[var(--button-text-color)]"
                               : "bg-[var(--accent-color)]/30 text-[var(--text-color)] hover:bg-[var(--accent-color)]/50"
                           }`}
                onClick={() => handlePageClick(pageNum + 1)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${pageNum + 1}`}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </nav>
      )}

      {/* Download all button */}
      <div className="flex flex-col items-center justify-center py-8">
        <button
          className="px-6 py-3 bg-[var(--button-color)] text-[var(--button-text-color)]
                     rounded-lg font-medium text-lg
                     hover:bg-[var(--accent-color)] hover:text-[var(--text-color)]
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:ring-offset-2"
          onClick={handleDownloadAllArtworks}
        >
          Download All Artwork Images as ZIP
        </button>
        <p className="text-sm text-[var(--text-color)] mt-2">
          This will download all images from all {artPiecesData.length}{" "}
          artworks.
        </p>
      </div>
    </div>
  );
}

export default Catalog;
