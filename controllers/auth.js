const express = require ('express')
const User = require ('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const StatusCodes = require('http-status-codes')


const userRegister = async (req,res)=>{
    const userInfo = req.body
    const userDb = await User.create(userInfo)
    res.status(200).json({userDb})
}

//createJWT
//compare the password with the hashed password in the db
const userLogin = async (req,res)=>{
    const {password, email,name} = req.body
    if (!password || !email || !name){
        throw new BadRequestError ('insert the required fileds',400)
    }
//check userdetails by email in database
const userDetails = await User.findOne({email,name})
try {
    if (userDetails == null){
        throw new UnauthenticatedError('insert correct email',400)
    }
} catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({msg:'bad authentication'})
}

//check password
    const passwordChecker = await userDetails.comparePassword(password)
    if (!passwordChecker){
        throw new UnauthenticatedError('insert correct password',400)
    }
//createJWT
    const token = userDetails.createJWT()
    res.status(200).json({userDetails,token})

}

module.exports = {userRegister,userLogin}