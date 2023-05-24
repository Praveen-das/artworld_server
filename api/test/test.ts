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

router.get("/data", async (req: any, res: any) => {
  try {
    res.json({
      status: 200,
      message: "get route data successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

export default router;
