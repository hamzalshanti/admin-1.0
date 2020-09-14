const isEqual = function (v1, v2, options) {
  if (v1.toString() === v2.toString()) {
    return options.fn(this);
  }
  return options.inverse(this);
};

const discount = function (price, discount) {
  return (price * (1 - discount / 100)).toFixed(2);
};

const getRatingWidth = function (rate) {
  const starPercentage = (rate / 5) * 100;
  return `${starPercentage}%`;
};

const rateProgress = function (starRate, totalCount) {
  if (starRate === 0 && totalCount === 0) return '0%';
  return `${(starRate / totalCount) * 100}%`;
};

module.exports = {
  isEqual,
  discount,
  getRatingWidth,
  rateProgress,
};
