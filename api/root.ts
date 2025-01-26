import express from "express"
import path from "path";

const router = express.Router();

router.get('^/$|/index(.html)?', async (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
});

export default router;
