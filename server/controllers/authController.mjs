import models from '../models/index.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from "crypto"

const generateKeyPair = () => {
    const keyPair = crypto.generateKeyPairSync("rsa", {
        modulusLength:4096,
        publicKeyEncoding: {
            type:'spki',
            format:'pem',
        },
        privateKeyEncoding: {
            type:'pkcs8',
            format:'pem'
        }
    })

    return {
        publicKey: keyPair.publicKey,
        privateKey:keyPair.privateKey
    }
}

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id, 
            email: user.email, 
            publicKey: user.publicKey
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h"
        }
    )
}

const login = async (req, res, next) => {
    try {
        const user = await models.User.findOne({
            where: {
                email: req.body.email
            }
        })
    
        if (user) {
            const isValidPassword = await bcrypt.compare(req.body.password, user.password)
            if (!isValidPassword) return res.status(401).json({message: "Invalid email or password"})
            
            const token = generateToken(user)
            
            return res.status(200).json({
                message: "Login successful!",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    publicKey: user.publicKey
                }
            })
        }
        else {
            return res.status(401).json({message: "Invalid email or password"})
        }
    } catch (error) {
        console.log(error);
    }
}

const register = async (req, res, next) => {
    try {
        console.log('i am here')
        const existingUser = await models.User.findOne({
            where: {
                email: req.body.email
            }
        })
        console.log(req.body)
        if (existingUser) return res.status(401).json({message: "Email is already in use"});
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        const {publicKey, privateKey}= generateKeyPair();
        
        const user = await models.User.create({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName:req.body.lastName,
            password: passwordHash,
            publicKey:publicKey
        })
        
        console.log("user created")
        const token = generateToken(user)
        
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                publicKey: user.publicKey
            },
            privateKey:privateKey
        })
    } catch (error) {
        console.log("Error: ", error)
        next(error);
    }
}

export default {
    register,
    login,    
}