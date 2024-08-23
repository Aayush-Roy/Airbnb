if(process.env.NODE_ENV!="production")
{
    require('dotenv').config();
}
console.log(process.env.secret);
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
// const MONGO_URL = "mongodb://127.0.0.1:27017/papaya";
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");

const dbUrl = process.env.ATLASDB_URL;
console.log("Database URL:", dbUrl);
main().then(()=>{
    console.log("DB connected")
}).catch((err)=>{
    console.log(err);
})

async function main()
{
    await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));



app.get("/",(req,res)=>{
    res.send("Hi, I'm Root");
})

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings",listingRouter);
app.use("/",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error",{message});
    console.log(err);
})
app.listen(8080,()=>{
    console.log(`app listening on port 8080`)
});

