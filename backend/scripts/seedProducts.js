const { faker } = require("@faker-js/faker");

function generateProducts(count = 10) {
  const products = [];

  for (let i = 0; i < count; i++) {
    products.push({
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price({ min: 10, max: 200 })),
      stock: faker.number.int({ min: 1, max: 50 }),
      category: {
        name: faker.commerce.department()
      }
    });
  }

  return products;
}

const products = generateProducts(10);

console.log(products);