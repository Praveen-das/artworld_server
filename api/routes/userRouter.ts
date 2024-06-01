import express from "express";
import { createUser } from "../controller/userController";

export const userRouter = express.Router();

userRouter.post("/create", createUser);
