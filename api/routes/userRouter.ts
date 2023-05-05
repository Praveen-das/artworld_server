import express from "express";
import passport from "passport";
import userController from "../controller/userController";
import productController from '../controller/productController'
import { auth } from "../services/globalServices";

const {
  getUserById,
  signupUser,
  signinUser,
  logoutUser,
  updateUser,
  addUserAddress,
  deleteUserAddress,

  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  addToRV
} = userController

const { fetchAdminProducts } = productController

const userRouter = express.Router();

userRouter.get("/", (req, res) => res.send(req.user));
userRouter.put("/update", updateUser);
userRouter.post("/signup", signupUser);
userRouter.post("/signin", passport.authenticate("local"), signinUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/products", fetchAdminProducts);
userRouter.get("/:id", getUserById);

userRouter.post("/address", addUserAddress);
userRouter.delete("/address/:id", deleteUserAddress);

userRouter.get("/wishlist", getUserWishlist);
userRouter.post("/wishlist/add/:id", addToWishlist);
userRouter.delete("/wishlist/remove/:id", removeFromWishlist);

userRouter.post("/rv/add/:id", addToRV);
// userRouter.put("/address", updateUserAddress);

/*---------------------->> ERROR HANDLER <<----------------------*/

userRouter.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.log("ERROR HANDLER USER ROUTER", err);

    res.status(401).send(err)
  }
});

export default userRouter;
