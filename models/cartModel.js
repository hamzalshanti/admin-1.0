module.exports = function Cart(oldCart, qtyStep = 1) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;
  this.add = function (item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    const priceAfterDiscount = parseFloat(
      (
        storedItem.item.productPrice *
        (1 - storedItem.item.discount / 100)
      ).toFixed(2)
    );
    console.log(priceAfterDiscount);
    storedItem.qty += qtyStep;
    storedItem.price = priceAfterDiscount * storedItem.qty;
    this.totalQty += qtyStep;
    this.totalPrice += priceAfterDiscount;
  };
  this.getArrayOfItems = function () {
    let itemsArray = [];
    for (let id in this.items) {
      itemsArray.push(this.items[id]);
    }
    return itemsArray;
  };
};
