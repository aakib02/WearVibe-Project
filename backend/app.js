const express = require('express') 
const userRouter = require('./routes/userRouter')
const vendorRouter = require('./routes/vendorRouter')
const productRouter = require('./routes/productRouter')
const navbarRouter =  require('./routes/navbarRouter')
const dotenv =  require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser())
app.use(express.json())
dotenv.config()
const dbConnect = require('./DB/dbConfig')
app.use('/uploads', express.static('uploads'));

app.use(cors({
    origin: "http://127.0.0.1:5500", 
    credentials: true, 
}));

app.use('/api',productRouter)
app.use('/api',userRouter)
app.use('/api',vendorRouter)
app.use('/api',navbarRouter)
dbConnect()
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});


app.listen(process.env.PORT , () => {
    console.log(`server is running on port ${process.env.PORT}`)
})