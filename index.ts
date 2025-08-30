import express from "express";
import cors from "cors";
import session, { SessionOptions } from "express-session";
import path from "path";

import corsOptions from "./api/config/cors/corsOptions";

import root from "./api/root";
import userRouter from "./api/routes/userRouter";
import adminRoute from "./api/routes/adminRoute";
import productRouter from "./api/routes/products";
import imageKitRouter from "./api/routes/imageKit";
import password from "./api/routes/password";
import tokenRoute from "./api/routes/tokenRoute";
import initializePassport from "./api/services/passport";
import passport from "passport";
import authenticationRouter from "./api/routes/OAuthRouter";
import userCart from "./api/routes/userCart";
import userReviews from "./api/routes/userReviews";
import payments from "./api/routes/payments";
import inventoryRoutes from "./api/routes/inventoryRoutes";
import salesOrder from "./api/routes/salesOrder";
import initializeSocket from "./api/services/socketIO";
import { checkAuth } from "./api/middleware/authentication";
import cookieParser from "cookie-parser";
import initCronJob from "./api/config/cronJob";

const app = express();

initializePassport(passport);

// /*----------->> MIDDLEWARES <<-----------*/
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(cors(corsOptions));

const cookieOptions: any =
  process.env.NODE_ENV === "production"
    ? {
        sameSite: "none",
        secure: true,
      }
    : {};

const sessionMW = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: cookieOptions,
});

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(sessionMW);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
// initCronJob();

// /*----------->> ROUTERS <<-----------*/

app.use("/", root);
app.get("/health", (_, res) => res.send("ok"));
app.use("/user", userRouter);
app.use("/admin", adminRoute);
app.use("/reviews", userReviews);
app.use("/products", productRouter);
app.use("/inventory", inventoryRoutes);
app.use("/auth", authenticationRouter);
app.use("/password", password);
app.use("/token", tokenRoute);

app.use("/imagekit", checkAuth, imageKitRouter);
app.use("/cart", checkAuth, userCart);
app.use("/rzp", checkAuth, payments);
app.use("/orders", checkAuth, salesOrder);

app.all("*", (_, res) => {
  res.sendFile("404.html", { root: "./public" });
});

/*----------->> ERROR HANDLER <<-----------*/

app.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.log("ERROR HANDLER_SERVER", err);
    console.log(err);

    // res.status(err.code).send(err.error);
  }
});

const server = app.listen(3001, () => console.log("server running on port 3001"));
// initializeSocket(server);
