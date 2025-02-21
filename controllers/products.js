const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    // throw new Error('testing async error')  // testing
    // const products = await Product.find({});
    // const search = 'be'
    const products = await Product.find({
        // search = 'a'，匹配任何含有a的name
        // $options: 'i' → 忽略大小寫（case-insensitive）
        // name: { $regex: search, $options: 'i'},
    }).sort('price')
    // const products = await Product.find({
    //     // featured:true,
    //     name: 'vase table'
    // });
    res.status(200).json({ products, nbHits: products.length })
}
const getAllProducts = async (req, res) => {
    // console.log(req.query)  // 記得是query不是body
    // const products = await Product.find(req.query)
    const { featured, company, name } = req.query
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i'}
    }
    console.log(queryObject)
    const products = await Product.find(queryObject)
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProductsStatic,
    getAllProducts,
}