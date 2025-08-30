import { Router } from "express";
import userController from "../controller/userController";
import signInMiddleware from "../middleware/signInMiddleware";

const { signinAdmin, logoutUser } = userController;

const userRouter = Router();

userRouter.get("/", (req, res) => res.send(req.user));
userRouter.post("/signin", signInMiddleware, signinAdmin);
userRouter.get("/signout", logoutUser);

/*---------------------->> ERROR HANDLER <<----------------------*/

userRouter.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.log("ERROR HANDLER USER ROUTER", err);
    res.status(err.code).json(err);
  }
});

export default userRouter;
