import { Router } from "express";
import passwordController from "../controller/passwordController";

const router = Router();

router.post("/send-reset-link", passwordController._sendResetLink);

router.patch("/reset", passwordController._resetPassword);

router.patch("/change", passwordController._changePassword);

/*---------------------->> ERROR HANDLER <<----------------------*/

router.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.log("ERROR HANDLER USER ROUTER", err);

    res.status(401).send(err);
  }
});

export default router;
