import express from "express"
const router = express.Router();

router.get("/", async (req: any, res: any) => {
  try {
    res.setHeader('Set-Cookie', ['name=praveen']);
    
    res.send("route working successfully");
    // res.end('New cookie set');
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

export default router;
