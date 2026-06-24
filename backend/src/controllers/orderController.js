const orders = [
  {
    id: 1,
    customerName: "Maria Popescu",
    products: [
      {
        productId: 1,
        quantity: 2,
        priceAtPurchase: 45,
        productSnapshot: {
          name: "Gel UV Clear",
          category: "Geluri UV"
        }
      }
    ],
    status: "pending"
  }
];

function getOrders(req, res) {
  res.json(orders);
}

module.exports = {
  getOrders
};