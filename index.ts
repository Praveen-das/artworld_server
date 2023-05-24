import express from "express";
// import cors from "cors";
// import session from "express-session";

// import userRouter from "./api/routes/userRouter";
// import productRouter from "./api/routes/products";
// import imageKitRouter from "./api/routes/imageKit";
// import initializePassport from "./api/services/passport";
// import passport from "passport";
// import authenticationRouter from "./api/routes/OAuthRouter";
// import userCart from "./api/routes/userCart";
// import userReviews from "./api/routes/userReviews";
// import payments from "./api/routes/payments";
// import salesOrder from "./api/routes/salesOrder";
// // import initializeSocket from './api/services/socketIO'
// import product from './api/product'

const app = express();
// // const httpServer = createServer(app)

// // app.set("view engine", "ejs");
// initializePassport(passport);

// /*----------->> MIDDLEWARES <<-----------*/

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://artworld-nine.vercel.app"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const sessionMW = session({
//   secret: "keyboard cat",
//   resave: false,
//   saveUninitialized: false,
// })

// app.use(sessionMW);

// app.use(passport.initialize());
// app.use(passport.session());

// /*----------->> ROUTERS <<-----------*/

// app.get('/', (req: any, res: any) => res.send('server running.'))
// app.use("/api/product", product);
// app.use("/auth", authenticationRouter);
// app.use("/products", productRouter);
// app.use("/user", userRouter);
// app.use("/cart", userCart);
// app.use("/imagekit", imageKitRouter);
// app.use("/reviews", userReviews);
// app.use("/rzp", payments);
// app.use("/orders", salesOrder);


// /*----------->> ERROR HANDLER <<-----------*/

// app.use((err: any, req: any, res: any, next: any) => {
//   if (err) {
//     console.log("ERROR HANDLER_SERVER", err);
//     console.log(err);

//     // res.status(err.code).send(err.error);
//   }
// });

// const server = app.listen(3001, () => console.log("server running on port 3001"));
// // initializeSocket(server)



// import product from "./api/product"

app.get("/", (_, res) => res.send('server working'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));