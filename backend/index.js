const express = require("express");
const database = require("./config/database")
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/User");


const app = express();

app.use(express.json());

//database connect
database.connect();



require("dotenv").config();
const PORT = process.env.PORT || 4000;



//routes
app.use("/api/v1/auth", userRoutes);


app.get("/",(req,res)=>{
   return res.json({
        success:true,
        message:"your server is up and running"
    });
});

app.listen (PORT,()=>{
    console.log(`App is running at ${PORT}`);
});