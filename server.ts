import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

import userRouter from "./api/routes/userRouter";
import productRouter from "./api/routes/products";
import imageKitRouter from "./api/routes/imageKit";
import initializePassport from "./api/services/passport";
import passport from "passport";
import authenticationRouter from "./api/routes/OAuthRouter";

const app = express();
app.set("view engine", "ejs");
initializePassport(passport);

/*----------->> MIDDLEWARES <<-----------*/
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.get("/asd", (req, res) => {
  res.json({ user: "asdasdasdasd" });
});
app.use("/auth", authenticationRouter);
app.use("/products", productRouter);
app.use("/user", userRouter);
app.use("/imagekit", imageKitRouter);

app.listen(3001, () => console.log("server running on port 3001"));
