const { test } = require("uvu");
const assert = require("uvu/assert");
const validate = require(".");
const types = require("./types");

/*
test("it should validate any object", () => {
  const cmp = {
    this: {
      can: {
        be: {
          nested: {
            infinitely: types.string,
          },
          and: types.array,
        },
        work: types.number,
      },
      "fine?": types.stringArray,
    },
  };

  assert.is(
    validate(cmp, {
      this: {
        can: {
          be: {
            nested: {
              infinitely: "works!",
            },
            and: ["also", "works!"],
          },
          work: 1,
        },
        fine: ["a", "b", "c"],
      },
    }),
    true
  );

  assert.throws(() =>
    validate(cmp, {
      this: {
        can: {
          be: {
            nested: {
              infinitely: "works!",
            },
            and: "also works!",
          },
          work: "oops!",
        },
      },
    })
  );
});

test("it should validate any object with optional properties", () => {
  const schema = {
    this: {
      can: {
        as: {
          nested: {
            as: "string",
          },
          you: "string",
        },
        like: "number",
      },
      with: {
        "optional?": "string",
      },
    },
  };

  assert.is(
    validate(schema, {
      this: {
        can: {
          as: {
            nested: {
              as: "works!",
            },
            you: "also works!",
          },
          like: 1,
        },
        with: {},
      },
    }),
    true
  );
});

test("it should validate any object with optional object properties", () => {
  const schema = {
    this: {
      can: {
        as: {
          nested: {
            as: "string",
          },
          you: "string",
        },
        like: "number",
      },
      "with?": {
        "optional?": "string",
      },
    },
  };

  assert.is(
    validate(schema, {
      this: {
        can: {
          as: {
            nested: {
              as: "works!",
            },
            you: "also works!",
          },
          like: 1,
        },
        ignored: "string",
      },
    }),
    true
  );
});

test("it should any value for properties as 'any'", () => {
  const schema = {
    this: types.any,
  };

  assert.is(
    validate(schema, {
      this: {},
    }),
    true
  );

  assert.is(
    validate(schema, {
      this: "abcd",
    }),
    true
  );

  assert.is(
    validate(schema, {
      this: 1,
    }),
    true
  );

  assert.is(
    validate(schema, {
      this: [],
    }),
    true
  );
});

test("should not allow unknown types", () => {
  assert.throws(() => {
    validate(
      {
        test: 1,
      },
      {
        test: 1,
      }
    );
  });

  // Even for optional properties
  assert.throws(() => {
    validate(
      {
        test: types.number,
        "test2?": 1,
      },
      {
        test: 1,
      }
    );
  });

  assert.not.throws(() => {
    validate(
      {
        test: types.number,
      },
      {
        test: 1,
      }
    );
  });
});
*/

test("it should validate activity_statement object", () => {
  assert.is(
    validate(
      {
        statement: {
          currency: types.string,
          account_number: types.string,
          start_at: types.number,
          end_at: types.number,
          total_spent: types.number,
          net_result_month: types.number,
          opening_balance: types.number,
          deposits: types.number,
          withdrawals: types.number,
          adjustments: types.number,
          closing_balance: types.number,
          net_result: types.number,
          six_months: types.numberArray,
          last_6_months: types.number,
          year_to_year: types.number,
          "transactions_list?": [],
        },
      },
      {
        statement: {
          currency: "AUD",
          account_number: "1234",
          start_at: 123456789,
          end_at: 123456789,
          total_spent: 10,
          net_result_month: 10,
          opening_balance: 10,
          deposits: 10,
          withdrawals: 10,
          adjustments: 10,
          closing_balance: 10,
          net_result: 10,
          six_months: [1, 2, 3],
          last_6_months: 10,
          year_to_year: 10,
          "transactions_list?": [],
        },
      }
    ),
    true
  );
});

test("should validate arbitrary array types", () => {
  assert.is(
    validate(
      {
        arbi: {
          a: types.string,
          "b?": types.string,
        },
        test: [
          {
            a: types.string,
            b: types.number,
            c: [
              {
                d: types.string,
              },
            ],
          },
        ],
      },
      {
        arbi: {
          a: "arbi-abcd",
        },
        test: [
          { a: "a-abcd", b: 1, c: [{ d: "d-abcd" }] },
          { a: "a-efgh", b: 2, c: [{ d: "d-efgh" }] },
          {
            a: "a-ijkl",
            b: 3,
            c: [
              {
                d: "d-ijkl",
              },
            ],
          },
        ],
      }
    ),
    true
  );
});

test.run();
