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
