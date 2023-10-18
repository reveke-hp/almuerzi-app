const express = require('express')
const Orders = require('../models/Orders')
const router = express.Router()
const {isAutenticated, hasRole, hasRoles} = require('../auth')

router.get('/',(req,res)=>{
    Orders.find().exec().then(x=> res.status(200).send(x)) // busco todo, ejecuta y vuelve promesa
})

router.get('/:id',(req,res)=>{
    Orders.findById(req.params.id)
     .exec()
     .then(x=> res.status(200).send(x))
})

router.post('/', isAutenticated,(req,res)=>{
    const { _id } = req.user
    Orders.create(req.body)
     .then((x)=> res.status(201).send(x))
})

router.put('/:id', isAutenticated,hasRoles(['admin','user']),(req,res)=>{ // con el hasRole valido de que el user tenga cierto rol para ejecutar
    Orders.findByIdAndUpdate(req.params.id,req.body)// (elemento.id, actualizacionElemento)
     .then(() => res.sendStatus(204)) //(callback Con documento completo)
    
})

router.delete('/:id', isAutenticated,(req,res)=>{
    Orders.findByIdAndDelete(req.params.id).exec()
     .then(()=> res.sendStatus(204))//(codigoError)
})

module.exports = router