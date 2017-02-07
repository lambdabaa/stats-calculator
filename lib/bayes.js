const range = require('lodash/range');
const reduce = require('lodash/reduce');

/**
 * This function takes an array of binary events and computes
 * the probability distribution that the events were generated
 * by a process (eg coin flipping) with different biases.
 */
function computeBinaryProbabilityDistribution(events) {
  const distribution = createUniformDistribution(101);
  return applyEventsToBinaryDistribution(distribution, events);
}

function predictBinaryBias(events) {
  const distribution = computeBinaryProbabilityDistribution(events);
  const result = reduce(distribution, (result, p, x) => {
    return p > result.p ? {x, p} : result;
  }, {x: null, p: 0});

  return {prediction: result.x, confidence: result.p};
}

function applyEventsToBinaryDistribution(distribution, events) {
  if (events.length === 0) {
    return distribution;
  }

  const event = events[events.length - 1];

  const pevent = reduce(distribution, (sum, p, x) => {
    return sum + p * (event ? x : 1 - x);
  }, 0);

  const next = reduce(distribution, (result, prior, x) => {
    // Apply bayes rule to the event.
    // P(x|event) = P(event|x) * prior / P(event)
    const posterior = (event ? x : 1 - x) * prior / pevent;
    return Object.assign({}, result, {[x]: posterior});
  }, {});

  return applyEventsToBinaryDistribution(
    next,
    events.slice(0, events.length - 1)
  );
}

function createUniformDistribution(precision) {
  return range(precision).reduce(
    (result, num) => {
      return Object.assign(
        {},
        result,
        {[num / (precision - 1)]: 1 / (precision - 1)}
      );
    },
    {}
  );
}

exports.computeBinaryProbabilityDistribution = computeBinaryProbabilityDistribution;
exports.predictBinaryBias = predictBinaryBias;
