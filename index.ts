import express from "express";
import cors from "cors";
import session from "express-session";
import path from 'path'

import corsOptions from "./api/config/cors/corsOptions";

import root from './api/root'
import userRouter from "./api/routes/userRouter";
import productRouter from "./api/routes/products";
import imageKitRouter from "./api/routes/imageKit";
import initializePassport from "./api/services/passport";
import passport from "passport";
import authenticationRouter from "./api/routes/OAuthRouter";
import userCart from "./api/routes/userCart";
import userReviews from "./api/routes/userReviews";
import payments from "./api/routes/payments";
import salesOrder from "./api/routes/salesOrder";
import initializeSocket from './api/services/socketIO'
import { checkAuth } from "./api/middleware/authentication";

const app = express();

initializePassport(passport);

// /*----------->> MIDDLEWARES <<-----------*/
app.use('/', express.static(path.join(__dirname, '/public')))
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionMW = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  // cookie: {
  //   sameSite: 'none',
  //   secure: true,
  // }
})

app.set('trust proxy', 1)
app.use(sessionMW);

app.use(passport.initialize());
app.use(passport.session());

// /*----------->> ROUTERS <<-----------*/

app.use('/', root)
app.use("/products", productRouter);
app.use("/reviews", userReviews);
app.use("/user", userRouter);
app.use("/auth", authenticationRouter);
app.use("/imagekit", imageKitRouter);

// app.use(checkAuth)

app.get("/health", (_, res) => res.send('ok'));
app.use("/cart", userCart);
app.use("/rzp", payments);
app.use("/orders", salesOrder);

app.all('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'views', '404.html'))
})


/*----------->> ERROR HANDLER <<-----------*/

app.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.log("ERROR HANDLER_SERVER", err);
    console.log(err);

    // res.status(err.code).send(err.error);
  }
});

const server = app.listen(3001, () => console.log("server running on port 3001"));
initializeSocket(server)
