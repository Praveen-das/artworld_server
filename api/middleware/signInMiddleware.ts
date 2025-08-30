import { Request, Response, NextFunction } from "express";

const signInMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const credentials = req.body;

  if (!credentials || (!credentials.email && !credentials.password))
    return res.send(400).json("Credentials not provided");

  next()
};

export default signInMiddleware
