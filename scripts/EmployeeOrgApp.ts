import { Employee, IEmployeeOrgApp } from "./EmployeeInterfaces";

import { ceo } from "./Employee";

/**
 * Class for the organization's employee hierarchy.
 */
class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: Employee;
  protected oldCeoHierarchy: Employee;

  constructor(ceo: Employee) {
    this.ceo = ceo;

    this.oldCeoHierarchy = ceo;
  }

  move(employeeID: number, supervisorID: number) {
    const { subordinates } = this.ceo;

    const hierarchyInfoAfterRemoval = this.getNewHierarchyWithRemovedEmployee(
      subordinates,
      employeeID
    );

    if (!hierarchyInfoAfterRemoval.removedEmployee) {
      console.error("Invalid Employee Id");

      return;
    }

    const employeeForAddtion = hierarchyInfoAfterRemoval.removedEmployee;
    const subordinatesForAddingEmployee =
      hierarchyInfoAfterRemoval.updatedSubordinates;

    const finalUpdatedHierarchy = this.getNewHierarchyAfterAddedEmployee(
      employeeForAddtion,
      subordinatesForAddingEmployee,
      supervisorID
    );

    if (!finalUpdatedHierarchy || finalUpdatedHierarchy.length === 0) {
      console.error("Invalid Supervisor Id");

      return;
    }

    this.oldCeoHierarchy = this.ceo;
    this.ceo = { ...this.ceo, subordinates: finalUpdatedHierarchy };
  }

  /**
   * Function to update the given heirarchy after removing the given employee and
   * return the updated hierarchy and removed employee info.
   *
   * @param subordinates
   * @param employeeID
   * @returns {Object}
   */
  protected getNewHierarchyWithRemovedEmployee(
    subordinates: Employee[],
    employeeID: number
  ) {
    let removedEmployee: Employee | undefined;
    let updatedSubordinates: Employee[] = subordinates;

    // Initially checking if the given list of subordinates holds the emolyee to be removed.

    const filteredSubordinate = subordinates.filter(
      (subordinate) => subordinate.uniqueId === employeeID
    )[0];

    if (filteredSubordinate) {
      removedEmployee = { ...filteredSubordinate, subordinates: [] };

      // Removes the subordinate with given id from the hierarchy and add its children to its parent's subordinates.
      updatedSubordinates = [
        ...subordinates,
        ...filteredSubordinate.subordinates
      ].filter((subordinate) => subordinate.uniqueId !== employeeID);

      return { removedEmployee, updatedSubordinates };
    }

    // If the given list doesnt have the employee to be remove we drill down further using DFS and recursion.

    for (let index = 0; index < subordinates.length; ++index) {
      let currentEmployee: Employee = subordinates[index];

      const hierarchyInfo = this.getNewHierarchyWithRemovedEmployee(
        subordinates[index].subordinates,
        employeeID
      );

      if (
        hierarchyInfo &&
        hierarchyInfo.removedEmployee &&
        hierarchyInfo.removedEmployee.uniqueId === employeeID
      ) {
        currentEmployee = {
          ...currentEmployee,
          subordinates: hierarchyInfo.updatedSubordinates
        };

        removedEmployee = hierarchyInfo.removedEmployee;

        updatedSubordinates = subordinates.map((subordinate) => {
          if (subordinate.uniqueId === currentEmployee.uniqueId) {
            return { ...currentEmployee };
          }

          return { ...subordinate };
        });

        break;
      }
    }

    return { removedEmployee, updatedSubordinates };
  }

  /**
   * Function adds the employee under the given supervisor id and
   * returns the updated subordinates hierarchy.
   *
   * @param employee
   * @param subordinates
   * @param supervisorID
   * @returns
   */
  protected getNewHierarchyAfterAddedEmployee(
    employee: Employee,
    subordinates: Employee[],
    supervisorID: number
  ) {
    let updatedSubordinates: Employee[] = [];

    /**
     * Filters the subordinates list to check if the given supervisor id is present
     * and adds the employee to its subordinate if found.
     */

    let filteredSubordinate = subordinates.filter(
      (subordinate) => subordinate.uniqueId === supervisorID
    )[0];

    if (filteredSubordinate) {
      filteredSubordinate = {
        ...filteredSubordinate,
        subordinates: [...filteredSubordinate.subordinates, employee]
      };

      updatedSubordinates = subordinates.map((subordinate) => {
        if (subordinate.uniqueId === supervisorID) {
          return { ...filteredSubordinate };
        }

        return { ...subordinate };
      });

      return updatedSubordinates;
    }

    // Recursively does the DFS to check for the given supervisor and add employee to its sub ordinates.

    for (let index = 0; index < subordinates.length; ++index) {
      let currentEmployee: Employee = subordinates[index];

      const newSubordinatesForEmployee = this.getNewHierarchyAfterAddedEmployee(
        employee,
        subordinates[index].subordinates,
        supervisorID
      );

      if (
        newSubordinatesForEmployee &&
        newSubordinatesForEmployee.length !== 0
      ) {
        currentEmployee = {
          ...currentEmployee,
          subordinates: newSubordinatesForEmployee
        };

        updatedSubordinates = subordinates.map((subordinate) => {
          if (subordinate.uniqueId === currentEmployee.uniqueId) {
            return { ...currentEmployee };
          }

          return { ...subordinate };
        });

        break;
      }
    }

    return updatedSubordinates;
  }

  undo() {
    [this.ceo, this.oldCeoHierarchy] = [this.oldCeoHierarchy, this.ceo];
  }

  redo() {
    [this.ceo, this.oldCeoHierarchy] = [this.oldCeoHierarchy, this.ceo];
  }
}

const app = new EmployeeOrgApp(ceo);

console.log("=============================================");
app.move(2, 15);
console.log(JSON.stringify(app.ceo));
console.log("=============================================");
app.undo();
console.log(JSON.stringify(app.ceo));
console.log("=============================================");
app.redo();
console.log(JSON.stringify(app.ceo));
