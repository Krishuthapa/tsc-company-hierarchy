import { Employee } from "./EmployeeInterfaces";

import { hierarchyObject, initialHierarchy } from "./constants";

let id: number = 1;

/**
 * Gets the sub-ordinates for a given employee.
 *
 * @returns {Array}
 */
function getSubOrdinates(name: string, hierarchy: hierarchyObject) {
  const subOrdinateNames: Array<string> = hierarchy[name];

  if (subOrdinateNames && subOrdinateNames.length !== 0) {
    return subOrdinateNames.map((name: string) => {
      id += 1;

      const uniqueId = id;
      const subordinates = getSubOrdinates(name, hierarchy);

      const subOrdinateInfo: Employee = {
        name,
        uniqueId,
        subordinates
      };

      return subOrdinateInfo;
    });
  }

  return [];
}

export const ceo: Employee = {
  name: "Mark Zuckerberg",
  uniqueId: id,
  subordinates: getSubOrdinates("Mark ZuckerBerg", initialHierarchy)
};
