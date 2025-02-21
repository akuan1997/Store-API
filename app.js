require('dotenv').config()

const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const productRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routes
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

app.use('/api/v1/products', productRouter)
// products route

const port = process.env.PORT || 3000

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const start = async (req, res) => {
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server started on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()