import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const idCheck = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const id = Number(req.params.id);
  const authorizationHeader = req.headers.authorization as unknown as string;
  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET as unknown as string
    );
    // @ts-ignore
    if (decoded.id !== id) {
      throw new Error("User id does not match!");
    }

    next();
  } catch (err) {
    res.status(401).send("Access denied");
    return;
  }
};

export default idCheck;
