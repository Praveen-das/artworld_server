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
  updateUserAddress,

  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  addToRV,

  addSocialMediaLink,
  removeSocialMediaLink,

  getArtists,
  addFollower,
  removeFollower,
} = userController

const { fetchAdminProducts } = productController

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send(req.user)
});
userRouter.get("/artists", getArtists);
userRouter.post("/artists/follow/:id", addFollower);
userRouter.delete("/artists/unfollow/:id", removeFollower);
userRouter.put("/update", updateUser);
userRouter.post("/signup", signupUser);
userRouter.post("/signin", passport.authenticate("local"), signinUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/products", fetchAdminProducts);

userRouter.post("/address", addUserAddress);
userRouter.delete("/address/:id", deleteUserAddress);

userRouter.get("/wishlist", getUserWishlist);
userRouter.post("/wishlist/add/:id", addToWishlist);
userRouter.delete("/wishlist/remove/:id", removeFromWishlist);

userRouter.post("/rv/add/:id", addToRV);

userRouter.post("/social", addSocialMediaLink);
userRouter.delete("/social/:id", removeSocialMediaLink);

userRouter.get("/:id", getUserById);
userRouter.put("/address", updateUserAddress);

/*---------------------->> ERROR HANDLER <<----------------------*/

userRouter.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.log("ERROR HANDLER USER ROUTER", err);

    res.status(401).send(err)
  }
});

export default userRouter;
