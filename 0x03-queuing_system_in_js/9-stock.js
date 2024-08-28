const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const listProducts = [
    { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
    { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
    { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
    { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];


//retrieves item by is
function getItemById(id) {
    return listProducts.find((item) => item.itemId === id);
}


//redis client setup
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


//server setup
const app = express();
const PORT = 1234;


//reserves stock by ID
async function reserveStockById(itemId, stock) {
    await setAsync( `item.${itemId}`, stock);
}

//retrieves reserved stock by ID
async function getReservedStockById(itemId) {
    const stock = await getAsync(`item.${itemId}`);
    return stock ? parseInt(stock, 10) : null;
}


//routes
app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId, 10);
    const item = getItemById(itemId);

    if (!item) {
        res.json({status: 'Product not found'});
        return;
    }

    const currentStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = currentStock != null ? currentStock : item.initialAvailableQuantity;
    res.json({ ...item, currentQuantity })
});


//route to reserve stock by ID
app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId, 10);
    const item = getItemById(itemId);

    if (!item) {
        res.json({ status: 'Product not found' });
        return;
    }

    const currentStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = currentStock !== null ? currentStock : item.initialAvailableQuantity;

    if (currentQuantity <= 0) {
        res.json({ status: 'Not enough stock available', itemId });
        return;
    }

    await reserveStockById(itemId, currentQuantity - 1);
    res.json({ status: 'Reservation confirmed', itemId });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);

});