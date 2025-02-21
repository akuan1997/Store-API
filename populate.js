require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./products.json');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        // await Product.deleteMany()  // 刪除Product集合中的所有資料
        await Product.create(jsonProducts)  // 插入新的資料 (jsonProducts)
        console.log("DB Connected");
        // process.exit(0)
    } catch (error) {
        console.log(error)
        // process.exit(1)
    }
}

start()