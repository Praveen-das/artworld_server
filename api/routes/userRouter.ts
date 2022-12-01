import express from "express";
import passport from "passport";
import userController from "../controller/userController";
import productController from '../controller/productController'
import { auth } from "../services/globalServices";

const {
  signupUser,
  signinUser,
  logoutUser,
  updateUser,
  sendEmailVerification,
  confirmVerification,
  addUserAddress,
  deleteUserAddress,
} = userController

const { fetchAdminProducts } = productController

const userRouter = express.Router();

userRouter.get("/", auth, (req, res) => res.json(req.user));
userRouter.put("/update", updateUser);
userRouter.post("/signup", signupUser);
userRouter.post("/signin", passport.authenticate("local"), signinUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/products", fetchAdminProducts);

// userRouter.get("/address", auth, (req: any, res) => res.json(req.user.address));
userRouter.post("/address", addUserAddress);
userRouter.delete("/address/:id", deleteUserAddress);
// userRouter.put("/address", updateUserAddress);

/*---------------------->> ERROR HANDLER <<----------------------*/

userRouter.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.log("ERROR HANDLER USER ROUTER", err);
    res.status(err.code).send(err.error);
  }
});

export default userRouter;
