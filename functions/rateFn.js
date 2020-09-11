const Rate = require('../models/rateModel');

/** Check user rete product before */
async function isRateBefore(req) {
  const rateExist = await Rate.findOne({
    productId: req.params.id,
    userId: req.user._id,
  });
  return rateExist ? false : true;
}

/** Get Reviews Details */
async function getRateDetails(req) {
  const rates = await Rate.find({ productId: req.params.id });
  const details = {};
  details.oneRate = countOfEachRate(rates, 1);
  details.twoRate = countOfEachRate(rates, 2);
  details.threeRate = countOfEachRate(rates, 3);
  details.fourRate = countOfEachRate(rates, 4);
  details.fiveRate = countOfEachRate(rates, 5);
  return details;
}

/** Filter Rates */
function countOfEachRate(rates, value) {
  return rates.filter((rate) => rate.rate === value).length;
}

module.exports = {
  isRateBefore,
  getRateDetails,
};
