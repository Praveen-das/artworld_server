import express from "express";
import { _imageKitGetAuth, _deleteFile } from "../Services/imageKit";

const router = express.Router();

router.get("/auth", _imageKitGetAuth);
router.delete("/delete", _deleteFile);

export default router;
