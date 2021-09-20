require('dotenv').config()
const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send('Hello Mycotopia.')
})

app.listen(process.env.PORT || 3000, () => {
    console.info(`Server running on  http://localhost:${process.env.PORT || 3000}`)
})