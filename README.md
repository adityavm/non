<p align="center">
  <h1 align="center">nons</h1>
  <p align="center">
    simple, lightweight schema validation library
  </p>
</p>

## Installation

```sh
npm i nons
```

## Usage

```ts
const validate = require("nons");
const types = require("nons/types");

const scheme = {
  this: {
    can: {
      as: {
        nested: {
          as: types.string,
        },
        you: types.array,
      },
      like: types.number,
    },
    with: {
      "optional?": types.string,
    },
  },
};

validate(schema, {
  this: {
    can: {
      as: {
        nested: {
          as: "works!",
        },
        you: ["also", "works!"],
      },
      like: 1,
    },
    with: {}, // only child is optional, but parent is required
  },
});
```
