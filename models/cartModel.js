module.exports = function Cart(oldCart, qtyStep = 1) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;
  this.coupon = oldCart.coupon || 'none';
  this.add = function (item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    const priceAfterDiscount =
      storedItem.item.productPrice * (1 - storedItem.item.discount / 100);

    storedItem.qty += qtyStep;
    storedItem.price = priceAfterDiscount * storedItem.qty;
    this.totalQty += qtyStep;
    this.totalPrice += qtyStep * priceAfterDiscount;
  };
  this.update = function (item, id, newQty) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    const priceAfterDiscount =
      storedItem.item.productPrice * (1 - storedItem.item.discount / 100);

    this.totalQty -= storedItem.qty;
    this.totalPrice -= storedItem.qty * priceAfterDiscount;
    storedItem.qty = newQty;
    storedItem.price = priceAfterDiscount * storedItem.qty;
    this.totalQty += newQty;
    this.totalPrice += newQty * priceAfterDiscount;
  };
  this.deleteItem = function (id) {
    this.totalPrice -= this.items[id].price;
    this.totalQty -= this.items[id].qty;
    delete this.items[id];
  };
  this.getArrayOfItems = function () {
    let itemsArray = [];
    for (let id in this.items) {
      itemsArray.push(this.items[id]);
    }
    return itemsArray;
  };
};
