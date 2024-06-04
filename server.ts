import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

import { userRouter } from "./api/routes/userRouter";
import productRouter from "./api/routes/products";
import imageKitRouter from "./api/routes/imageKit";
import initializePassport from "./api/services/passport";
import passport from "passport";

const app = express();
initializePassport(passport);

/*----------->> MIDDLEWARE <<-----------*/
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/*----------->> ROUTERS <<-----------*/
app.use("/products", productRouter);
app.use("/user", userRouter);
app.use("/imagekit", imageKitRouter);

app.listen(3001, () => console.log("server running on port 3001"));
