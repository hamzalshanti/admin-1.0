const { isArray } = require('lodash');
const fetch = require('node-fetch');

const getRate = async (ISO) => {
  try {
    const currencyResponse = await fetch(process.env.CURRENCY_API + ISO);
    const currencyDetails = await currencyResponse.json();
    return parseFloat(currencyDetails['rates'][ISO]);
  } catch {
    return 1.0;
  }
};

const formatCurrency = async (ISO = 'USD', item) => {
  const rate = await getRate(ISO);
  if (isArray(item)) {
    item.forEach((product) => {
      product.product.price *= rate;
    });
  } else {
    item.product.price *= rate;
  }
  return item;
};

const formatCurrencyCart = async (ISO, cart) => {
  const rate = await getRate(ISO);
  for (let id in cart.items) {
    cart.items[id].item.price *= rate;
    cart.items[id].price *= rate;
  }
  cart.totalPrice *= rate;
};

const formatValue = async (ISO, value) => {
  const rate = await getRate(ISO);
  return rate * value;
};

const currencySymbol = {
  USD: '$',
  ILS: '₪',
  EUR: '€',
};

module.exports = {
  formatCurrency,
  currencySymbol,
  formatCurrencyCart,
  formatValue,
};
