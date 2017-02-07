const {assert} = require('chai');
const bayes = require('../lib/bayes');
const find = require('lodash/find');
const reduce = require('lodash/reduce');

suite('bayes', () => {
  test('#computeBinaryProbabilityDistribution', () => {
    const distribution = bayes.computeBinaryProbabilityDistribution([
      true,
      true,
      true,
      true,
      false
    ]);

    const mostLikely = reduce(distribution, (result, p, x) => {
      return p > result.p ? {x, p} : result;
    }, {x: null, p: 0});

    // If we see H, H, H, H, T then bias = 0.8 should be likely.
    assert.equal(mostLikely.x, 0.8);
  });

  test('#predictBinaryBias', () => {
    assert.equal(
      bayes.predictBinaryBias([true, true, true, true, false]).prediction,
      0.8
    );
  });

  test('#predictBinaryBias counts', () => {
    assert.equal(
      bayes.predictBinaryBias(4, 1).prediction,
      0.8
    );
  });
});
