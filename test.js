const { test } = require("uvu");
const assert = require("uvu/assert");
const validate = require(".");
const types = require("./types");

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
    true,
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
    }),
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
    true,
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
    true,
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
    true,
  );

  assert.is(
    validate(schema, {
      this: "abcd",
    }),
    true,
  );

  assert.is(
    validate(schema, {
      this: 1,
    }),
    true,
  );

  assert.is(
    validate(schema, {
      this: [],
    }),
    true,
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
      },
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
      },
    );
  });

  assert.not.throws(() => {
    validate(
      {
        test: types.number,
      },
      {
        test: 1,
      },
    );
  });
});

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
      },
    ),
    true,
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
      },
    ),
    true,
  );
});

test("should validate real object", () => {
  assert.is(
    validate(
      {
        "statement?": {
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
          six_months: ["number"],
          last_6_months: types.number,
          year_to_year: types.number,
        },
        "transactions_list?": [
          {
            symbol: types.string,
            reftype_group: types.string,
            "data%": [
              null,
              {
                selections: [
                  {
                    info: {
                      name: types.string,
                    },
                  },
                ],
                "game?": types.string,
                stake: types.number,
                stake_bonus: types.number,
                winnings: types.number,
                "balance?": types.number,
              },
            ],
            balance_change: types.number,
          },
        ],
      },
      {
        transactions_list: JSON.parse(
          '[{"id":564450,"time":1687776022,"void_event_id":null,"symbol":"AUD","reftype":30,"balance_change":0.0,"bonus_change":0.0,"reserved_change":0.0,"aml_change":0.0,"virtual_change":5.0,"balance":0.0,"bonus":0.0,"reserved":0.0,"amlbalance":0.0,"virtual":5.0,"reftype_txt":"token_used","reftype_group":"token","data":null,"user_label":":test_tube: pierrekenser (AU)","user_id":"U128164","external_id":"U128164","is_b2b":0,"b2b_partner":"authkrnbet"},{"id":564451,"time":1687776022,"void_event_id":null,"symbol":"AUD","reftype":5,"balance_change":0.0,"bonus_change":0.0,"reserved_change":0.0,"aml_change":0.0,"virtual_change":-5.0,"balance":0.0,"bonus":0.0,"reserved":0.0,"amlbalance":0.0,"virtual":0.0,"reftype_txt":"bet_place","reftype_group":"bet","data":{"id":"B12251","type":1,"created_at":1687776022,"updated_at":1687782956,"symbol":"AUD","stake":0.0,"stake_virtual":5.0,"stake_bonus":0.0,"stake_original":0.0,"stake_virtual_original":5.0,"stake_bonus_original":0.0,"user_id":"U128164","external_id":"U128164","status":3,"winnings":6.5,"winnings_original":6.5,"winnings_real":0.0,"winnings_bonus":0.0,"winnings_real_original":null,"winnings_bonus_original":null,"validforbonus":0,"total_odds":2.3,"legs":1,"settlestate":3,"parent_id":null,"token_used":1,"token_id":"6_1f4ca8f8a3a19aa9047e2361c41827ce693fa1","blversion":33,"partial_id":null,"partial_bet_stake":0.0,"is_resettled":0,"payoutmode":0,"selections":[{"id":18957,"mpid":"SEL_BW_60280967","odds":2.3,"result":2,"placedphase":1,"type":1,"settlereason":null,"market_id":"MAR_BW_20344864","fixture_id":"FIX_BW_169202","info":{"id":"SEL_BW_60280967","market_id":"MAR_BW_20344864","fixture_id":"FIX_BW_169202","name":"Graeme Dott","name_translation":null,"position":null,"result":2,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_21060","result_txt":"loser","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_21060","name":"Graeme Dott","sport_id":"SPT_SNOOKER","short_name":"Graeme Dott","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"},"market_details":{"id":"MAR_BW_20344864","tradingstatus":4,"tier":null,"markettype":"MKT_1344","name":"3 Way ","name_translation":null,"settled":1687782956,"fixture_id":"FIX_BW_169202","handicap":null,"category":"match_betting","display_order":2,"is_main":0,"is_open":false,"is_settled":true,"status_txt":"closed","selections":[{"id":"SEL_BW_60280967","market_id":"MAR_BW_20344864","fixture_id":"FIX_BW_169202","name":"Graeme Dott","name_translation":null,"position":null,"result":2,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_21060","result_txt":"loser","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_21060","name":"Graeme Dott","sport_id":"SPT_SNOOKER","short_name":"Graeme Dott","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet","c":30}},{"id":"SEL_BW_60280968","market_id":"MAR_BW_20344864","fixture_id":"FIX_BW_169202","name":"Draw","name_translation":null,"position":null,"result":2,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":null,"result_txt":"loser","is_open":false,"status_txt":"closed","competitor":null,"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}},{"id":"SEL_BW_60280969","market_id":"MAR_BW_20344864","fixture_id":"FIX_BW_169202","name":"Andrew Higginson","name_translation":null,"position":null,"result":1,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_1966","result_txt":"winner","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_1966","name":"Andrew Higginson","sport_id":"SPT_SNOOKER","short_name":"Andrew Higginson","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}}],"fixture":{"id":"FIX_BW_169202","last_evcounter":375410124,"name":"Graeme Dott vs Andrew Higginson","tier":2,"fixturetype":1,"starttime":1687777200,"sport_id":"SPT_SNOOKER","competition_id":"CMP_TK_2620","competitor1_id":"TEM_TK_21060","competitor2_id":"TEM_TK_1966","2way":1,"bestof":null,"status":4,"phase":3,"phasedetail":null,"main_market_id":"MAR_BW_20900108","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"is_featured":false,"country":"","score":[{"competitor_id":"TEM_TK_21060","name":"Graeme Dott","winner":null,"score":0,"shortname":"Graeme Dott","country":"GB-"},{"competitor_id":"TEM_TK_1966","name":"Andrew Higginson","winner":null,"score":0,"shortname":"Andrew Higginson","country":"GB-"}]},"competition":{"id":"CMP_TK_2620","name":"Championship League","tier":2,"sport_id":"SPT_SNOOKER","country":null},"competitor1":{"id":"TEM_TK_21060","name":"Graeme Dott","sport_id":"SPT_SNOOKER","short_name":"Graeme Dott","country":null},"competitor2":{"id":"TEM_TK_1966","name":"Andrew Higginson","sport_id":"SPT_SNOOKER","short_name":"Andrew Higginson","country":null}},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}},"fixture":{"id":"FIX_BW_169202","last_evcounter":375410124,"name":"Graeme Dott vs Andrew Higginson","tier":2,"fixturetype":1,"starttime":1687777200,"sport_id":"SPT_SNOOKER","competition_id":"CMP_TK_2620","competitor1_id":"TEM_TK_21060","competitor2_id":"TEM_TK_1966","2way":1,"bestof":null,"status":4,"phase":3,"phasedetail":null,"main_market_id":"MAR_BW_20900108","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"is_featured":false,"country":"","score":[{"competitor_id":"TEM_TK_21060","name":"Graeme Dott","winner":null,"score":0,"shortname":"Graeme Dott","country":"GB-"},{"competitor_id":"TEM_TK_1966","name":"Andrew Higginson","winner":null,"score":0,"shortname":"Andrew Higginson","country":"GB-"}]},"competition":{"id":"CMP_TK_2620","name":"Championship League","tier":2,"sport_id":"SPT_SNOOKER","country":null},"competitor1":{"id":"TEM_TK_21060","name":"Graeme Dott","sport_id":"SPT_SNOOKER","short_name":"Graeme Dott","country":null},"competitor2":{"id":"TEM_TK_1966","name":"Andrew Higginson","sport_id":"SPT_SNOOKER","short_name":"Andrew Higginson","country":null}}},"result_txt":"loser"}],"status_txt":"settled","settlestate_txt":"lose","payoutmode_txt":"unkown"},"user_label":"pierrekenser (AU)","user_id":"U128164","external_id":"U128164","is_b2b":0,"b2b_partner":"authkrnbet"},{"id":564453,"time":1687776059,"void_event_id":null,"symbol":"AUD","reftype":30,"balance_change":0.0,"bonus_change":0.0,"reserved_change":0.0,"aml_change":0.0,"virtual_change":5.0,"balance":0.0,"bonus":0.0,"reserved":0.0,"amlbalance":0.0,"virtual":5.0,"reftype_txt":"token_used","reftype_group":"token","data":null,"user_label":"pierrekenser (AU)","user_id":"U128164","external_id":"U128164","is_b2b":0,"b2b_partner":"authkrnbet"},{"id":564454,"time":1687776059,"void_event_id":null,"symbol":"AUD","reftype":5,"balance_change":0.0,"bonus_change":0.0,"reserved_change":0.0,"aml_change":0.0,"virtual_change":-5.0,"balance":0.0,"bonus":0.0,"reserved":0.0,"amlbalance":0.0,"virtual":0.0,"reftype_txt":"bet_place","reftype_group":"bet","data":{"id":"B12252","type":1,"created_at":1687776059,"updated_at":1687801508,"symbol":"AUD","stake":0.0,"stake_virtual":5.0,"stake_bonus":0.0,"stake_original":0.0,"stake_virtual_original":5.0,"stake_bonus_original":0.0,"user_id":"U128164","external_id":"U128164","status":3,"winnings":4.75,"winnings_original":4.75,"winnings_real":0.0,"winnings_bonus":0.0,"winnings_real_original":null,"winnings_bonus_original":null,"validforbonus":0,"total_odds":1.95,"legs":1,"settlestate":3,"parent_id":null,"token_used":1,"token_id":"6_1118e10e550858c832e0f15f75d87d41044872","blversion":33,"partial_id":null,"partial_bet_stake":0.0,"is_resettled":0,"payoutmode":0,"selections":[{"id":18958,"mpid":"SEL_PE_61805161","odds":1.95,"result":2,"placedphase":1,"type":1,"settlereason":null,"market_id":"MAR_PE_20848950","fixture_id":"FIX_PE_164496","info":{"id":"SEL_PE_61805161","market_id":"MAR_PE_20848950","fixture_id":"FIX_PE_164496","name":"Gen of Miracles","name_translation":null,"position":"participant","result":2,"odds":4.0,"markettype":"MKT_1","type":1,"tradingstatus":4,"is_main":1,"competitor_id":"TEM_TK_74541","result_txt":"loser","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_74541","name":"Gen of Miracles","sport_id":"SPT_DOTA2","short_name":"Gen of Miracles","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"},"market_details":{"id":"MAR_PE_20848950","tradingstatus":4,"tier":null,"markettype":"MKT_1","name":"Match Up Winner","name_translation":null,"settled":1687801508,"fixture_id":"FIX_PE_164496","handicap":null,"category":"match_betting","display_order":1,"is_main":1,"is_open":false,"is_settled":true,"status_txt":"closed","selections":[{"id":"SEL_PE_61805160","market_id":"MAR_PE_20848950","fixture_id":"FIX_PE_164496","name":"Hot Headed Gaming","name_translation":null,"position":"participant","result":1,"odds":1.18,"markettype":"MKT_1","type":1,"tradingstatus":4,"is_main":1,"competitor_id":"TEM_TK_16068","result_txt":"winner","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_16068","name":"Hot Headed Gaming","sport_id":"SPT_DOTA2","short_name":"HHG","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}},{"id":"SEL_PE_61805161","market_id":"MAR_PE_20848950","fixture_id":"FIX_PE_164496","name":"Gen of Miracles","name_translation":null,"position":"participant","result":2,"odds":4.0,"markettype":"MKT_1","type":1,"tradingstatus":4,"is_main":1,"competitor_id":"TEM_TK_74541","result_txt":"loser","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_74541","name":"Gen of Miracles","sport_id":"SPT_DOTA2","short_name":"Gen of Miracles","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet","c":30}}],"fixture":{"id":"FIX_PE_164496","last_evcounter":382003603,"name":"Hot Headed Gaming vs Gen of Miracles","tier":6,"fixturetype":1,"starttime":1687791600,"sport_id":"SPT_DOTA2","competition_id":"CMP_TK_208","competitor1_id":"TEM_TK_16068","competitor2_id":"TEM_TK_74541","2way":1,"bestof":3,"status":4,"phase":3,"phasedetail":"settled","main_market_id":"MAR_PE_20848950","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"streams":[{"active":1,"type":"twitch","path":"euproleague_en","full_url":"https:\\/\\/www.twitch.tv\\/euproleague_en","stream_key":"general","language":"en","start_at":0,"end_at":0},{"active":1,"type":"twitch","path":"euproleague_ru","full_url":"https:\\/\\/www.twitch.tv\\/euproleague_ru","stream_key":"general","language":"ru","start_at":0,"end_at":0}],"is_featured":false,"country":null,"score":[{"competitor_id":"TEM_TK_16068","name":"Hot Headed Gaming","winner":true,"score":2,"shortname":"HHG","country":"UA"},{"competitor_id":"TEM_TK_74541","name":"Gen of Miracles","winner":false,"score":1,"shortname":"Gen of Miracles","country":"UN"}],"games":[{"game":1,"winner_id":"TEM_TK_74541"},{"game":2,"winner_id":"TEM_TK_16068"},{"game":3,"winner_id":"TEM_TK_16068"}]},"competition":{"id":"CMP_TK_208","name":"European Pro League","tier":6,"sport_id":"SPT_DOTA2","country":null},"competitor1":{"id":"TEM_TK_16068","name":"Hot Headed Gaming","sport_id":"SPT_DOTA2","short_name":"HHG","country":null},"competitor2":{"id":"TEM_TK_74541","name":"Gen of Miracles","sport_id":"SPT_DOTA2","short_name":"Gen of Miracles","country":null}},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}},"fixture":{"id":"FIX_PE_164496","last_evcounter":382003603,"name":"Hot Headed Gaming vs Gen of Miracles","tier":6,"fixturetype":1,"starttime":1687791600,"sport_id":"SPT_DOTA2","competition_id":"CMP_TK_208","competitor1_id":"TEM_TK_16068","competitor2_id":"TEM_TK_74541","2way":1,"bestof":3,"status":4,"phase":3,"phasedetail":"settled","main_market_id":"MAR_PE_20848950","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"streams":[{"active":1,"type":"twitch","path":"euproleague_en","full_url":"https:\\/\\/www.twitch.tv\\/euproleague_en","stream_key":"general","language":"en","start_at":0,"end_at":0},{"active":1,"type":"twitch","path":"euproleague_ru","full_url":"https:\\/\\/www.twitch.tv\\/euproleague_ru","stream_key":"general","language":"ru","start_at":0,"end_at":0}],"is_featured":false,"country":null,"score":[{"competitor_id":"TEM_TK_16068","name":"Hot Headed Gaming","winner":true,"score":2,"shortname":"HHG","country":"UA"},{"competitor_id":"TEM_TK_74541","name":"Gen of Miracles","winner":false,"score":1,"shortname":"Gen of Miracles","country":"UN"}],"games":[{"game":1,"winner_id":"TEM_TK_74541"},{"game":2,"winner_id":"TEM_TK_16068"},{"game":3,"winner_id":"TEM_TK_16068"}]},"competition":{"id":"CMP_TK_208","name":"European Pro League","tier":6,"sport_id":"SPT_DOTA2","country":null},"competitor1":{"id":"TEM_TK_16068","name":"Hot Headed Gaming","sport_id":"SPT_DOTA2","short_name":"HHG","country":null},"competitor2":{"id":"TEM_TK_74541","name":"Gen of Miracles","sport_id":"SPT_DOTA2","short_name":"Gen of Miracles","country":null}}},"result_txt":"loser"}],"status_txt":"settled","settlestate_txt":"lose","payoutmode_txt":"unkown"},"user_label":"pierrekenser (AU)","user_id":"U128164","external_id":"U128164","is_b2b":0,"b2b_partner":"authkrnbet"},{"id":578297,"time":1688025449,"void_event_id":null,"symbol":"AUD","reftype":30,"balance_change":0.0,"bonus_change":0.0,"reserved_change":0.0,"aml_change":0.0,"virtual_change":5.0,"balance":0.0,"bonus":0.0,"reserved":0.0,"amlbalance":0.0,"virtual":5.0,"reftype_txt":"token_used","reftype_group":"token","data":null,"user_label":"pierrekenser (AU)","user_id":"U128164","external_id":"U128164","is_b2b":0,"b2b_partner":"authkrnbet"},{"id":578298,"time":1688025449,"void_event_id":null,"symbol":"AUD","reftype":5,"balance_change":0.0,"bonus_change":0.0,"reserved_change":0.0,"aml_change":0.0,"virtual_change":-5.0,"balance":0.0,"bonus":0.0,"reserved":0.0,"amlbalance":0.0,"virtual":0.0,"reftype_txt":"bet_place","reftype_group":"bet","data":{"id":"B12525","type":1,"created_at":1688025449,"updated_at":1688042388,"symbol":"AUD","stake":0.0,"stake_virtual":5.0,"stake_bonus":0.0,"stake_original":0.0,"stake_virtual_original":5.0,"stake_bonus_original":0.0,"user_id":"U128164","external_id":"U128164","status":3,"winnings":4.3,"winnings_original":4.3,"winnings_real":4.3,"winnings_bonus":0.0,"winnings_real_original":null,"winnings_bonus_original":4.3,"validforbonus":0,"total_odds":1.86,"legs":1,"settlestate":2,"parent_id":null,"token_used":1,"token_id":"6_82555e912fa0bce2bfb19b1cce5cf4695e89ea","blversion":33,"partial_id":null,"partial_bet_stake":0.0,"is_resettled":0,"payoutmode":0,"selections":[{"id":19565,"mpid":"SEL_BW_63382359","odds":1.86,"result":1,"placedphase":1,"type":1,"settlereason":null,"market_id":"MAR_BW_21395034","fixture_id":"FIX_BW_177258","info":{"id":"SEL_BW_63382359","market_id":"MAR_BW_21395034","fixture_id":"FIX_BW_177258","name":"Weronika Ewald","name_translation":null,"position":null,"result":1,"odds":1.83,"markettype":"MKT_1249","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_22178","result_txt":"winner","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_22178","name":"Weronika Ewald","sport_id":"SPT_TENNIS","short_name":"Weronika Ewald","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"},"market_details":{"id":"MAR_BW_21395034","tradingstatus":4,"tier":null,"markettype":"MKT_1249","name":"two way - Who will win?","name_translation":null,"settled":1688042388,"fixture_id":"FIX_BW_177258","handicap":null,"category":"match_betting","display_order":2,"is_main":0,"is_open":false,"is_settled":true,"status_txt":"closed","selections":[{"id":"SEL_BW_63382359","market_id":"MAR_BW_21395034","fixture_id":"FIX_BW_177258","name":"Weronika Ewald","name_translation":null,"position":null,"result":1,"odds":1.83,"markettype":"MKT_1249","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_22178","result_txt":"winner","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_22178","name":"Weronika Ewald","sport_id":"SPT_TENNIS","short_name":"Weronika Ewald","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet","c":30}},{"id":"SEL_BW_63382360","market_id":"MAR_BW_21395034","fixture_id":"FIX_BW_177258","name":"Lya Fernandez","name_translation":null,"position":null,"result":2,"odds":1.83,"markettype":"MKT_1249","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_20662","result_txt":"loser","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_20662","name":"Lya Fernandez","sport_id":"SPT_TENNIS","short_name":"Lya Fernandez","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}}],"fixture":{"id":"FIX_BW_177258","last_evcounter":386450035,"name":"Weronika Ewald vs Lya Fernandez","tier":4,"fixturetype":1,"starttime":1688036400,"sport_id":"SPT_TENNIS","competition_id":"CMP_TK_236","competitor1_id":"TEM_TK_22178","competitor2_id":"TEM_TK_20662","2way":1,"bestof":null,"status":4,"phase":3,"phasedetail":null,"main_market_id":"MAR_BW_21430067","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"is_featured":false,"country":null,"score":[{"competitor_id":"TEM_TK_22178","name":"Weronika Ewald","winner":null,"score":0,"shortname":"Weronika Ewald","country":"PL"},{"competitor_id":"TEM_TK_20662","name":"Lya Fernandez","winner":null,"score":0,"shortname":"Lya Fernandez","country":"MX"}]},"competition":{"id":"CMP_TK_236","name":"ITF Women - Monastir (TUN) - Hard","tier":4,"sport_id":"SPT_TENNIS","country":null},"competitor1":{"id":"TEM_TK_22178","name":"Weronika Ewald","sport_id":"SPT_TENNIS","short_name":"Weronika Ewald","country":null},"competitor2":{"id":"TEM_TK_20662","name":"Lya Fernandez","sport_id":"SPT_TENNIS","short_name":"Lya Fernandez","country":null}},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}},"fixture":{"id":"FIX_BW_177258","last_evcounter":386450035,"name":"Weronika Ewald vs Lya Fernandez","tier":4,"fixturetype":1,"starttime":1688036400,"sport_id":"SPT_TENNIS","competition_id":"CMP_TK_236","competitor1_id":"TEM_TK_22178","competitor2_id":"TEM_TK_20662","2way":1,"bestof":null,"status":4,"phase":3,"phasedetail":null,"main_market_id":"MAR_BW_21430067","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"is_featured":false,"country":null,"score":[{"competitor_id":"TEM_TK_22178","name":"Weronika Ewald","winner":null,"score":0,"shortname":"Weronika Ewald","country":"PL"},{"competitor_id":"TEM_TK_20662","name":"Lya Fernandez","winner":null,"score":0,"shortname":"Lya Fernandez","country":"MX"}]},"competition":{"id":"CMP_TK_236","name":"ITF Women - Monastir (TUN) - Hard","tier":4,"sport_id":"SPT_TENNIS","country":null},"competitor1":{"id":"TEM_TK_22178","name":"Weronika Ewald","sport_id":"SPT_TENNIS","short_name":"Weronika Ewald","country":null},"competitor2":{"id":"TEM_TK_20662","name":"Lya Fernandez","sport_id":"SPT_TENNIS","short_name":"Lya Fernandez","country":null}}},"result_txt":"winner"}],"status_txt":"settled","settlestate_txt":"won","payoutmode_txt":"unkown"},"user_label":"pierrekenser (AU)","user_id":"U128164","external_id":"U128164","is_b2b":0,"b2b_partner":"authkrnbet"},{"id":578299,"time":1688025463,"void_event_id":null,"symbol":"AUD","reftype":30,"balance_change":0.0,"bonus_change":0.0,"reserved_change":0.0,"aml_change":0.0,"virtual_change":5.0,"balance":0.0,"bonus":0.0,"reserved":0.0,"amlbalance":0.0,"virtual":5.0,"reftype_txt":"token_used","reftype_group":"token","data":null,"user_label":"pierrekenser (AU)","user_id":"U128164","external_id":"U128164","is_b2b":0,"b2b_partner":"authkrnbet"},{"id":578300,"time":1688025463,"void_event_id":null,"symbol":"AUD","reftype":5,"balance_change":0.0,"bonus_change":0.0,"reserved_change":0.0,"aml_change":0.0,"virtual_change":-5.0,"balance":0.0,"bonus":0.0,"reserved":0.0,"amlbalance":0.0,"virtual":0.0,"reftype_txt":"bet_place","reftype_group":"bet","data":{"id":"B12527","type":1,"created_at":1688025463,"updated_at":1688038745,"symbol":"AUD","stake":0.0,"stake_virtual":5.0,"stake_bonus":0.0,"stake_original":0.0,"stake_virtual_original":5.0,"stake_bonus_original":0.0,"user_id":"U128164","external_id":"U128164","status":3,"winnings":4.3,"winnings_original":4.3,"winnings_real":4.3,"winnings_bonus":0.0,"winnings_real_original":null,"winnings_bonus_original":4.3,"validforbonus":0,"total_odds":1.86,"legs":1,"settlestate":2,"parent_id":null,"token_used":1,"token_id":"6_02dff6a898c6fd596fa862b9b5b19991df5379","blversion":33,"partial_id":null,"partial_bet_stake":0.0,"is_resettled":0,"payoutmode":0,"selections":[{"id":19566,"mpid":"SEL_BW_61468770","odds":1.86,"result":1,"placedphase":1,"type":1,"settlereason":null,"market_id":"MAR_BW_20739151","fixture_id":"FIX_BW_172325","info":{"id":"SEL_BW_61468770","market_id":"MAR_BW_20739151","fixture_id":"FIX_BW_172325","name":"Thepchaiya Un-nooh","name_translation":null,"position":null,"result":1,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_21061","result_txt":"winner","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","sport_id":"SPT_SNOOKER","short_name":"Thepchaiya Un-nooh","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"},"market_details":{"id":"MAR_BW_20739151","tradingstatus":4,"tier":null,"markettype":"MKT_1344","name":"3 Way ","name_translation":null,"settled":1688038745,"fixture_id":"FIX_BW_172325","handicap":null,"category":"match_betting","display_order":2,"is_main":0,"is_open":false,"is_settled":true,"status_txt":"closed","selections":[{"id":"SEL_BW_61468770","market_id":"MAR_BW_20739151","fixture_id":"FIX_BW_172325","name":"Thepchaiya Un-nooh","name_translation":null,"position":null,"result":1,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_21061","result_txt":"winner","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","sport_id":"SPT_SNOOKER","short_name":"Thepchaiya Un-nooh","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet","c":30}},{"id":"SEL_BW_61468771","market_id":"MAR_BW_20739151","fixture_id":"FIX_BW_172325","name":"Draw","name_translation":null,"position":null,"result":2,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":null,"result_txt":"loser","is_open":false,"status_txt":"closed","competitor":null,"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}},{"id":"SEL_BW_61468772","market_id":"MAR_BW_20739151","fixture_id":"FIX_BW_172325","name":"Florian Nuessle","name_translation":null,"position":null,"result":2,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_18728","result_txt":"loser","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_18728","name":"Florian Nuessle","sport_id":"SPT_SNOOKER","short_name":"Florian Nuessle","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}}],"fixture":{"id":"FIX_BW_172325","last_evcounter":380150203,"name":"Thepchaiya Un-nooh vs Florian Nuessle","tier":2,"fixturetype":1,"starttime":1688036400,"sport_id":"SPT_SNOOKER","competition_id":"CMP_TK_2620","competitor1_id":"TEM_TK_21061","competitor2_id":"TEM_TK_18728","2way":1,"bestof":null,"status":4,"phase":3,"phasedetail":null,"main_market_id":"MAR_BW_21429902","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"is_featured":false,"country":"","score":[{"competitor_id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","winner":null,"score":0,"shortname":"Thepchaiya Un-nooh","country":"TH"},{"competitor_id":"TEM_TK_18728","name":"Florian Nuessle","winner":null,"score":0,"shortname":"Florian Nuessle","country":"AT"}]},"competition":{"id":"CMP_TK_2620","name":"Championship League","tier":2,"sport_id":"SPT_SNOOKER","country":null},"competitor1":{"id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","sport_id":"SPT_SNOOKER","short_name":"Thepchaiya Un-nooh","country":null},"competitor2":{"id":"TEM_TK_18728","name":"Florian Nuessle","sport_id":"SPT_SNOOKER","short_name":"Florian Nuessle","country":null}},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}},"fixture":{"id":"FIX_BW_172325","last_evcounter":380150203,"name":"Thepchaiya Un-nooh vs Florian Nuessle","tier":2,"fixturetype":1,"starttime":1688036400,"sport_id":"SPT_SNOOKER","competition_id":"CMP_TK_2620","competitor1_id":"TEM_TK_21061","competitor2_id":"TEM_TK_18728","2way":1,"bestof":null,"status":4,"phase":3,"phasedetail":null,"main_market_id":"MAR_BW_21429902","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"is_featured":false,"country":"","score":[{"competitor_id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","winner":null,"score":0,"shortname":"Thepchaiya Un-nooh","country":"TH"},{"competitor_id":"TEM_TK_18728","name":"Florian Nuessle","winner":null,"score":0,"shortname":"Florian Nuessle","country":"AT"}]},"competition":{"id":"CMP_TK_2620","name":"Championship League","tier":2,"sport_id":"SPT_SNOOKER","country":null},"competitor1":{"id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","sport_id":"SPT_SNOOKER","short_name":"Thepchaiya Un-nooh","country":null},"competitor2":{"id":"TEM_TK_18728","name":"Florian Nuessle","sport_id":"SPT_SNOOKER","short_name":"Florian Nuessle","country":null}}},"result_txt":"winner"}],"status_txt":"settled","settlestate_txt":"won","payoutmode_txt":"unkown"},"user_label":"pierrekenser (AU)","user_id":"U128164","external_id":"U128164","is_b2b":0,"b2b_partner":"authkrnbet"},{"id":582979,"time":1688038745,"void_event_id":null,"symbol":"AUD","reftype":6,"balance_change":4.3,"bonus_change":0.0,"reserved_change":0.0,"aml_change":0.0,"virtual_change":0.0,"balance":4.3,"bonus":0.0,"reserved":0.0,"amlbalance":0.0,"virtual":0.0,"reftype_txt":"bet_won","reftype_group":"bet","data":{"id":"B12527","type":1,"created_at":1688025463,"updated_at":1688038745,"symbol":"AUD","stake":0.0,"stake_virtual":5.0,"stake_bonus":0.0,"stake_original":0.0,"stake_virtual_original":5.0,"stake_bonus_original":0.0,"user_id":"U128164","external_id":"U128164","status":3,"winnings":4.3,"winnings_original":4.3,"winnings_real":4.3,"winnings_bonus":0.0,"winnings_real_original":null,"winnings_bonus_original":4.3,"validforbonus":0,"total_odds":1.86,"legs":1,"settlestate":2,"parent_id":null,"token_used":1,"token_id":"6_02dff6a898c6fd596fa862b9b5b19991df5379","blversion":33,"partial_id":null,"partial_bet_stake":0.0,"is_resettled":0,"payoutmode":0,"selections":[{"id":19566,"mpid":"SEL_BW_61468770","odds":1.86,"result":1,"placedphase":1,"type":1,"settlereason":null,"market_id":"MAR_BW_20739151","fixture_id":"FIX_BW_172325","info":{"id":"SEL_BW_61468770","market_id":"MAR_BW_20739151","fixture_id":"FIX_BW_172325","name":"Thepchaiya Un-nooh","name_translation":null,"position":null,"result":1,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_21061","result_txt":"winner","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","sport_id":"SPT_SNOOKER","short_name":"Thepchaiya Un-nooh","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"},"market_details":{"id":"MAR_BW_20739151","tradingstatus":4,"tier":null,"markettype":"MKT_1344","name":"3 Way ","name_translation":null,"settled":1688038745,"fixture_id":"FIX_BW_172325","handicap":null,"category":"match_betting","display_order":2,"is_main":0,"is_open":false,"is_settled":true,"status_txt":"closed","selections":[{"id":"SEL_BW_61468770","market_id":"MAR_BW_20739151","fixture_id":"FIX_BW_172325","name":"Thepchaiya Un-nooh","name_translation":null,"position":null,"result":1,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_21061","result_txt":"winner","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","sport_id":"SPT_SNOOKER","short_name":"Thepchaiya Un-nooh","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet","c":30}},{"id":"SEL_BW_61468771","market_id":"MAR_BW_20739151","fixture_id":"FIX_BW_172325","name":"Draw","name_translation":null,"position":null,"result":2,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":null,"result_txt":"loser","is_open":false,"status_txt":"closed","competitor":null,"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}},{"id":"SEL_BW_61468772","market_id":"MAR_BW_20739151","fixture_id":"FIX_BW_172325","name":"Florian Nuessle","name_translation":null,"position":null,"result":2,"odds":2.8,"markettype":"MKT_1344","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_18728","result_txt":"loser","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_18728","name":"Florian Nuessle","sport_id":"SPT_SNOOKER","short_name":"Florian Nuessle","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}}],"fixture":{"id":"FIX_BW_172325","last_evcounter":380150203,"name":"Thepchaiya Un-nooh vs Florian Nuessle","tier":2,"fixturetype":1,"starttime":1688036400,"sport_id":"SPT_SNOOKER","competition_id":"CMP_TK_2620","competitor1_id":"TEM_TK_21061","competitor2_id":"TEM_TK_18728","2way":1,"bestof":null,"status":4,"phase":3,"phasedetail":null,"main_market_id":"MAR_BW_21429902","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"is_featured":false,"country":"","score":[{"competitor_id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","winner":null,"score":0,"shortname":"Thepchaiya Un-nooh","country":"TH"},{"competitor_id":"TEM_TK_18728","name":"Florian Nuessle","winner":null,"score":0,"shortname":"Florian Nuessle","country":"AT"}]},"competition":{"id":"CMP_TK_2620","name":"Championship League","tier":2,"sport_id":"SPT_SNOOKER","country":null},"competitor1":{"id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","sport_id":"SPT_SNOOKER","short_name":"Thepchaiya Un-nooh","country":null},"competitor2":{"id":"TEM_TK_18728","name":"Florian Nuessle","sport_id":"SPT_SNOOKER","short_name":"Florian Nuessle","country":null}},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}},"fixture":{"id":"FIX_BW_172325","last_evcounter":380150203,"name":"Thepchaiya Un-nooh vs Florian Nuessle","tier":2,"fixturetype":1,"starttime":1688036400,"sport_id":"SPT_SNOOKER","competition_id":"CMP_TK_2620","competitor1_id":"TEM_TK_21061","competitor2_id":"TEM_TK_18728","2way":1,"bestof":null,"status":4,"phase":3,"phasedetail":null,"main_market_id":"MAR_BW_21429902","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"is_featured":false,"country":"","score":[{"competitor_id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","winner":null,"score":0,"shortname":"Thepchaiya Un-nooh","country":"TH"},{"competitor_id":"TEM_TK_18728","name":"Florian Nuessle","winner":null,"score":0,"shortname":"Florian Nuessle","country":"AT"}]},"competition":{"id":"CMP_TK_2620","name":"Championship League","tier":2,"sport_id":"SPT_SNOOKER","country":null},"competitor1":{"id":"TEM_TK_21061","name":"Thepchaiya Un-nooh","sport_id":"SPT_SNOOKER","short_name":"Thepchaiya Un-nooh","country":null},"competitor2":{"id":"TEM_TK_18728","name":"Florian Nuessle","sport_id":"SPT_SNOOKER","short_name":"Florian Nuessle","country":null}}},"result_txt":"winner"}],"status_txt":"settled","settlestate_txt":"won","payoutmode_txt":"unkown"},"user_label":"pierrekenser (AU)","user_id":"U128164","external_id":"U128164","is_b2b":0,"b2b_partner":"authkrnbet"},{"id":582993,"time":1688042388,"void_event_id":null,"symbol":"AUD","reftype":6,"balance_change":4.3,"bonus_change":0.0,"reserved_change":0.0,"aml_change":0.0,"virtual_change":0.0,"balance":8.6,"bonus":0.0,"reserved":0.0,"amlbalance":0.0,"virtual":0.0,"reftype_txt":"bet_won","reftype_group":"bet","data":{"id":"B12525","type":1,"created_at":1688025449,"updated_at":1688042388,"symbol":"AUD","stake":0.0,"stake_virtual":5.0,"stake_bonus":0.0,"stake_original":0.0,"stake_virtual_original":5.0,"stake_bonus_original":0.0,"user_id":"U128164","external_id":"U128164","status":3,"winnings":4.3,"winnings_original":4.3,"winnings_real":4.3,"winnings_bonus":0.0,"winnings_real_original":null,"winnings_bonus_original":4.3,"validforbonus":0,"total_odds":1.86,"legs":1,"settlestate":2,"parent_id":null,"token_used":1,"token_id":"6_82555e912fa0bce2bfb19b1cce5cf4695e89ea","blversion":33,"partial_id":null,"partial_bet_stake":0.0,"is_resettled":0,"payoutmode":0,"selections":[{"id":19565,"mpid":"SEL_BW_63382359","odds":1.86,"result":1,"placedphase":1,"type":1,"settlereason":null,"market_id":"MAR_BW_21395034","fixture_id":"FIX_BW_177258","info":{"id":"SEL_BW_63382359","market_id":"MAR_BW_21395034","fixture_id":"FIX_BW_177258","name":"Weronika Ewald","name_translation":null,"position":null,"result":1,"odds":1.83,"markettype":"MKT_1249","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_22178","result_txt":"winner","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_22178","name":"Weronika Ewald","sport_id":"SPT_TENNIS","short_name":"Weronika Ewald","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"},"market_details":{"id":"MAR_BW_21395034","tradingstatus":4,"tier":null,"markettype":"MKT_1249","name":"two way - Who will win?","name_translation":null,"settled":1688042388,"fixture_id":"FIX_BW_177258","handicap":null,"category":"match_betting","display_order":2,"is_main":0,"is_open":false,"is_settled":true,"status_txt":"closed","selections":[{"id":"SEL_BW_63382359","market_id":"MAR_BW_21395034","fixture_id":"FIX_BW_177258","name":"Weronika Ewald","name_translation":null,"position":null,"result":1,"odds":1.83,"markettype":"MKT_1249","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_22178","result_txt":"winner","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_22178","name":"Weronika Ewald","sport_id":"SPT_TENNIS","short_name":"Weronika Ewald","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet","c":30}},{"id":"SEL_BW_63382360","market_id":"MAR_BW_21395034","fixture_id":"FIX_BW_177258","name":"Lya Fernandez","name_translation":null,"position":null,"result":2,"odds":1.83,"markettype":"MKT_1249","type":1,"tradingstatus":4,"is_main":0,"competitor_id":"TEM_TK_20662","result_txt":"loser","is_open":false,"status_txt":"closed","competitor":{"id":"TEM_TK_20662","name":"Lya Fernandez","sport_id":"SPT_TENNIS","short_name":"Lya Fernandez","country":null},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}}],"fixture":{"id":"FIX_BW_177258","last_evcounter":386450035,"name":"Weronika Ewald vs Lya Fernandez","tier":4,"fixturetype":1,"starttime":1688036400,"sport_id":"SPT_TENNIS","competition_id":"CMP_TK_236","competitor1_id":"TEM_TK_22178","competitor2_id":"TEM_TK_20662","2way":1,"bestof":null,"status":4,"phase":3,"phasedetail":null,"main_market_id":"MAR_BW_21430067","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"is_featured":false,"country":null,"score":[{"competitor_id":"TEM_TK_22178","name":"Weronika Ewald","winner":null,"score":0,"shortname":"Weronika Ewald","country":"PL"},{"competitor_id":"TEM_TK_20662","name":"Lya Fernandez","winner":null,"score":0,"shortname":"Lya Fernandez","country":"MX"}]},"competition":{"id":"CMP_TK_236","name":"ITF Women - Monastir (TUN) - Hard","tier":4,"sport_id":"SPT_TENNIS","country":null},"competitor1":{"id":"TEM_TK_22178","name":"Weronika Ewald","sport_id":"SPT_TENNIS","short_name":"Weronika Ewald","country":null},"competitor2":{"id":"TEM_TK_20662","name":"Lya Fernandez","sport_id":"SPT_TENNIS","short_name":"Lya Fernandez","country":null}},"_ts":1689846633,"_rexpire":{"ts":1689846633,"at":1689846663,"ttl":30,"bs":"get_fallback_bet"}},"fixture":{"id":"FIX_BW_177258","last_evcounter":386450035,"name":"Weronika Ewald vs Lya Fernandez","tier":4,"fixturetype":1,"starttime":1688036400,"sport_id":"SPT_TENNIS","competition_id":"CMP_TK_236","competitor1_id":"TEM_TK_22178","competitor2_id":"TEM_TK_20662","2way":1,"bestof":null,"status":4,"phase":3,"phasedetail":null,"main_market_id":"MAR_BW_21430067","tag":null,"status_txt":"played","phase_txt":"post_game","version":"0.1.3","metadata":{"is_featured":false,"country":null,"score":[{"competitor_id":"TEM_TK_22178","name":"Weronika Ewald","winner":null,"score":0,"shortname":"Weronika Ewald","country":"PL"},{"competitor_id":"TEM_TK_20662","name":"Lya Fernandez","winner":null,"score":0,"shortname":"Lya Fernandez","country":"MX"}]},"competition":{"id":"CMP_TK_236","name":"ITF Women - Monastir (TUN) - Hard","tier":4,"sport_id":"SPT_TENNIS","country":null},"competitor1":{"id":"TEM_TK_22178","name":"Weronika Ewald","sport_id":"SPT_TENNIS","short_name":"Weronika Ewald","country":null},"competitor2":{"id":"TEM_TK_20662","name":"Lya Fernandez","sport_id":"SPT_TENNIS","short_name":"Lya Fernandez","country":null}}},"result_txt":"winner"}],"status_txt":"settled","settlestate_txt":"won","payoutmode_txt":"unkown"},"user_label":"pierrekenser (AU)","user_id":"U128164","external_id":"U128164","is_b2b":0,"b2b_partner":"authkrnbet"}]',
        ),
      },
    ),
    true,
  );
});

test("more than one type for a property with literal values", () => {
  const cmp = {
    this: {
      can: {
        be: {
          nested: {
            infinitely: types.string,
          },
          and: types.array,
        },
        "work%": [types.number, types.string],
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
    true,
  );

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
          work: "works!",
        },
        fine: ["a", "b", "c"],
      },
    }),
    true,
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
          work: [],
        },
      },
    }),
  );
});

test("more than one type for a property with object values", () => {
  const cmp = {
    "work%": [
      {
        a: types.number,
      },
      {
        b: types.string,
      },
    ],
  };

  assert.is(
    validate(cmp, {
      work: {
        a: 1,
      },
    }),
    true,
  );

  assert.is(
    validate(cmp, {
      work: {
        b: "works!",
      },
    }),
    true,
  );

  assert.throws(() =>
    validate(cmp, {
      work: 0,
    }),
  );
});

test.run();
