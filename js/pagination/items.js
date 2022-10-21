let products = []

let item = {};

for (let i = 1; i <= 35; i++) {
    item = {
        img: `imgs/product/product${i}.webp`,
        name: `Item${i}`,
        price: Math.floor((Math.random() * 200) + 200),
        oldPrice: Math.floor((Math.random() * 200) + 300),
    }

    products.push(item);
}
