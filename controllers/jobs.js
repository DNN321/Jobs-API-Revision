const express = require ('express')
const Jobs = require ('../models/Job')
const {Badrequest,UnauthenticatedError} = require ('../errors')
//const jwt = require ('jsonwebtoken')
const verifyUser = require ('../middleware/authentication')
const StatusCodes = require ('http-status-codes')

//getAllJobs
//getonejob
//createJob
//updatedJob
//deleteJob

const getAllJobs = async (req,res)=>{
    const allJobs = await Jobs.find({}).sort('createdAt')
    console.log(allJobs)
    res.status(StatusCodes.CREATED).json({allJobs})
}

//:id
const getOneJob = async (req,res)=>{
    const jobId = req.params.id
    const specificJob = await Jobs.findOne({_id:jobId})
    res.status(StatusCodes.CREATED).json({specificJob})
}


const createJob = async (req,res)=>{
    // const {company, position } = req.body
    // if (!company || !position){
    //     throw new Badrequest('insert both fields',400)
    // }
    req.body.createdBy = req.user.userId
    const createuserjob = await Jobs.create(req.body)
    res.status(StatusCodes.CREATED).json({createuserjob})
}

//:id
//pick a job id
//
//
const updateJob = async (req,res)=>{
    const jobId = req.params.id
    const updateJobId = await Jobs.findByIdAndUpdate({_id:jobId},req.body,
    {new:true,runValidators:true})
    res.status(StatusCodes.OK).json({updateJobId})
}


//:id
const deleteJob = async (req,res)=>{
    const jobId = req.params.id
    const deleteAJob = await Jobs.findByIdAndDelete({_id:jobId})
    res.status(StatusCodes.OK).json({deleteAJob})
}

module.exports = {getAllJobs,getOneJob,createJob,updateJob,deleteJob}