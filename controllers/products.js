const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    // throw new Error('testing async error')  // testing
    // const products = await Product.find({});
    // const search = 'be'
    const products = await Product
        .find({ price: { $gt: 108 } })  // price超過這個數字的才顯示
        .sort('name')
        .select('name price')
        // .limit(3)
        // .skip(1)  // 跳過第一個，一樣會顯示三個 (limit=3)
    // const products = await Product.find({
    //     // featured:true,
    //     name: 'vase table'
    // });
    res.status(200).json({ products, nbHits: products.length })
}
const getAllProducts = async (req, res) => {
    // console.log(req.query)  // 記得是query不是body
    // const products = await Product.find(req.query)
    const { featured, company, name, sort, fields, numericFilters } = req.query
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
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        console.log(filters);
        const options = ['price', 'rating'];
        filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                if (!queryObject[field]) {
                    queryObject[field] = {};  // 確保 field 是物件
                }
                queryObject[field][operator] = Number(value);  // 避免覆蓋
            }
        });
    }
    // console.log(queryObject)
    // const products = await Product.find(queryObject)
    let result = Product.find(queryObject)
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProductsStatic,
    getAllProducts,
}