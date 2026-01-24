import { korusOrder } from "../../data/korusOrder";

// Format date to YYYY-MM-DD for input elements
export const formatDateForInput = (date) => {
  const d = new Date(date);
  const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0];
};

// Convert date string to BCE/CE format
export const formatDateDisplay = (dateStr) => {
  const parts = dateStr.split("/");
  if (parts.length === 2) {
    const start = parts[0].startsWith("-")
      ? parts[0].slice(1) + " BCE"
      : parts[0] + " CE";
    const end = parts[1].startsWith("-")
      ? parts[1].slice(1) + " BCE"
      : parts[1] + " CE";
    return `${start} - ${end}`;
  }
  return parts[0].startsWith("-")
    ? parts[0].slice(1) + " BCE"
    : parts[0] + " CE";
};

// Get the current academic year start (September)
// Academic year runs Sep-May, so:
// - If current month is Sep-Dec, academic year started this calendar year
// - If current month is Jan-Aug, academic year started last calendar year
export const getCurrentAcademicYear = () => {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed (0 = Jan, 8 = Sep)
  const year = now.getFullYear();

  // If September (8) through December (11), we're in fall of current year
  // If January (0) through August (7), academic year started previous year
  return month >= 8 ? year : year - 1;
};

// Convert month-day string to full date with correct academic year
// Format: "M-D" (e.g., "9-3" for September 3)
export const getAcademicDate = (monthDayStr) => {
  const parts = monthDayStr.split("-");
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);

  const academicYearStart = getCurrentAcademicYear();

  // Fall semester (Sep-Dec) uses the academic year start
  // Spring semester (Jan-May) uses academic year start + 1
  const year = month >= 9 ? academicYearStart : academicYearStart + 1;

  return new Date(year, month - 1, day); // month is 0-indexed in Date
};

// Create due dates map from assignments data
// Now handles month-day format and calculates year automatically
export const createDueDatesMap = (dueDatesData) => {
  const map = new Map();
  dueDatesData.assignments.forEach((assignment) => {
    const id = parseInt(assignment.id, 10);
    if (!isNaN(id)) {
      map.set(id, getAcademicDate(assignment.dueDate));
    }
  });
  return map;
};

// Get card IDs that are due by a specific date
export const getCardsDueByDate = (dueDatesMap, date) => {
  const cardIds = [];
  dueDatesMap.forEach((dueDate, id) => {
    if (dueDate <= date) {
      cardIds.push(id);
    }
  });
  return cardIds;
};

// Filter cards to only those in the Korus teaching order
export const filterByKorusOrder = (cardIds) => {
  const cardIdsSet = new Set(cardIds);
  return korusOrder.filter((id) => cardIdsSet.has(id));
};

// Build a deck from artwork data based on filters
export const buildDeck = (artworks, options = {}) => {
  const {
    dueDatesMap,
    dueByDate = new Date(),
    selectedUnits = [],
    shouldShuffle = false
  } = options;

  // Get cards due by date
  const cardsDueByDate = getCardsDueByDate(dueDatesMap, dueByDate);

  // Filter to Korus order
  const cardsInOrder = filterByKorusOrder(cardsDueByDate);

  // Create artwork lookup map
  const artworksById = new Map(artworks.map((a) => [a.id, a]));

  // Build deck in Korus order, filtered by units
  let deck = [];
  for (const id of cardsInOrder) {
    const artwork = artworksById.get(id);
    if (artwork && (selectedUnits.length === 0 || selectedUnits.includes(artwork.unit))) {
      deck.push(artwork);
    }
  }

  // Shuffle if requested
  if (shouldShuffle) {
    deck = shuffleArray([...deck]);
  }

  return deck;
};

// Fisher-Yates shuffle
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// LocalStorage keys
const STORAGE_KEYS = {
  deck: "flashcards_deck",
  currentCard: "flashcards_currentCard",
  selectedUnits: "flashcards_selectedUnits",
  dueDate: "flashcards_displayCardsDueBy",
  isShuffled: "flashcards_isShuffled",
  hasSeenInstructions: "flashcards_hasSeenSwipeInstructions",
};

// Save flashcard state to localStorage
export const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEYS.deck, JSON.stringify(state.deck));
    localStorage.setItem(STORAGE_KEYS.currentCard, state.currentCard.toString());
    localStorage.setItem(STORAGE_KEYS.selectedUnits, JSON.stringify(state.selectedUnits));
    localStorage.setItem(STORAGE_KEYS.dueDate, state.dueDate.toISOString());
    localStorage.setItem(STORAGE_KEYS.isShuffled, JSON.stringify(state.isShuffled));
  } catch (error) {
    console.error("Error saving flashcard state:", error);
  }
};

// Load flashcard state from localStorage
export const loadState = () => {
  try {
    const deck = JSON.parse(localStorage.getItem(STORAGE_KEYS.deck) || "[]");
    const currentCard = parseInt(localStorage.getItem(STORAGE_KEYS.currentCard) || "0", 10);
    const selectedUnits = JSON.parse(localStorage.getItem(STORAGE_KEYS.selectedUnits) || "[]");
    const dueDateStr = localStorage.getItem(STORAGE_KEYS.dueDate);
    const dueDate = dueDateStr ? new Date(dueDateStr) : new Date();
    const isShuffled = JSON.parse(localStorage.getItem(STORAGE_KEYS.isShuffled) || "false");

    return {
      deck: Array.isArray(deck) ? deck : [],
      currentCard: isNaN(currentCard) ? 0 : currentCard,
      selectedUnits: Array.isArray(selectedUnits) ? selectedUnits : [],
      dueDate,
      isShuffled,
    };
  } catch (error) {
    console.error("Error loading flashcard state:", error);
    return null;
  }
};

// Clear deck from localStorage (keep preferences)
export const clearDeckStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.deck);
  localStorage.removeItem(STORAGE_KEYS.currentCard);
};

// Check if user has seen swipe instructions
export const hasSeenSwipeInstructions = () => {
  return localStorage.getItem(STORAGE_KEYS.hasSeenInstructions) === "true";
};

// Mark swipe instructions as seen
export const markSwipeInstructionsSeen = () => {
  localStorage.setItem(STORAGE_KEYS.hasSeenInstructions, "true");
};
