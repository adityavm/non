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
    if (typeof cmp[cmpProp] === "object" && !Array.isArray(cmp[cmpProp])) {
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
      // Should be array type
      if (Array.isArray(cmp[cmpProp])) {
        if (!Array.isArray(json[prop])) {
          throw new Error(`'${prop}' is not array`);
        }
        if (
          cmp[cmpProp] === types.stringArray &&
          !json[prop].every(e => typeof e === types.string)
        ) {
          throw new Error(`'${prop}' is not ["string"]`);
        }
        if (
          cmp[cmpProp] === types.numberArray &&
          !json[prop].every(e => typeof e === types.number)
        ) {
          throw new Error(`'${prop}' is not ["number"]`);
        }
        if (cmp[cmpProp] === types.objectArray) {
          if (
            cmp[cmpProp][0] === "object" &&
            !json[prop].every(e => typeof e === types.object)
          ) {
            throw new Error(`'${prop}' is not ["object"]`);
          }
        }
        if (cmp[cmpProp] !== "object" && typeof cmp[cmpProp][0] === "object") {
          return json[prop].every(
            obj => validateObject(cmp[cmpProp][0], obj) === true
          );
        }
        continue;
      }
      if (!isValidType(cmp[cmpProp])) {
        throw new Error(
          `Unknown type for '${prop}', should be one of ${Object.values(types)}`
        );
      }
      // Final
      if (typeof json[prop] !== cmp[cmpProp]) {
        throw new Error(
          `'${prop}' expected to be ${cmp[cmpProp]}, got ${typeof json[
            prop
          ]} with value "${JSON.stringify(json[prop])}"`
        );
      }
    }
  }
  return true;
};

module.exports = validateObject;
