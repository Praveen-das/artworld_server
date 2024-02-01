import express from "express"
import path from "path";

const router = express.Router();

router.get('^/$|/index(.html)?', async (req: any, res: any) => {
  res.sendFile("index.html", { root: './public' })
});

export default router;
