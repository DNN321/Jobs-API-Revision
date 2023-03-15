const mongoose = require ('mongoose')
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')

const userSchema = new mongoose.Schema ({
    name:{
        type:String,
        required:[true, 'input your name'],
        minlength:3,
        maxlength:20
    },
    email:{
        type:String,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Insert correct email'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'input your password'],
        minlength:3,
        maxlength:20
    }
})

//middleware
//bcrypt.genSalt
//bcrypt.hash
userSchema.pre('save', async function() {
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hashSync(this.password,salt)
});

//Instance Methods
userSchema.methods.createJWT =  function() {
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})

  };

//Instance Methods
userSchema.methods.comparePassword = async function(userPassword) {
    const pswd = await bcrypt.compare(userPassword,this.password)
    return pswd
  };
 

 

module.exports = mongoose.model ('User',userSchema)