// AP Art History Content Areas (Units 1-10)
export const contentAreas = {
  1: "Global Prehistory",
  2: "Ancient Mediterranean",
  3: "Early Europe and Colonial Americas",
  4: "Later Europe and Americas",
  5: "Indigenous Americas",
  6: "Africa",
  7: "West and Central Asia",
  8: "South, East, and Southeast Asia",
  9: "The Pacific",
  10: "Global Contemporary"
};

export const getContentAreaName = (unitNumber) => {
  return contentAreas[unitNumber] || `Unit ${unitNumber}`;
};

// Resolve a unit filter key ("unit3") to its label using the canonical map
// above, so the gallery filter UI never drifts from the rest of the app.
export const getContentAreaNameByKey = (unitKey: string): string => {
  const unitNumber = Number(unitKey.replace("unit", ""));
  return contentAreas[unitNumber] || unitKey.replace("unit", "Unit ");
};
