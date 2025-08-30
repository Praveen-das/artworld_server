import { Router } from "express";
import userController from "../controller/userController";
import productController from "../controller/productController";
import { checkAuth } from "../middleware/authentication";
import signInMiddleware from "../middleware/signInMiddleware";

const {
  getUserById,
  createUser,
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
} = userController;

const { fetchAdminProducts } = productController;

const userRouter = Router();

userRouter.get("/", (req, res) => res.send(req.user));

userRouter.get("/artists", getArtists);
userRouter.post("/artists/follow/:id", addFollower);
userRouter.delete("/artists/unfollow/:id", removeFollower);
userRouter.get("/wishlist", getUserWishlist);
userRouter.post("/wishlist/add/:id", addToWishlist);
userRouter.delete("/wishlist/remove/:id", removeFromWishlist);
userRouter.post("/signin", signInMiddleware, signinUser);

userRouter.post("/create", createUser);
userRouter.put("/update", checkAuth, updateUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/products", checkAuth, fetchAdminProducts);

userRouter.post("/address", addUserAddress);
userRouter.delete("/address/:id", checkAuth, deleteUserAddress);

userRouter.post("/rv/add/:id", addToRV);

userRouter.post("/social", addSocialMediaLink);
userRouter.delete("/social/:id", checkAuth, removeSocialMediaLink);

userRouter.put("/address", updateUserAddress);
userRouter.get("/:id", getUserById);

/*---------------------->> ERROR HANDLER <<----------------------*/

userRouter.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.log("ERROR HANDLER USER ROUTER", err);
    res.json({error:err.message});
  }
});

export default userRouter;
