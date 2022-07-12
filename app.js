require('dotenv').config()
const express = require('express')
const port = 3000
const app = express()
const router = require('./router')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(router)

app.listen(port, () => {
  console.log('listening to ' + port)
})

