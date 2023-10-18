const express = require('express')
const Users = require('../models/Users')
const crypto = require('crypto') // sirve para encriptar la pass
const jwt = require('jsonwebtoken') // npm i -S jsonwebtoken
const { isAuthenticated } = require('../auth')

const router = express.Router()

const singToken = (_id) =>{
    return jwt.sign(_id,'mi-secreto',{// (idAEncriptar, String complicado para encriptar todo)
        expiresIn: 60 * 60 * 24 * 365 //tiempo (dura 1 año con estos datos)
    }) 
}

router.post('/register',(req,res)=>{
    const {email,password} = req.body //obtengo email y pass
    crypto.randomBytes(16,(err,salt) =>{
        const newSalt = salto.toString('base64')
        crypto.pbkdf2(password,newSalt,10000,64,'shail',(err,key)=>{ // encripto pass
            //(password,salt,cantiterations,keylen(longuitud llave),metodo encriptacion,callback)
            const encryptedPassword = key.toString('64')
            Users.findOne({email}).exec()
                .then(user => {
                    if (user){
                        return res.send('Usuario ya existe')
                    }
                    Users.create({
                        email,
                        password: encryptedPassword,
                        salt: newSalt,
                    }).then(()=>{
                        res.send('Usuario creado con exito.')
                    })
                })
        }) 
    })

})
router.post('/login',(req,res)=>{
    const {email,password} = req.body
    Users.findOne({email}.exec())
     .then(user => {
        if (!user){
            return res.send('Usuario y/o contraseña incorrecta')
        }
        crypto.pbkdf2(password,user.Salt,10000,64,'shail',(err,key)=>{
            const encryptedPassword = key.toString('base64')
            if(user.password === encryptedPassword){
                const token = singToken(user._id)
                return res.send({token})
            }
            res.send('Usuario y/o contraseña incorrecta')
        })
     })
})
//nuevo endpoint para devolver datos
router.get('/me', isAuthenticated,(req,res)=>{
    res.send(req.user)
})




module.exports = router