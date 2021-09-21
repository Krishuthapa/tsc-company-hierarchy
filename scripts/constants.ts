export type hierarchyObject = {
  [key: string]: Array<string>;
};

/**
 * Holds the initial hierarchy pattern in the company.
 */
export const initialHierarchy: hierarchyObject = {
  "Mark ZuckerBerg": [
    "Sarah Donald",
    "Tyler Simpson",
    "Bruce Willis",
    "Georgina Flangy"
  ],
  "Sarah Donald": ["Cassandra Reynolds"],
  "Cassandra Reynolds": ["Mary Blue", "Bob Saget"],
  "Bob Saget": ["Tina Teff"],
  "Tina Teff": ["Will Turner"],
  "Tyler Simpson": ["Harry Tobs", "George Carrey", "Gary Styles"],
  "Harry Tobs": ["Thomas Brown"],
  "Georgina Flangy": ["Sophie Turner"]
};
