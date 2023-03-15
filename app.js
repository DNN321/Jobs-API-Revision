require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//security packages
//helmet - sets up various HTTP headers to secure from corss site scripting, clickjacking and other types of injection
const helmet = require ('helmet')
//cors - (cross origin resource sharing) allows Javascript files , API, fonts to be requested from another domain
const cors = require ('cors')
//xss-clean - protects against cross site scripting
const xss = require ('xss-clean')
//express-rate-limit - protects against bruteforce attacks
const ratelimiter = require ('express-rate-limit')

//router
const router = require ('./routes/auth')
const jobsRouter = require ('./routes/jobs')
const verifyUser = require ('./middleware/authentication')

//db
const connectDB = require ('./db/connect')
require('dotenv').config

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
//security
app.use(helmet())
app.use(cors())
app.use(xss())
app.set('trust proxy', 1)
app.use(ratelimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}))
//routes
app.use('/api/v1/auth',router)
app.use('/api/v1/jobs',verifyUser,jobsRouter)

 

// extra packages

// routes
// app.get('/', (req, res) => {
//   res.send('jobs api');
// });

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI),console.log('connected to db')
    app.listen(port, () =>console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
