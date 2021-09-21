"use strict";
exports.__esModule = true;
exports.ceo = void 0;
var constants_1 = require("./constants");
var id = 1;
/**
 * Gets the sub-ordinates for a given employee.
 *
 * @returns {Array}
 */
function getSubOrdinates(name, hierarchy) {
    var subOrdinateNames = hierarchy[name];
    if (subOrdinateNames && subOrdinateNames.length !== 0) {
        return subOrdinateNames.map(function (name) {
            id += 1;
            var uniqueId = id;
            var subordinates = getSubOrdinates(name, hierarchy);
            var subOrdinateInfo = {
                name: name,
                uniqueId: uniqueId,
                subordinates: subordinates
            };
            return subOrdinateInfo;
        });
    }
    return [];
}
exports.ceo = {
    name: "Mark Zuckerberg",
    uniqueId: id,
    subordinates: getSubOrdinates("Mark ZuckerBerg", constants_1.initialHierarchy)
};
