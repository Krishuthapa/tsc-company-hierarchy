"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var Employee_1 = require("./Employee");
/**
 * Class for the organization's employee hierarchy.
 */
var EmployeeOrgApp = /** @class */ (function () {
    function EmployeeOrgApp(ceo) {
        this.ceo = ceo;
        this.oldCeoHierarchy = ceo;
    }
    EmployeeOrgApp.prototype.move = function (employeeID, supervisorID) {
        var subordinates = this.ceo.subordinates;
        var hierarchyInfoAfterRemoval = this.getNewHierarchyWithRemovedEmployee(subordinates, employeeID);
        if (!hierarchyInfoAfterRemoval.removedEmployee) {
            console.error("Invalid Employee Id");
            return;
        }
        var employeeForAddtion = hierarchyInfoAfterRemoval.removedEmployee;
        var subordinatesForAddingEmployee = hierarchyInfoAfterRemoval.updatedSubordinates;
        var finalUpdatedHierarchy = this.getNewHierarchyAfterAddedEmployee(employeeForAddtion, subordinatesForAddingEmployee, supervisorID);
        if (!finalUpdatedHierarchy || finalUpdatedHierarchy.length === 0) {
            console.error("Invalid Supervisor Id");
            return;
        }
        this.oldCeoHierarchy = this.ceo;
        this.ceo = __assign(__assign({}, this.ceo), { subordinates: finalUpdatedHierarchy });
    };
    /**
     * Function to update the given heirarchy after removing the given employee and
     * return the updated hierarchy and removed employee info.
     *
     * @param subordinates
     * @param employeeID
     * @returns {Object}
     */
    EmployeeOrgApp.prototype.getNewHierarchyWithRemovedEmployee = function (subordinates, employeeID) {
        var removedEmployee;
        var updatedSubordinates = subordinates;
        // Initially checking if the given list of subordinates holds the emolyee to be removed.
        var filteredSubordinate = subordinates.filter(function (subordinate) { return subordinate.uniqueId === employeeID; })[0];
        if (filteredSubordinate) {
            removedEmployee = __assign(__assign({}, filteredSubordinate), { subordinates: [] });
            // Removes the subordinate with given id from the hierarchy and add its children to its parent's subordinates.
            updatedSubordinates = __spreadArray(__spreadArray([], subordinates, true), filteredSubordinate.subordinates, true).filter(function (subordinate) { return subordinate.uniqueId !== employeeID; });
            return { removedEmployee: removedEmployee, updatedSubordinates: updatedSubordinates };
        }
        var _loop_1 = function (index) {
            var currentEmployee = subordinates[index];
            var hierarchyInfo = this_1.getNewHierarchyWithRemovedEmployee(subordinates[index].subordinates, employeeID);
            if (hierarchyInfo &&
                hierarchyInfo.removedEmployee &&
                hierarchyInfo.removedEmployee.uniqueId === employeeID) {
                currentEmployee = __assign(__assign({}, currentEmployee), { subordinates: hierarchyInfo.updatedSubordinates });
                removedEmployee = hierarchyInfo.removedEmployee;
                updatedSubordinates = subordinates.map(function (subordinate) {
                    if (subordinate.uniqueId === currentEmployee.uniqueId) {
                        return __assign({}, currentEmployee);
                    }
                    return __assign({}, subordinate);
                });
                return "break";
            }
        };
        var this_1 = this;
        // If the given list doesnt have the employee to be remove we drill down further using DFS and recursion.
        for (var index = 0; index < subordinates.length; ++index) {
            var state_1 = _loop_1(index);
            if (state_1 === "break")
                break;
        }
        return { removedEmployee: removedEmployee, updatedSubordinates: updatedSubordinates };
    };
    /**
     * Function adds the employee under the given supervisor id and
     * returns the updated subordinates hierarchy.
     *
     * @param employee
     * @param subordinates
     * @param supervisorID
     * @returns
     */
    EmployeeOrgApp.prototype.getNewHierarchyAfterAddedEmployee = function (employee, subordinates, supervisorID) {
        var updatedSubordinates = [];
        /**
         * Filters the subordinates list to check if the given supervisor id is present
         * and adds the employee to its subordinate if found.
         */
        var filteredSubordinate = subordinates.filter(function (subordinate) { return subordinate.uniqueId === supervisorID; })[0];
        if (filteredSubordinate) {
            filteredSubordinate = __assign(__assign({}, filteredSubordinate), { subordinates: __spreadArray(__spreadArray([], filteredSubordinate.subordinates, true), [employee], false) });
            updatedSubordinates = subordinates.map(function (subordinate) {
                if (subordinate.uniqueId === supervisorID) {
                    return __assign({}, filteredSubordinate);
                }
                return __assign({}, subordinate);
            });
            return updatedSubordinates;
        }
        var _loop_2 = function (index) {
            var currentEmployee = subordinates[index];
            var newSubordinatesForEmployee = this_2.getNewHierarchyAfterAddedEmployee(employee, subordinates[index].subordinates, supervisorID);
            if (newSubordinatesForEmployee &&
                newSubordinatesForEmployee.length !== 0) {
                currentEmployee = __assign(__assign({}, currentEmployee), { subordinates: newSubordinatesForEmployee });
                updatedSubordinates = subordinates.map(function (subordinate) {
                    if (subordinate.uniqueId === currentEmployee.uniqueId) {
                        return __assign({}, currentEmployee);
                    }
                    return __assign({}, subordinate);
                });
                return "break";
            }
        };
        var this_2 = this;
        // Recursively does the DFS to check for the given supervisor and add employee to its sub ordinates.
        for (var index = 0; index < subordinates.length; ++index) {
            var state_2 = _loop_2(index);
            if (state_2 === "break")
                break;
        }
        return updatedSubordinates;
    };
    EmployeeOrgApp.prototype.undo = function () {
        var _a;
        _a = [this.oldCeoHierarchy, this.ceo], this.ceo = _a[0], this.oldCeoHierarchy = _a[1];
    };
    EmployeeOrgApp.prototype.redo = function () {
        var _a;
        _a = [this.oldCeoHierarchy, this.ceo], this.ceo = _a[0], this.oldCeoHierarchy = _a[1];
    };
    return EmployeeOrgApp;
}());
var app = new EmployeeOrgApp(Employee_1.ceo);
console.log("=============================================");
app.move(2, 15);
console.log(JSON.stringify(app.ceo));
console.log("=============================================");
app.undo();
console.log(JSON.stringify(app.ceo));
console.log("=============================================");
app.redo();
console.log(JSON.stringify(app.ceo));
