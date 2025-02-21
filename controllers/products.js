const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    // throw new Error('testing async error')  // testing
    // const products = await Product.find({});  // 原本都是false，
    const products = await Product.find({
        // featured:true,  // 全部都變true
        name: 'vase table'
    });
    res.status(200).json({ products, nbHits: products.length })
}
const getAllProducts = async (req, res) => {
    // console.log(req.query)  // 記得是query不是body
    const products = await Product.find(req.query)
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProductsStatic,
    getAllProducts,
}