import express from "express";
import { _imageKit, _deleteFile } from "../services/imageKit";

const router = express.Router();

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.get("/auth", _imageKit);
router.delete("/:id", _deleteFile);

export default router;
