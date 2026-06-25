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
function createOrder(req, res) {
  const { customerName, productId, quantity } = req.body;

  if (!customerName || !productId || !quantity) {
    return res.status(400).json({
      message: "Date comanda incomplete"
    });
  }

  res.status(201).json({
    message: "Comanda validata corect",
    order: {
      customerName,
      productId,
      quantity
    }
  });
}
module.exports = {
  getOrders,
  createOrder
};