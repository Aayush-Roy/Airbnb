const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing");
main().then(()=>{
    console.log("DB connected")
}).catch((err)=>{
    console.log(err);
})

async function main()
{
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.get("/",(req,res)=>{
    res.send("Hi, I'm Root");
})
//INDEX ROUTE
app.get("/listings",async(req,res)=>{
    let allListings = await Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs",{allListings});
})
// app.get("/test", async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new House",
//         description:"by the beach",
//         location:"colaburu, Goa",
//         country:"India",
//     });
//    await sampleListing.save()
//    console.log("saved succesfull");
//    res.send("successfull testing");
// })

//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
//CREATE ROUTE
app.post("/listings",async (req,res)=>{
    // let listing = req.body.listing;
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings");
});

//EDIT ROUTE
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
})

//SHOW ROUTE
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});
//UPDATE ROUTE
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//DELETE ROUTE

app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

app.listen(8080,()=>{
    console.log(`app listening on port 8080`)
});