import express from "express";
import cors from "cors";

import { userRouter } from "./api/routes/userRouter";
import productRouter from "./api/routes/products";
import imageKitRouter from "./api/routes/imageKit";

const app = express();

/*----------->> MIDDLEWARE <<-----------*/
app.use(cors());
app.use(express.json());

/*----------->> ROUTERS <<-----------*/
app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/imagekit", imageKitRouter);

app.listen(3001, () => console.log("server running on port 3001"));
