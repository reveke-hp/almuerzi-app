const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser') //importo npm i -S body-parser
const cors = require('cors')
const Schema = mongoose.Schema
const meals = require('./routes/meals')
const orders = require('./routes/orders')
const auth = require('./routes/auth') //ruta de autentificacion
const app = express() 
app.use(bodyParser.json()) // defino que use .json
app.use(cors()) // para usar la app desde localhost

mongoose.connect(process.env.MONGODB_URI,{ userNewUrlParser: true, useUnifiedTopology: true})

app.use('/api/meals',meals)
app.use('/api/orders',orders)
app.use('/api/auth',auth)


module.exports = app