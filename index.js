const types = require("./types");

const isValidType = type => Object.values(types).includes(type);

const validateObject = (cmp, json) => {
  const properties = Object.keys(cmp);
  for (let i = 0; i < properties.length; i++) {
    const cmpProp = properties[i];
    const prop = properties[i].replace("?", "");
    // Should be optional or defined
    if (cmp[cmpProp] === types.any) {
      return true;
    }
    if (json[prop] === undefined) {
      if (!cmpProp.endsWith("?")) {
        throw new Error(`'${prop}' was undefined without being optional`);
      }
      if (typeof cmp[cmpProp] !== "object" && !isValidType(cmp[cmpProp])) {
        throw new Error(
          `Unknown type for '${prop}', should be one of ${Object.values(types)}`
        );
      }
      return true;
    }
    // If nested
    if (typeof cmp[cmpProp] === "object") {
      try {
        const result = validateObject(cmp[cmpProp], json[prop]);
        if (!result) {
          return false;
        }
      } catch (e) {
        throw new Error(
          `'${prop}' failed object validation, reason ${e.message}`
        );
      }
    } else {
      if (!isValidType(cmp[cmpProp])) {
        throw new Error(
          `Unknown type for '${prop}', should be one of ${Object.values(types)}`
        );
      }
      // Should be array type
      if (cmp[cmpProp].match(/\[\]/)) {
        if (!Array.isArray(json[prop])) {
          throw new Error(`'${prop}' is not array`);
        }
        if (
          cmp[cmpProp] === types.stringArray &&
          !json[prop].every(e => typeof e === types.string)
        ) {
          throw new Error(`'${prop}' is not string[]`);
        }
        if (
          cmp[cmpProp] === types.numberArray &&
          !json[prop].every(e => typeof e === types.number)
        ) {
          throw new Error(`'${prop}' is not number[]`);
        }
        continue;
      }
      // Final
      if (typeof json[prop] !== cmp[cmpProp]) {
        throw new Error(
          `'${prop}' expected to be ${cmp[cmpProp]}, got ${typeof json[prop]}`
        );
      }
    }
  }
  return true;
};

module.exports = validateObject;
