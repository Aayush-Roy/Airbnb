const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/papaya";
main().then(()=>{
    console.log("DB connected")
}).catch((err)=>{
    console.log(err);
})

async function main()
{
    await mongoose.connect(MONGO_URL);
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66b89225907c85759eb91c4b"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();