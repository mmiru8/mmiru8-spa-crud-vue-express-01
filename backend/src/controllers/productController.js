const products = [
  {
    id: 1,
    name: "Gel UV Clear",
    price: 45,
    category: {
      name: "Geluri UV",
      features: ["transparent", "constructie"]
    },
    stock: {
      quantity: 20,
      warehouse: "Bucuresti"
    }
  },
  {
    id: 2,
    name: "Oja semipermanenta nude",
    price: 32,
    category: {
      name: "Oje semipermanente",
      features: ["nude", "lucios"]
    },
    stock: {
      quantity: 35,
      warehouse: "Brasov"
    }
  },
  {
    id: 3,
    name: "Top coat no wipe",
    price: 38,
    category: {
      name: "Finish",
      features: ["luciu", "fara degresare"]
    },
    stock: {
      quantity: 15,
      warehouse: "Bucuresti"
    }
  }
];

function getProducts(req, res) {
  res.json(products);
}

module.exports = {
  getProducts
};