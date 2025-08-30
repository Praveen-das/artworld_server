import { Router } from "express";
import tokenServices from "../controller/tokenController";

const router = Router();

router.post("/save", tokenServices._saveToken);

router.get("/verify", tokenServices._verifyToken);

router.delete("/delete", tokenServices._deleteToken);

/*---------------------->> ERROR HANDLER <<----------------------*/

router.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.log("ERROR HANDLER TOKEN ROUTER", err);

    res.status(401).send(err);
  }
});

export default router;
