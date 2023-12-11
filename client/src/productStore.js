// Coffee: price_1LnUTFDM1jwCEz8OGoOSXiSM
// Sunglasses: price_1LnUTxDM1jwCEz8OAqHYTwKQ
// Camera: price_1LnUUoDM1jwCEz8OvxIcJ7to

const productsArray = [
    {
        id: "price_1LnUTFDM1jwCEz8OGoOSXiSM",
        title: "Verus Miner",
        price: 150.00
    },
    {
        id: "price_1LnUTxDM1jwCEz8OAqHYTwKQ",
        title: "PaddyPool Miner",
        price: 150.00
    },
    {
        id: "price_1LnUUoDM1jwCEz8OvxIcJ7to",
        title: "Slate",
        price: 65.99
    }
];

function getProductData(id) {
    let productData = productsArray.find(product => product.id === id);

    if (productData === undefined) {
        console.log("Product data does not exist for ID: " + id);
        return undefined;
    }

    return productData;
}

export { productsArray, getProductData };