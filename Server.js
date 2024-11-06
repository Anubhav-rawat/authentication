// server.js
import express from "express";
import connectDB from "./config/dbConfig.js";
import authRoutes from "./routes/authRoutes.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

connectDB();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// now here is a big task for you so basically you have to make apis so give the proper folder structure like routes, controllers, models, utils,config(db.config.js) etc i have setup the backend and connected it with the mongodb so now you have make first the user registration api in which user will enter fullname , email ,mobile ,number ,password and confirm password and after entering entering this details he will get otp on registered email address and after veryfiying that otp user will be registered in mongodb  and with the login listen carefully please there will be google authentihicater means after entring email and password user will get 2facter authentication otp code on google authenticater and then that we have to verify in order to get login, basically 2 facter authenthication wil be there using google authenticater and also there will be forgetten password api in order user forgets the passowrd then a simple otp will be sent to registered email address and then after veryfing user will be able to set the new password and login so make this in aproper and neat way and also tell all the dependiecs to be insatlled and nodemon is already set up in my backend and type module is also been setup in the code so tell accordingly give the dotenv file also   and the project has been setup into authentication folder
