const jwt = require ('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')


// const auth = async (req, res, next) => {
//     // check header
//     const authHeader = req.headers.authorization
//     if (!authHeader || !authHeader.startsWith('Bearer')) {
//       throw new UnauthenticatedError('Authentication invalid')
//     }
//     const token = authHeader.split(' ')[1]
  
//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET)
//       // attach the user to the job routes
//       req.user = { userId: payload.userId, name: payload.name }
//       next()
//     } catch (error) {
//       throw new UnauthenticatedError('Authentication invalid')
//     }
//   }
  
//   module.exports = auth
  


const verifyUser = async (req, res, next) => {


    //jwtverify
    const userSession = req.headers.authorization
    if (!userSession || !userSession.startsWith('Bearer')){
        throw new UnauthenticatedError('session not verified')
    }

    const token = userSession.split(' ')[1]

    const accountVerify = jwt.verify(token,process.env.JWT_SECRET)
    req.user = {userId:accountVerify.userId,name:accountVerify.name}
    next()
    

}
module.exports = verifyUser