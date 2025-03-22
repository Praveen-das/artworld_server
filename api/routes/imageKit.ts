import express from "express";
import { _imageKit, _deleteFile } from "../services/imageKit";

const router = express.Router();

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.get("/auth", _imageKit);
router.delete("/delete", _deleteFile);

export default router;
