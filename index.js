const types = require("./types");

const isValidType = type => Object.values(types).includes(type);

const validateObject = (cmp, json, currProp = "") => {
  if ([types.string, types.number, types.null].includes(cmp)) {
    if (cmp === types.null && json === null) return true;
    return typeof json === cmp;
  }
  const properties = Object.keys(cmp);
  for (let i = 0; i < properties.length; i++) {
    const cmpProp = properties[i];
    const modifiersRegExp = /[%?]+$/;
    const modifiers = (cmpProp.match(modifiersRegExp) || [])[0];
    const prop = properties[i].replace(modifiersRegExp, "");
    const debugProp = currProp ? `${currProp}.${prop}` : prop;
    // Should be optional or defined
    if (cmp[cmpProp] === types.any) {
      return true;
    }
    if (json[prop] === undefined) {
      if (!modifiers?.includes(types.optional)) {
        throw new Error(
          `'${debugProp}' was undefined / null without being optional`,
        );
      }
      if (typeof cmp[cmpProp] !== "object" && !isValidType(cmp[cmpProp])) {
        throw new Error(
          `Unknown type for '${debugProp}', should be one of ${Object.values(
            types,
          )}`,
        );
      }
      continue;
    }
    // If nested
    if (typeof cmp[cmpProp] === "object" && !Array.isArray(cmp[cmpProp])) {
      try {
        const result = validateObject(cmp[cmpProp], json[prop], prop);
        if (!result) {
          return false;
        }
      } catch (e) {
        throw new Error(
          `'${debugProp}' failed object validation, reason ${e.message}`,
        );
      }
    } else {
      // Should be array type
      if (Array.isArray(cmp[cmpProp])) {
        if (modifiers?.includes(types.oneOf)) {
          const result = cmp[cmpProp].some(obj => {
            try {
              return validateObject(obj, json[prop], prop);
            } catch (e) {
              return false;
            }
          });
          if (!result) {
            throw new Error(
              `'${debugProp}' validation didn't match any provided value`,
            );
          }
          continue;
        }
        if (!Array.isArray(json[prop])) {
          throw new Error(`'${debugProp}' is not array`);
        }
        if (
          cmp[cmpProp] === types.stringArray &&
          !json[prop].every(e => typeof e === types.string)
        ) {
          throw new Error(`'${debugProp}' is not ["string"]`);
        }
        if (
          cmp[cmpProp] === types.numberArray &&
          !json[prop].every(e => typeof e === types.number)
        ) {
          throw new Error(`'${debugProp}' is not ["number"]`);
        }
        if (cmp[cmpProp] === types.objectArray) {
          if (
            cmp[cmpProp][0] === "object" &&
            !json[prop].every(e => typeof e === types.object)
          ) {
            throw new Error(`'${debugProp}' is not ["object"]`);
          }
        }
        if (cmp[cmpProp] !== "object" && typeof cmp[cmpProp][0] === "object") {
          const result = json[prop].every(
            obj => validateObject(cmp[cmpProp][0], obj, prop) === true,
          );
          if (!result) {
            return false;
          }
        }
        continue;
      }
      if (!isValidType(cmp[cmpProp])) {
        throw new Error(
          `Unknown type for '${debugProp}', should be one of ${Object.values(
            types,
          )}`,
        );
      }
      // Final
      if (typeof json[prop] !== cmp[cmpProp]) {
        throw new Error(
          `'${debugProp}' expected to be ${cmp[cmpProp]}, got ${typeof json[
            prop
          ]} with value "${JSON.stringify(json[prop])}"`,
        );
      }
    }
  }
  return true;
};

module.exports = validateObject;
