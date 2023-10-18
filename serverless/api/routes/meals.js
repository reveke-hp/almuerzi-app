const express = require('express')
const router = express.Router()
const Meals = require('../models/Meals')



router.get('/',(req,res)=>{
    Meals.find().exec().then(x=> res.status(200).send(x)) // busco todo, ejecuta y vuelve promesa
})

router.get('/:id',(req,res)=>{
    Meals.findById(req.params.id)
     .exec()
     .then(x=> res.status(200).send(x))
})

router.post('/',(req,res)=>{
    Meals.create(req.body)
     .then((x)=> res.status(201).send(x))
})

router.put('/:id',(req,res)=>{
    Meals.findByIdAndUpdate(req.params.id,req.body)// (elemento.id, actualizacionElemento)
     .then(() => res.sendStatus(204)) //(callback Con documento completo)
    
})

router.delete('/:id',(req,res)=>{
    Meals.findByIdAndDelete(req.params.id).exec()
     .then(()=> res.sendStatus(204))//(codigoError)
})


module.exports = router