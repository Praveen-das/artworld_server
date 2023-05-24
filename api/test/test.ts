import express from "express"
const router = express.Router();

router.get("/", async (req: any, res: any) => {
  try {
    res.json({
      status: 200,
      message: "test route working successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

export default router;
